package controllers

import (
	"disarm/main/models"
	"disarm/main/utils/token"
	"encoding/json"
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

	type EvidencesItem struct {
		Image   string `json:"image" binding:"required"`
		Content string `json:"content" binding:"required"`
	}

	form, formErr := c.MultipartForm()
	if formErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"formerror": formErr.Error(),
		})
		return
	}

	title := form.Value["title"][0]
	risk := form.Value["risk"][0]
	impactedSystem := form.Value["impacted_system"][0]
	checklistDetailId := form.Value["checklist_detail_id"][0]
	description := form.Value["description"][0]
	projectId := form.Value["project_id"][0]
	stepsJson := form.Value["steps"][0]
	recommendationsJson := form.Value["recommendations"][0]
	evidencesJson := form.Value["evidences"][0]
	fixedEvidencesJson := form.Value["fixed_evidences"][0]

	var evidences []EvidencesItem
	var fixedEvidences []EvidencesItem

	evidenceImages := form.File["evidence_images"]
	fixedEvidenceImages := form.File["fixed_evidence_images"]

	jsonErr1 := json.Unmarshal([]byte(evidencesJson), &evidences)
	jsonErr2 := json.Unmarshal([]byte(fixedEvidencesJson), &fixedEvidences)

	if jsonErr1 != nil || jsonErr2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "Invalid JSON",
		})
		return
	}

	for idx, file := range evidenceImages {
		extension := filepath.Ext(file.Filename)
		rawFileName := strings.TrimSuffix(file.Filename, filepath.Ext(file.Filename))
		newFileName := rawFileName + "_" + strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10) + extension
		evidences[idx].Image = newFileName

		c.SaveUploadedFile(file, "./upload/"+newFileName)
	}

	for idx, file := range fixedEvidenceImages {
		extension := filepath.Ext(file.Filename)
		rawFileName := strings.TrimSuffix(file.Filename, filepath.Ext(file.Filename))
		newFileName := rawFileName + "_" + strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10) + extension
		fixedEvidences[idx].Image = newFileName

		c.SaveUploadedFile(file, "./upload/"+newFileName)
	}

	newEvidencesJson, jsonErr3 := json.Marshal(evidences)
	newFixedEvidencesJson, jsonErr4 := json.Marshal(fixedEvidences)

	if jsonErr3 != nil || jsonErr4 != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "Invalid JSON",
		})
		return
	}

	escapedTitle := html.EscapeString(strings.TrimSpace(title))
	escapedRisk := html.EscapeString(strings.TrimSpace(risk))
	escapedImpactedSystem := html.EscapeString(strings.TrimSpace(impactedSystem))
	escapedDescription := html.EscapeString(strings.TrimSpace(description))
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

	finding, dbErr := models.Findings.Create(escapedTitle, escapedRisk, escapedImpactedSystem, escapedDescription, stepsJson, recommendationsJson, string(newEvidencesJson), string(newFixedEvidencesJson), escapedChecklistDetailId, projectUuid, project.ChecklistId, createdByUuid)

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
	// var body struct {
	// 	Title             string `json:"title" binding:"required"`
	// 	Risk              string `json:"risk" binding:"required"`
	// 	ImpactedSystem    string `json:"impacted_system" binding:"required"`
	// 	ChecklistDetailId string `json:"checklist_detail_id" binding:"required"`
	// 	ProjectId         string `json:"project_id" binding:"required"`
	// 	ChecklistId       string `json:"checklist_id" binding:"required"`
	// 	UserId            string `json:"user_id" binding:"required"`
	// }

	// if err := c.ShouldBindJSON(&body); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"error": err.Error(),
	// 	})
	// 	return
	// }
	type EvidencesItem struct {
		Image   string `json:"image" binding:"required"`
		Content string `json:"content" binding:"required"`
	}

	form, formErr := c.MultipartForm()
	if formErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"formerror": formErr.Error(),
		})
		return
	}

	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	title := form.Value["title"][0]
	risk := form.Value["risk"][0]
	impactedSystem := form.Value["impacted_system"][0]
	checklistDetailId := form.Value["checklist_detail_id"][0]
	description := form.Value["description"][0]
	status := form.Value["status"][0]
	stepsJson := form.Value["steps"][0]
	recommendationsJson := form.Value["recommendations"][0]
	evidencesJson := form.Value["evidences"][0]
	fixedEvidencesJson := form.Value["fixed_evidences"][0]

	var evidences []EvidencesItem
	var fixedEvidences []EvidencesItem

	evidenceImages := form.File["evidence_images"]
	fixedEvidenceImages := form.File["fixed_evidence_images"]

	jsonErr1 := json.Unmarshal([]byte(evidencesJson), &evidences)
	jsonErr2 := json.Unmarshal([]byte(fixedEvidencesJson), &fixedEvidences)

	if jsonErr1 != nil || jsonErr2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "Invalid JSON",
		})
		return
	}

	for idx, file := range evidenceImages {
		if file.Filename == "NO_IMAGE_PROVIDED.disarm" {
			continue
		}

		extension := filepath.Ext(file.Filename)
		rawFileName := strings.TrimSuffix(file.Filename, filepath.Ext(file.Filename))
		newFileName := rawFileName + "_" + strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10) + extension
		evidences[idx].Image = newFileName

		c.SaveUploadedFile(file, "./upload/"+newFileName)
	}

	for idx, file := range fixedEvidenceImages {
		if file.Filename == "NO_IMAGE_PROVIDED.disarm" {
			continue
		}

		extension := filepath.Ext(file.Filename)
		rawFileName := strings.TrimSuffix(file.Filename, filepath.Ext(file.Filename))
		newFileName := rawFileName + "_" + strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10) + extension
		fixedEvidences[idx].Image = newFileName

		c.SaveUploadedFile(file, "./upload/"+newFileName)
	}

	newEvidencesJson, jsonErr3 := json.Marshal(evidences)
	newFixedEvidencesJson, jsonErr4 := json.Marshal(fixedEvidences)

	if jsonErr3 != nil || jsonErr4 != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "Invalid JSON",
		})
		return
	}

	escapedTitle := html.EscapeString(strings.TrimSpace(title))
	escapedRisk := html.EscapeString(strings.TrimSpace(risk))
	escapedImpactedSystem := html.EscapeString(strings.TrimSpace(impactedSystem))
	escapedDescription := html.EscapeString(strings.TrimSpace(description))
	escapedChecklistDetailId := html.EscapeString(strings.TrimSpace(checklistDetailId))
	escapedStatus := html.EscapeString(strings.TrimSpace(status))

	finding, dbErr := models.Findings.Edit(uuid, escapedTitle, escapedRisk, escapedImpactedSystem, escapedDescription, stepsJson, recommendationsJson, string(newEvidencesJson), string(newFixedEvidencesJson), escapedChecklistDetailId, escapedStatus)

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
