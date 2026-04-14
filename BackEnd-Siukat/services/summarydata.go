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
		SUM(CASE WHEN a.waktu_mulai > 0 THEN 1 ELSE 0 END) as total_mulai,
		SUM(CASE WHEN a.flag = 'pengisian' THEN 1 ELSE 0 END) as total_pengisian,
		SUM(CASE WHEN a.flag IN ('selesai_isi','terima_ukt') THEN 1 ELSE 0 END) as total_selesai,
		SUM(CASE WHEN a.flag = 'terima_ukt' THEN 1 ELSE 0 END) as total_terima_ukt
		FROM tb_cmahasiswa a
		LEFT JOIN tb_cmahasiswa t2 ON a.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'
		WHERE a.no_peserta NOT LIKE '%fulan%'
		AND (a.atribut = 'sanggah' OR (a.atribut = 'original' AND t2.id_cmahasiswa IS NULL))
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

func (s *SummaryService) FetchByFakultas(tahun string, jalur string) ([]SummaryDistribution, error) {
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
                    sum(IFNULL(nilai_ukt, 0)) as total_ukt
                from
                    (
                    SELECT
                        a.nama_cmahasiswa,
                        a.prodi_cmahasiswa,
                        a.jalur_cmahasiswa,
                        b.id_ukt,
                        a.bidik_misi_cmahasiswa,
                        a.golongan_id,
                        case
                            when a.golongan_id = 'I' then b.I
                            when a.golongan_id = 'II' then b.II
                            when a.golongan_id = 'III' then b.III
                            when a.golongan_id = 'IV' then b.IV
                            when a.golongan_id = 'V' then b.V
                            when a.golongan_id = 'VI' then b.VI
                            when a.golongan_id = 'VII' then b.VII
                            when a.golongan_id = 'VIII' then b.VIII
                            when a.golongan_id = '' then 0
                            else 0
                        end as nilai_ukt,
                        COALESCE(fac.nama, 'Tanpa Fakultas') as fakultas
                    FROM
                        tb_cmahasiswa a
                    JOIN tb_user u ON u.no_peserta = a.no_peserta
                    JOIN ref_info i ON i.kode = u.jalur_masuk
                    LEFT JOIN tb_cmahasiswa t2 ON a.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'
                    left join ref_ukt b on
                        CAST(a.prodi_cmahasiswa AS CHAR) = CAST(b.major_id AS CHAR)
                        and CAST(a.jalur_cmahasiswa AS CHAR) = CAST(b.entrance AS CHAR)
                    left join ref_fakultas fac on
                        a.fakultas_cmahasiswa = fac.kode
                    where
                        a.no_peserta not like '%fulan%' 
                        AND (a.atribut = 'sanggah' OR (a.atribut = 'original' AND t2.id_cmahasiswa IS NULL)) `

	if tahun != "" {
		query += " AND i.tahun = '" + tahun + "'"
	}

	if jalur != "" {
		query += " AND u.jalur_masuk = '" + jalur + "'"
	}

	query += ` ) as a
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

func (s *SummaryService) FetchByProdi(tahun string, jalur string) ([]SummaryDistribution, error) {
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
                    sum(IFNULL(nilai_ukt, 0)) as total_ukt
                from
                    (
                    SELECT
                        a.nama_cmahasiswa,
                        a.prodi_cmahasiswa,
                        a.jalur_cmahasiswa,
                        b.id_ukt,
                        a.bidik_misi_cmahasiswa,
                        a.golongan_id,
                        case
                            when a.golongan_id = 'I' then b.I
                            when a.golongan_id = 'II' then b.II
                            when a.golongan_id = 'III' then b.III
                            when a.golongan_id = 'IV' then b.IV
                            when a.golongan_id = 'V' then b.V
                            when a.golongan_id = 'VI' then b.VI
                            when a.golongan_id = 'VII' then b.VII
                            when a.golongan_id = 'VIII' then b.VIII
                            when a.golongan_id = '' then 0
                            else 0
                        end as nilai_ukt,
                        COALESCE(c.nama, 'Tanpa Prodi') as prodi
                    FROM
                        tb_cmahasiswa a
                    JOIN tb_user u ON u.no_peserta = a.no_peserta
                    JOIN ref_info i ON i.kode = u.jalur_masuk
                    LEFT JOIN tb_cmahasiswa t2 ON a.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'
                    left join ref_ukt b on
                        CAST(a.prodi_cmahasiswa AS CHAR) = CAST(b.major_id AS CHAR)
                        and CAST(a.jalur_cmahasiswa AS CHAR) = CAST(b.entrance AS CHAR)
                    left join ref_prodi c on
                        a.prodi_cmahasiswa = c.kode
                        and a.jalur_cmahasiswa = c.jalur
                    where
                        a.no_peserta not like '%fulan%' 
                        AND (a.atribut = 'sanggah' OR (a.atribut = 'original' AND t2.id_cmahasiswa IS NULL)) `

	if tahun != "" {
		query += " AND i.tahun = '" + tahun + "'"
	}

	if jalur != "" {
		query += " AND u.jalur_masuk = '" + jalur + "'"
	}

	query += ` ) as a
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
