package controllers

import (
	"disarm/main/models"
	"disarm/main/utils/token"
	"encoding/json"
	"fmt"
	"html"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

var PROJECT_ACTION_TYPES = []string{"view", "view-detail", "edit", "delete"}
var PROJECT_FINDING_ACTION_TYPES = []string{"create"}

func CreateProject(c *gin.Context) {
	var body struct {
		Name        string `json:"name" binding:"required"`
		Company     string `json:"company" binding:"required"`
		Phase       string `json:"phase"`
		StartDate   string `json:"start_date" binding:"required"`
		EndDate     string `json:"end_date" binding:"required"`
		ChecklistId string `json:"checklist" binding:"required"`
		InheritedProjectId string `json:"inherited_project"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedName := html.EscapeString(strings.TrimSpace(body.Name))
	escapedCompany := html.EscapeString(strings.TrimSpace(body.Company))
	escapedPhase := html.EscapeString(strings.TrimSpace(body.Phase))
	// escapedStartDate := html.EscapeString(strings.TrimSpace(body.StartDate))
	// escapedEndDate := html.EscapeString(strings.TrimSpace(body.EndDate))
	escapedChecklistId := html.EscapeString(strings.TrimSpace(body.ChecklistId))
	escapedInheritedProjectId := html.EscapeString(strings.TrimSpace(body.InheritedProjectId))
	checklistUuid, errUuid := uuid.FromString(escapedChecklistId)
	inheritedProjectUuid := uuid.FromStringOrNil(escapedInheritedProjectId)

	if escapedPhase == "" {
		escapedPhase = "Idle"
	}

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	startDate, sErr := time.Parse("2006-01-02", body.StartDate)
	if sErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": sErr.Error(),
		})
		return
	}

	endDate, eErr := time.Parse("2006-01-02", body.EndDate)
	if eErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": eErr.Error(),
		})
		return	
	}

	var inheritedProject models.Project
	if inheritedProjectUuid != uuid.Nil {
		var inheritedProjectErr error
		inheritedProject, inheritedProjectErr = models.Projects.GetOneById(inheritedProjectUuid)
		if inheritedProjectErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": inheritedProjectErr,
			})
			return
		}

		escapedPhase = inheritedProject.Phase
	}

	project, dbErr := models.Projects.Create(escapedName, escapedCompany, escapedPhase, startDate, endDate, checklistUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	permissionErr := CreatePermission(PROJECT_ACTION_TYPES, "project", project.ID, project.Name)
	if permissionErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": permissionErr,
		})
		return
	}

	findingPermissionErr := CreatePermission(PROJECT_FINDING_ACTION_TYPES, "finding", project.ID, project.Name)
	if findingPermissionErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": findingPermissionErr,
		})
		return
	}

	if inheritedProjectUuid != uuid.Nil {
		_, updateSectionDbErr := models.Projects.EditSection(project.ID, inheritedProject.Sections)
		if updateSectionDbErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": updateSectionDbErr,
			})
			return
		}

		type EvidencesItem struct {
			Image   string `json:"image" binding:"required"`
			Content string `json:"content" binding:"required"`
		}

		copyImage := func(path string) (string, error) {
			sourceFilePath := "./upload/" + path
			splitFileName := strings.Split(path, "_")
			extension := filepath.Ext(path)

			newFileName := strings.Join(splitFileName[:len(splitFileName)-1], "_") + "_" + strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10) + extension
			fmt.Println("called at join filename")
			fmt.Println(newFileName)

			sourceFileDir := filepath.Dir(sourceFilePath)
			newFilePath := filepath.Join(sourceFileDir, newFileName)

			sourceFile, openSourceEvidenceErr := os.Open(sourceFilePath)
			if openSourceEvidenceErr != nil {
				return newFileName, openSourceEvidenceErr
			}
			defer sourceFile.Close()

			destinationFile, createDestFileErr := os.Create(newFilePath)
			if createDestFileErr != nil {
				return newFileName, createDestFileErr
			}
			defer destinationFile.Close()

			_, copyImageErr := io.Copy(destinationFile, sourceFile)
			if copyImageErr != nil {
				return newFileName, copyImageErr
			}

			return newFileName, nil
		}


		for _, finding := range inheritedProject.Findings {
			var evidences []EvidencesItem
			var fixedEvidences []EvidencesItem
			
			jsonParseErr1 := json.Unmarshal([]byte(finding.Evidences), &evidences)
			jsonParseErr2 := json.Unmarshal([]byte(finding.FixedEvidences), &fixedEvidences)

			if jsonParseErr1 != nil || jsonParseErr2 != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"Error": "Invalid JSON Parse of Inherited Project!",
				})
				return
			}

			
			for idx, evidence := range evidences {
				fmt.Println("Called at copu evidence")
				newImagePath, _ := copyImage(evidence.Image)
				evidences[idx].Image = newImagePath
			}

			for idx, fixedEvidence := range fixedEvidences {
				fmt.Println("Called at copu fixed evidence")
				newImagePath, _ := copyImage(fixedEvidence.Image)
				fixedEvidences[idx].Image = newImagePath
			}

			newEvidencesJson, jsonErr3 := json.Marshal(evidences)
			newFixedEvidencesJson, jsonErr4 := json.Marshal(fixedEvidences)
		
			if jsonErr3 != nil || jsonErr4 != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"Error": "Invalid JSON",
				})
				return
			}

			finding, createFindingDbErr := models.Findings.Create(finding.Title, finding.Risk, finding.ImpactedSystem, finding.Description, finding.Steps, finding.Recommendations, string(newEvidencesJson), string(newFixedEvidencesJson), finding.ChecklistDetailId, project.ID, project.ChecklistId, finding.UserId)

			if createFindingDbErr != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": createFindingDbErr,
				})
				return
			}
		
			permissionErr := CreatePermission(FINDING_ACTION_TYPES, "finding", finding.ID, finding.Title)
			if permissionErr != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": permissionErr,
				})
				return
			}
		}

	}

	c.JSON(200, gin.H{
		"project": project,
	})
}

func GetAllProject(c *gin.Context) {
	t, terr := token.ValidateToken(c)
	if terr != nil {
		c.String(http.StatusUnauthorized, "Unauthorized")
		c.Abort()
		return
	}

	ps, pserr := GetUserPermissions(t.String())
	if pserr != nil {
		c.String(http.StatusInternalServerError, "Error Parsing Permissions")
		c.Abort()
		return
	}

	all := false
	pids := []uuid.UUID{}
	for id, _ := range ps.ViewPermissions.Project {
		if id == "*" {
			all = true
			break
		}

		uid, uiderr := uuid.FromString(id)

		if uiderr != nil {
			c.String(http.StatusInternalServerError, "Error Parsing Permissions")
			c.Abort()
			return
		}

		pids = append(pids, uid)
	}

	var projects []models.Project
	var dbErr error

	if all {
		projects, dbErr = models.Projects.GetAll()
	} else {
		projects, dbErr = models.Projects.GetManyByIds(pids)
	}

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"projects": projects,
	})
}

func GetProjectById(c *gin.Context) {
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"project": project,
	})
}

func EditProject(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Name      string `json:"name" binding:"required"`
		Company   string `json:"company" binding:"required"`
		Phase     string `json:"phase" binding:"required"`
		StartDate string `json:"start_date" binding:"required"`
		EndDate   string `json:"end_date" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedName := html.EscapeString(strings.TrimSpace(body.Name))
	escapedCompany := html.EscapeString(strings.TrimSpace(body.Company))
	escapedPhase := html.EscapeString(strings.TrimSpace(body.Phase))

	idUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	startDate, sErr := time.Parse("2006-01-02", body.StartDate)
	if sErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": sErr.Error(),
		})
		return
	}

	endDate, eErr := time.Parse("2006-01-02", body.EndDate)
	if eErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": eErr.Error(),
		})
		return
	}

	project, dbErr := models.Projects.Edit(idUuid, escapedName, escapedCompany, escapedPhase, startDate, endDate)

	if dbErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": dbErr.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"project": project,
	})
}

