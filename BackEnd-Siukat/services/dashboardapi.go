package services

import (
	"BackEnd-Siukat/config"
	"time"
)

type DashboardService struct{}

type DashboardSummaryRow struct {
	Date         *time.Time `json:"date"`
	CountMulai   int        `json:"count_mulai"`
	CountSelesai int        `json:"count_selesai"`
}

type DashboardSummaryResponse struct {
	Fields     []string `json:"fields"`
	StartDates []int    `json:"startDates"`
	EndDates   []int    `json:"endDates"`
}

func (s *DashboardService) DashboardSummary() (DashboardSummaryResponse, error) {
    query := `SELECT
                cast(a.waktu_selesai as date) as date,
                case
                    when b.count_mulai is null then 0
                    else b.count_mulai
                end as count_mulai,
                case
                    when c.count_selesai is null then 0
                    else c.count_selesai
                end as count_selesai
            from
                tb_cmahasiswa a
            left join tb_cmahasiswa t2 ON a.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'
            left join (
                SELECT
                    count(t1.id_cmahasiswa) as count_mulai,
                    cast(t1.waktu_mulai as date) as waktu_mulai
                FROM
                    tb_cmahasiswa t1
                LEFT JOIN tb_cmahasiswa t2 ON t1.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'
                where t1.no_peserta not like '%fulan%'
                AND (t1.atribut = 'sanggah' OR (t1.atribut = 'original' AND t2.id_cmahasiswa IS NULL))
                GROUP BY
                    cast(t1.waktu_mulai as date) ) as b on
                cast(a.waktu_selesai as date) = b.waktu_mulai
            left join (
                SELECT
                    count(t1.id_cmahasiswa) as count_selesai,
                    cast(t1.waktu_selesai as date) as waktu_selesai
                FROM
                    tb_cmahasiswa t1
                LEFT JOIN tb_cmahasiswa t2 ON t1.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'
                where t1.no_peserta not like '%fulan%'
                AND (t1.atribut = 'sanggah' OR (t1.atribut = 'original' AND t2.id_cmahasiswa IS NULL))
                GROUP BY
                    cast(t1.waktu_selesai as date) ) as c on
                cast(a.waktu_selesai as date) = c.waktu_selesai
            where (a.atribut = 'sanggah' OR (a.atribut = 'original' AND t2.id_cmahasiswa IS NULL))
            group by
                cast(a.waktu_selesai as date)`

	var rows []DashboardSummaryRow
	err := config.DB.Raw(query).Scan(&rows).Error
	if err != nil {
		return DashboardSummaryResponse{}, err
	}

	res := DashboardSummaryResponse{}
	for _, row := range rows {
		if row.Date != nil {
			res.Fields = append(res.Fields, row.Date.Format("2006-01-02"))
			res.StartDates = append(res.StartDates, row.CountMulai)
			res.EndDates = append(res.EndDates, row.CountSelesai)
		}
	}
	return res, nil
}

type DashboardMetaRow struct {
	Fakultas       string `json:"fakultas"`
	CountAll       int    `json:"countAll"`
	CountMulai     int    `json:"countMulai"`
	CountPengisian int    `json:"countPengisian"`
	CountSelesai   int    `json:"countSelesai"`
	CountTerima    int    `json:"countTerima"`
}

func (s *DashboardService) DashboardMeta() ([]DashboardMetaRow, error) {
	query := `select
                a.fakultas_cmahasiswa,
                count_all,
                count_mulai,
                count_pengisian,
                count_selesai,
                d.nama
            from
                tb_cmahasiswa a
            left join tb_cmahasiswa t2main ON a.no_peserta = t2main.no_peserta AND t2main.atribut = 'sanggah'
            left join (
                select
                    t1.fakultas_cmahasiswa,
                    sum(case when t1.flag <> 'pengisian' then 0 else 1 end) as count_pengisian
                from
                    tb_cmahasiswa t1
                left join tb_cmahasiswa t2 ON t1.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'
                where t1.no_peserta not like '%fulan%'
                AND (t1.atribut = 'sanggah' OR (t1.atribut = 'original' AND t2.id_cmahasiswa IS NULL))
                group by
                    t1.fakultas_cmahasiswa ) as b on
                a.fakultas_cmahasiswa = b.fakultas_cmahasiswa
            left join (
                select
                    t1.fakultas_cmahasiswa,
                    sum(case when (t1.flag <> 'selesai_isi' and t1.flag <> 'terima_ukt') then 0 else 1 end) as count_selesai
                from
                    tb_cmahasiswa t1
                left join tb_cmahasiswa t2 ON t1.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'
                where t1.no_peserta not like '%fulan%'
                AND (t1.atribut = 'sanggah' OR (t1.atribut = 'original' AND t2.id_cmahasiswa IS NULL))
                group by
                    t1.fakultas_cmahasiswa ) as c on
                a.fakultas_cmahasiswa = c.fakultas_cmahasiswa
            left join ref_fakultas d on
                a.fakultas_cmahasiswa = d.kode
            left join (
                select
                    count(t1.id_cmahasiswa) as count_all,
                    t1.fakultas_cmahasiswa
                from
                    tb_cmahasiswa t1
                left join tb_cmahasiswa t2 ON t1.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'
                where t1.no_peserta not like '%fulan%'
                AND (t1.atribut = 'sanggah' OR (t1.atribut = 'original' AND t2.id_cmahasiswa IS NULL))
                group by
                    t1.fakultas_cmahasiswa) as e on
                a.fakultas_cmahasiswa = e.fakultas_cmahasiswa
            left join (
                select
                    t1.fakultas_cmahasiswa,
                    sum(case when t1.waktu_mulai = 0 then 0 else 1 end) as count_mulai
                from
                    tb_cmahasiswa t1
                left join tb_cmahasiswa t2 ON t1.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'
                where t1.no_peserta not like '%fulan%'
                AND (t1.atribut = 'sanggah' OR (t1.atribut = 'original' AND t2.id_cmahasiswa IS NULL))
                group by
                    t1.fakultas_cmahasiswa ) as f on
                a.fakultas_cmahasiswa = f.fakultas_cmahasiswa
            where (a.atribut = 'sanggah' OR (a.atribut = 'original' AND t2main.id_cmahasiswa IS NULL))
            group by
                a.fakultas_cmahasiswa`

	type Result struct {
		FakultasCmahasiswa string `gorm:"column:fakultas_cmahasiswa"`
		CountAll           int    `gorm:"column:count_all"`
		CountMulai         int    `gorm:"column:count_mulai"`
		CountPengisian     int    `gorm:"column:count_pengisian"`
		CountSelesai       int    `gorm:"column:count_selesai"`
		Nama               string `gorm:"column:nama"`
	}

	var rawRows []Result
	err := config.DB.Raw(query).Scan(&rawRows).Error
	if err != nil {
		return nil, err
	}

	var finalRows []DashboardMetaRow
	for _, row := range rawRows {
		finalRows = append(finalRows, DashboardMetaRow{
			Fakultas:       row.Nama,
			CountAll:       row.CountAll,
			CountMulai:     row.CountMulai,
			CountPengisian: row.CountPengisian,
			CountSelesai:   row.CountSelesai,
			CountTerima:    0, // Sesuai JS lama, belum ada mapping logic nya di DB
		})
	}

	return finalRows, nil
}
