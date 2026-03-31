var db = require("../config/database");

var summary = function () { };

summary.prototype.fetchByFakultas = function () {
    return new Promise((resolve, reject) => {
        db.query(`select
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
                        c.nama as fakultas
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
                    fakultas`,
            { type: db.QueryTypes.SELECT })
            .then((rows) => {
                for (i of rows) {
                    var sum = parseInt(i.I);
                    sum += parseInt(i.II);
                    sum += parseInt(i.III);
                    sum += parseInt(i.IV);
                    sum += parseInt(i.V);
                    sum += parseInt(i.VI);
                    sum += parseInt(i.VII);
                    sum += parseInt(i.VIII);
                    i.subtotal = sum;

                }

                resolve(rows);
            }).catch((err) => [
                reject(err)
            ]);
    });
};
summary.prototype.fetchByProdi = function () {
    return new Promise((resolve, reject) => {
        db.query(`select
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
                        c.nama as prodi
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
                    prodi`, { type: db.QueryTypes.SELECT })
            .then((rows) => {
                for (i of rows) {
                    var sum = parseInt(i.I);
                    sum += parseInt(i.II);
                    sum += parseInt(i.III);
                    sum += parseInt(i.IV);
                    sum += parseInt(i.V);
                    sum += parseInt(i.VI);
                    sum += parseInt(i.VII);
                    sum += parseInt(i.VIII);
                    i.subtotal = sum;

                }

                resolve(rows);
            }).catch((err) => [
                reject(err)
            ]);
    });
};

module.exports = summary;