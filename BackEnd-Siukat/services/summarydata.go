package services

import (
	"BackEnd-Siukat/config"
)

type SummaryService struct{}

type SummaryResult struct {
	Total           int64 `json:"total"`
	TotalMulai      int64 `json:"total_mulai"`
	TotalPengisian  int64 `json:"total_pengisian"`
	TotalSelesai    int64 `json:"total_selesai"`
	TotalTerimaUkt  int64 `json:"total_terima_ukt"`
}

func (s *SummaryService) GetSummary() (SummaryResult, error) {
	var result SummaryResult

	config.DB.Raw(`SELECT
		COUNT(*) as total,
		SUM(CASE WHEN waktu_mulai > 0 THEN 1 ELSE 0 END) as total_mulai,
		SUM(CASE WHEN flag = 'pengisian' THEN 1 ELSE 0 END) as total_pengisian,
		SUM(CASE WHEN flag IN ('selesai_isi','terima_ukt') THEN 1 ELSE 0 END) as total_selesai,
		SUM(CASE WHEN flag = 'terima_ukt' THEN 1 ELSE 0 END) as total_terima_ukt
		FROM tb_cmahasiswa
		WHERE no_peserta NOT LIKE '%fulan%'
	`).Scan(&result)

	return result, nil
}
