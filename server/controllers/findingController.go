package controllers

import (
	"disarm/main/models"
	"disarm/main/utils/token"
	"encoding/json"
	"fmt"
	"html"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreateFinding(c *gin.Context) {
	// var body struct {
	// 	Title             string `json:"title" binding:"required"`
	// 	Risk              string `json:"risk" binding:"required"`
	// 	ImpactedSystem    string `json:"impacted_system" binding:"required"`
	// 	Description       string `json:"description" binding:"required"`
	// 	Steps             string `json:"steps" binding:"required"`
	// 	Recommendations   string `json:"recommendations" binding:"required"`
	// 	Evidences         string `json:"evidences" binding:"required"`
	// 	FixedEvidences    string `json:"fixed_evidences" binding:"required"`
	// 	ChecklistDetailId string `json:"checklist_detail_id" binding:"required"`
	// 	ProjectId         string `json:"project_id" binding:"required"`
	// }

	// if err := c.ShouldBindJSON(&body); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"jsonerror": err.Error(),
	// 	})
	// 	return
	// }

	form, formErr := c.MultipartForm()
	if formErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"formerror": formErr.Error(),
		})
		return
	}

	fmt.Println(form.Value["title"][0])
	title := form.Value["title"][0]
	risk := form.Value["risk"][0]
	impactedSystem := form.Value["impacted_system"][0]
	checklistDetailId := form.Value["checklist_detail_id"][0]
	projectId := form.Value["project_id"][0]
	stepsJson := form.Value["steps"][0]
	recommendationsJson := form.Value["recommendations"][0]
	evidencesJson := form.Value["evidences"][0]
	fixedEvidencesJson := form.Value["fixed_evidences"][0]

	var steps any
	var recommendations any
	var evidences any
	var fixedEvidences any

	evidenceImages := form.File["evidence_images"]
	fixedEvidenceImages := form.File["fixed_evidence_images"]

	jsonErr := json.Unmarshal([]byte(stepsJson), &steps)
	jsonErr2 := json.Unmarshal([]byte(recommendationsJson), &recommendations)
	jsonErr3 := json.Unmarshal([]byte(evidencesJson), &evidences)
	jsonErr4 := json.Unmarshal([]byte(fixedEvidencesJson), &fixedEvidences)

	if jsonErr != nil || jsonErr2 != nil || jsonErr3 != nil || jsonErr4 != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "Invalid JSON",
		})
		return
	}

	fmt.Println(steps)
	//TODO:
	//UBAH NAMA FILE DI JSON
	//MASUKIN JSON JUGA DI CREATE
	for _, file := range evidenceImages {
		extension := filepath.Ext(file.Filename)
		newFileName := file.Filename + "_" + strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10) + extension

		c.SaveUploadedFile(file, "./upload/"+newFileName)
	}

	for _, file := range fixedEvidenceImages {
		extension := filepath.Ext(file.Filename)
		newFileName := file.Filename + "_" + strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10) + extension

		c.SaveUploadedFile(file, "./upload/"+newFileName)
	}

	escapedTitle := html.EscapeString(strings.TrimSpace(title))
	escapedRisk := html.EscapeString(strings.TrimSpace(risk))
	escapedImpactedSystem := html.EscapeString(strings.TrimSpace(impactedSystem))
	escapedChecklistDetailId := html.EscapeString(strings.TrimSpace(checklistDetailId))
	escapedProjectId := html.EscapeString(strings.TrimSpace(projectId))

	projectUuid, errProject := uuid.FromString(escapedProjectId)

	if errProject != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"projecterror": errProject.Error(),
		})
		return
	}

	project, dbErr := models.Projects.GetOneById(projectUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"projecterror": dbErr,
		})
		return
	}

	createdByUuid, err := token.ExtractTokenID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}

	finding, dbErr := models.Findings.Create(escapedTitle, escapedRisk, escapedImpactedSystem, escapedChecklistDetailId, projectUuid, project.ChecklistId, createdByUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"finding": finding,
	})
	// c.JSON(200, gin.H{
	// 	"finding": "finding",
	// })
}

func GetAllFinding(c *gin.Context) {
	findings, dbErr := models.Findings.GetAll()

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"findings": findings,
	})
}

func GetFindingById(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	finding, dbErr := models.Findings.GetOneById(uuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"finding": finding,
	})
}

func EditFinding(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Title             string `json:"title" binding:"required"`
		Risk              string `json:"risk" binding:"required"`
		ImpactedSystem    string `json:"impacted_system" binding:"required"`
		ChecklistDetailId string `json:"checklist_detail_id" binding:"required"`
		ProjectId         string `json:"project_id" binding:"required"`
		ChecklistId       string `json:"checklist_id" binding:"required"`
		UserId            string `json:"user_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedTitle := html.EscapeString(strings.TrimSpace(body.Title))
	escapedRisk := html.EscapeString(strings.TrimSpace(body.Risk))
	escapedImpactedSystem := html.EscapeString(strings.TrimSpace(body.ImpactedSystem))
	escapedChecklistDetailId := html.EscapeString(strings.TrimSpace(body.ChecklistDetailId))
	escapedProjectId := html.EscapeString(strings.TrimSpace(body.ProjectId))
	escapedChecklistId := html.EscapeString(strings.TrimSpace(body.ChecklistId))
	escapedUserId := html.EscapeString(strings.TrimSpace(body.UserId))

	idUuid, errUuid := uuid.FromString(escapedId)
	projectUuid, errProject := uuid.FromString(escapedProjectId)
	checklistUuid, errChecklist := uuid.FromString(escapedChecklistId)
	userUuid, errUser := uuid.FromString(escapedUserId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	if errProject != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errProject.Error(),
		})
		return
	}

	if errChecklist != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errChecklist.Error(),
		})
		return
	}

	if errUser != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUser.Error(),
		})
		return
	}

	finding, dbErr := models.Findings.Edit(idUuid, escapedTitle, escapedRisk, escapedImpactedSystem, escapedChecklistDetailId, projectUuid, checklistUuid, userUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"finding": finding,
	})
}