func EditProjectSection(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Sections string `json:"sections" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedSections := strings.TrimSpace(body.Sections)

	idUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	project, dbErr := models.Projects.EditSection(idUuid, escapedSections)

	if dbErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": dbErr.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"project": project,
	})
}

func DeleteProject(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	idUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	// uuids := []uuid.UUID{idUuid}

	// result, dbErr := models.Projects.Delete(uuids)
	result, dbErr := models.Projects.Delete(idUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	// for _, idUuid := range uuids {
		permissionErr := DeletePermission(PROJECT_ACTION_TYPES, "project", idUuid)
		if permissionErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": permissionErr,
			})
			return
		}

		findingPermissionErr := DeletePermission(PROJECT_FINDING_ACTION_TYPES, "finding", idUuid)
		if findingPermissionErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": findingPermissionErr,
			})
			return
		}
	// }

	c.JSON(200, gin.H{
		"result": result,
	})
}

func DeleteProjectByIds(c *gin.Context) {
	var body struct {
		Id string `json:"id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// var parsedUuids []uuid.UUID
	// for _, element := range body.Ids {
	// 	parsedUuids = append(parsedUuids, uuid.FromStringOrNil(html.EscapeString(strings.TrimSpace(element))))
	// }

	escapedId := html.EscapeString(strings.TrimSpace(body.Id))
	idUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	result, dbErr := models.Projects.Delete(idUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	// for _, idUuid := range parsedUuids {
		permissionErr := DeletePermission(PROJECT_ACTION_TYPES, "project", idUuid)
		if permissionErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": permissionErr,
			})
			return
		}

		findingPermissionErr := DeletePermission(PROJECT_FINDING_ACTION_TYPES, "finding", idUuid)
		if findingPermissionErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": findingPermissionErr,
			})
			return
		}
	// }

	c.JSON(200, gin.H{
		"result": result,
	})
}
