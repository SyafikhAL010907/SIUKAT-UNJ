package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"time"
)

type ValueService struct{}

func (s *ValueService) GetByLoggedIn(noPeserta string) (models.Value, error) {
	db := config.DB
	var value models.Value

	err := db.Where("no_peserta = ?", noPeserta).First(&value).Error
	return value, err
}

func (s *ValueService) Add(v models.Value, atribut string) (models.Value, error) {
	db := config.DB

	v.Atribut = atribut

	err := db.Create(&v).Error
	return v, err
}

func (s *ValueService) AddLog(v models.Value, executor string, timestamp time.Time, atribut string) (models.LogValue, error) {
	db := config.DB

	if atribut == "" {
		atribut = "original"
	}

	logVal := models.LogValue{
		NoPeserta: v.NoPeserta,
		V1:        v.V1,
		V2:        v.V2,
		V3:        v.V3,
		V4:        v.V4,
		V5:        v.V5,
		Av1:       v.Av1,
		Bv2:       v.Bv2,
		Cv3:       v.Cv3,
		Dv4:       v.Dv4,
		Ev5:       v.Ev5,
		Ikb:       v.Ikb,
		Atribut:   atribut,
		Executor:  executor,
		Timestamp: timestamp,
	}

	err := db.Create(&logVal).Error
	return logVal, err
}
