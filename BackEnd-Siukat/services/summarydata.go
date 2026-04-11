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

	err := config.DB.Raw(`SELECT
		COUNT(*) as total,
		SUM(CASE WHEN waktu_mulai > 0 THEN 1 ELSE 0 END) as total_mulai,
		SUM(CASE WHEN flag = 'pengisian' THEN 1 ELSE 0 END) as total_pengisian,
		SUM(CASE WHEN flag IN ('selesai_isi','terima_ukt') THEN 1 ELSE 0 END) as total_selesai,
		SUM(CASE WHEN flag = 'terima_ukt' THEN 1 ELSE 0 END) as total_terima_ukt
		FROM tb_cmahasiswa
		WHERE no_peserta NOT LIKE '%fulan%'
	`).Scan(&result).Error

	return result, err
}

type SummaryDistribution struct {
	Fakultas       string `json:"fakultas" gorm:"column:fakultas"`
	Prodi          string `json:"prodi" gorm:"column:prodi"`
	TotalMahasiswa int64  `json:"total_mahasiswa" gorm:"column:total_mahasiswa"`
	I              int64  `json:"I" gorm:"column:I"`
	II             int64  `json:"II" gorm:"column:II"`
	III            int64  `json:"III" gorm:"column:III"`
	IV             int64  `json:"IV" gorm:"column:IV"`
	V              int64  `json:"V" gorm:"column:V"`
	VI             int64  `json:"VI" gorm:"column:VI"`
	VII            int64  `json:"VII" gorm:"column:VII"`
	VIII           int64  `json:"VIII" gorm:"column:VIII"`
	Bidikmisi      int64  `json:"bidikmisi" gorm:"column:bidikmisi"`
	TotalUkt       int64  `json:"total_ukt" gorm:"column:total_ukt"`
	Subtotal       int64  `json:"subtotal"`
}

func (s *SummaryService) FetchByFakultas() ([]SummaryDistribution, error) {
	var rows []SummaryDistribution
	query := `select
                    fakultas,
                    count(*) as total_mahasiswa,
                    sum(case when golongan_id = 'I' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as I,
                    sum(case when golongan_id = 'II' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as II,
                    sum(case when golongan_id = 'III' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as III,
                    sum(case when golongan_id = 'IV' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as IV,
                    sum(case when golongan_id = 'V' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as V,
                    sum(case when golongan_id = 'VI' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as VI,
                    sum(case when golongan_id = 'VII' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as VII,
                    sum(case when golongan_id = 'VIII' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as VIII,
                    sum(case when bidik_misi_cmahasiswa = 'Ya' then 1 else 0 end) as bidikmisi,
                    sum(case when bidik_misi_cmahasiswa = 'Ya' then 2400000 else nilai_ukt end) as total_ukt
                from
                    (
                    SELECT
                        nama_cmahasiswa,
                        prodi_cmahasiswa,
                        jalur_cmahasiswa,
                        id_ukt,
                        bidik_misi_cmahasiswa,
                        golongan_id,
                        case
                            when golongan_id = 'I' then b.I
                            when golongan_id = 'II' then b.II
                            when golongan_id = 'III' then b.III
                            when golongan_id = 'IV' then b.IV
                            when golongan_id = 'V' then b.V
                            when golongan_id = 'VI' then b.VI
                            when golongan_id = 'VII' then b.VII
                            when golongan_id = 'VIII' then b.VIII
                            when golongan_id = '' then 0
                            else 0
                        end as nilai_ukt,
                        COALESCE(c.nama, 'Tanpa Fakultas') as fakultas
                    FROM
                        tb_cmahasiswa a
                    left join ref_ukt b on
                        a.prodi_cmahasiswa = b.major_id
                        and a.jalur_cmahasiswa = b.entrance
                    left join ref_fakultas c on
                        a.fakultas_cmahasiswa = c.kode
                    where
                        a.no_peserta not like '%fulan%' ) as a
                group by
                    fakultas`

	err := config.DB.Raw(query).Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	for i := range rows {
		rows[i].Subtotal = rows[i].I + rows[i].II + rows[i].III + rows[i].IV + rows[i].V + rows[i].VI + rows[i].VII + rows[i].VIII
	}

	return rows, nil
}

func (s *SummaryService) FetchByProdi() ([]SummaryDistribution, error) {
	var rows []SummaryDistribution
	query := `select
                    prodi,
                    count(*) as total_mahasiswa,
                    sum(case when golongan_id = 'I' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as I,
                    sum(case when golongan_id = 'II' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as II,
                    sum(case when golongan_id = 'III' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as III,
                    sum(case when golongan_id = 'IV' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as IV,
                    sum(case when golongan_id = 'V' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as V,
                    sum(case when golongan_id = 'VI' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as VI,
                    sum(case when golongan_id = 'VII' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as VII,
                    sum(case when golongan_id = 'VIII' and bidik_misi_cmahasiswa = 'Tidak' then 1 else 0 end) as VIII,
                    sum(case when bidik_misi_cmahasiswa = 'Ya' then 1 else 0 end) as bidikmisi,
                    sum(case when bidik_misi_cmahasiswa = 'Ya' then 2400000 else nilai_ukt end) as total_ukt
                from
                    (
                    SELECT
                        nama_cmahasiswa,
                        prodi_cmahasiswa,
                        jalur_cmahasiswa,
                        id_ukt,
                        bidik_misi_cmahasiswa,
                        golongan_id,
                        case
                            when golongan_id = 'I' then b.I
                            when golongan_id = 'II' then b.II
                            when golongan_id = 'III' then b.III
                            when golongan_id = 'IV' then b.IV
                            when golongan_id = 'V' then b.V
                            when golongan_id = 'VI' then b.VI
                            when golongan_id = 'VII' then b.VII
                            when golongan_id = 'VIII' then b.VIII
                            when golongan_id = '' then 0
                            else 0
                        end as nilai_ukt,
                        COALESCE(c.nama, 'Tanpa Prodi') as prodi
                    FROM
                        tb_cmahasiswa a
                    left join ref_ukt b on
                        a.prodi_cmahasiswa = b.major_id
                        and a.jalur_cmahasiswa = b.entrance
                    left join ref_prodi c on
                        a.prodi_cmahasiswa = c.kode
                        and a.jalur_cmahasiswa = c.jalur
                    where
                        a.no_peserta not like '%fulan%' ) as a
                group by
                    prodi`

	err := config.DB.Raw(query).Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	for i := range rows {
		rows[i].Subtotal = rows[i].I + rows[i].II + rows[i].III + rows[i].IV + rows[i].V + rows[i].VI + rows[i].VII + rows[i].VIII
	}

	return rows, nil
}

