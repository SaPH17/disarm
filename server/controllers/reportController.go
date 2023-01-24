package controllers

import (
	"disarm/main/models"
	"encoding/json"
	"fmt"
	"html"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/SebastiaanKlippert/go-wkhtmltopdf"
	"github.com/cbroglie/mustache"
	"github.com/gin-gonic/gin"

	uuid "github.com/satori/go.uuid"
)

type EvidencesItem struct {
	Image   string `json:"image" binding:"required"`
	Content string `json:"content" binding:"required"`
}

var TEMPLATE_FOLDER string = "./templates/"
var UPLOAD_FOLDER string = "http://localhost:8000/upload/"
var TARGET_FOLDER string = "./reports/"
var STYLE_TEMPLATE_PATH string = TEMPLATE_FOLDER + "style-template.html"
var PROJECT_REPORT_TEMPLATE_PATH string = TEMPLATE_FOLDER + "project-report-template.html"
var FINDING_REPORT_TEMPLATE_PATH string = TEMPLATE_FOLDER + "finding-report-template.html"
var EVIDENCE_REPORT_TEMPLATE_PATH string = TEMPLATE_FOLDER + "evidence-report-template.html"
var PAGE_BREAK string = `<p style="page-break-before: always"></p>`

func CreateReport(c *gin.Context) {

	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	project, dbErr := models.Projects.GetOneById(uuid)
	if dbErr != nil {
		return
	}

	var closedFinding int = 0
	var fixedFinding int = 0
	for _, finding := range project.Findings {
		if finding.Status == "Closed on Notes" {
			closedFinding += 1
		} else if finding.Status == "Fixed" {
			fixedFinding += 1
		}
	}

	projectData := map[string]string{
		"projectName":        project.Name,
		"totalFinding":       strconv.Itoa(len(project.Findings)),
		"totalFixedFinding":  strconv.Itoa(fixedFinding),
		"totalClosedFinding": strconv.Itoa(closedFinding),
	}
	styleBuf, sErr := os.ReadFile(STYLE_TEMPLATE_PATH)
	if sErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": sErr.Error(),
		})
		return
	}
	styleOutput := string(styleBuf)

	projectOutput, mErr := mustache.RenderFile(PROJECT_REPORT_TEMPLATE_PATH, projectData)
	if mErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": mErr.Error(),
		})
		return
	}

	var evidences []EvidencesItem
	var fixedEvidences []EvidencesItem

	var findingOutput string = ""

	for _, finding := range project.Findings {

		if jsonError := json.Unmarshal([]byte(finding.Evidences), &evidences); jsonError != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": jsonError.Error(),
			})
			return
		}

		if jsonError := json.Unmarshal([]byte(finding.FixedEvidences), &fixedEvidences); jsonError != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": jsonError.Error(),
			})
			return
		}

		evidenceOutput, err := getFindingOutput(evidences)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
		}
		fixedEvidenceOutput, err := getFindingOutput(fixedEvidences)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
		}

		findingData := map[string]string{
			"findingTitle":          finding.Title,
			"findingRisk":           finding.Risk,
			"findingImpactedSystem": finding.ImpactedSystem,
			"findingEvidences":      evidenceOutput,
			"findingFixedEvidences": fixedEvidenceOutput,
		}

		fOutput, err := mustache.RenderFile(FINDING_REPORT_TEMPLATE_PATH, findingData)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		findingOutput += PAGE_BREAK + fOutput
	}

	output := styleOutput + projectOutput + findingOutput
	filename := project.Name + "_" + strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10) + ".pdf"

	if generateErr := generatePdf(output, TARGET_FOLDER+filename); generateErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": generateErr.Error(),
		})
		return
	}

	report, dbErr := models.Reports.Create(filename, uuid)
	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"report": report,
	})
}

func getFindingOutput(evidences []EvidencesItem) (string, error) {
	var evidenceOutput string = ""
	for _, evidence := range evidences {
		evidencesData := map[string]string{
			"evidenceImage":       UPLOAD_FOLDER + evidence.Image,
			"evidenceDescription": evidence.Content,
		}
		eOutput, err := mustache.RenderFile(EVIDENCE_REPORT_TEMPLATE_PATH, evidencesData)
		if err != nil {
			return "", err
		}
		evidenceOutput += eOutput
	}

	return evidenceOutput, nil
}

func generatePdf(output string, filename string) error {
	fmt.Println("Output : " + output)

	wkhtmltopdf.SetPath("./wkhtmltopdf.exe")
	pdfg, err := wkhtmltopdf.NewPDFGenerator()
	if err != nil {
		return err
	}

	pdfg.Dpi.Set(300)
	pdfg.Orientation.Set(wkhtmltopdf.OrientationPortrait)

	page := wkhtmltopdf.NewPageReader(strings.NewReader(output))
	page.EnableLocalFileAccess.Set(true)
	pdfg.AddPage(page)

	if err = pdfg.Create(); err != nil {
		return err
	}

	if err = pdfg.WriteFile(filename); err != nil {
		return err
	}

	fmt.Println("pdf created successfully")
	return nil
}

func GetAllReport(c *gin.Context) {
	reports, dbErr := models.Reports.GetAll()

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"reports": reports,
	})
}

func GetReportById(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	report, dbErr := models.Reports.GetOneById(uuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"report": report,
	})
}
