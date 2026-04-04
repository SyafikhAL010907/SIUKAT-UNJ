package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
)

type UKTService struct{}

func vFirst(gajiIbu, gajiAyah, sampinganIbu, sampinganAyah, uangWali, gajiSendiri, tanggungan float64) float64 {
	// Formula: (gaji_ibu + gaji_ayah + sampingan_ibu + sampingan_ayah + uang_wali + gaji_sendiri) / tanggungan
	// Safety net for Golang to prevent panic div by zero
	if tanggungan == 0 {
		tanggungan = 1
	}
	return (gajiIbu + gajiAyah + sampinganIbu + sampinganAyah + uangWali + gajiSendiri) / tanggungan
}

func vSecond(pbb, kk, kontrak, bobotPbb, bobotKontrak float64) float64 {
	// Formula: bobot_pbb * ((pbb / 12) * kk) + bobot_kontrak * (kontrak / 12)
	return bobotPbb*((pbb/12)*kk) + bobotKontrak*(kontrak/12)
}

func vThird(listrik float64) float64 {
	// Formula: listrik / 3
	return listrik / 3
}

func vFourthFifth(kendaraan float64) float64 {
	// Formula: kendaraan / 12
	return kendaraan / 12
}

func decisionMaker(ikb float64, ukt models.Ukt) string {
	uktTemp := "VIII"
	if ikb <= float64(ukt.I) {
		uktTemp = "I"
	} else if ikb <= float64(ukt.II) {
		uktTemp = "II"
	} else if ikb <= float64(ukt.III) {
		uktTemp = "III"
	} else if ikb <= float64(ukt.IV) {
		uktTemp = "IV"
	} else if ikb <= float64(ukt.V) {
		uktTemp = "V"
	} else if ikb <= float64(ukt.VI) {
		uktTemp = "VI"
	} else if ikb <= float64(ukt.VII) {
		uktTemp = "VII"
	} else if ikb <= float64(ukt.VIII) {
		uktTemp = "VIII"
	}
	return uktTemp
}

// ComputeUkt adalah translasi 1-to-1 dari versi Node.js (ukt.prototype.computeUkt)
func (s *UKTService) ComputeUkt(noPeserta string, atribut string) (map[string]interface{}, error) {
	db := config.DB
	data := make(map[string]interface{})

	var cmahasiswa models.CMahasiswa
	if err := db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&cmahasiswa).Error; err != nil {
		return nil, err
	}
	data["cmahasiswa"] = cmahasiswa

	var ayah models.Ayah
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&ayah)
	data["ayah"] = ayah

	var ibu models.Ibu
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&ibu)
	data["ibu"] = ibu

	var wali models.Wali
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&wali)
	data["wali"] = wali

	var rumah models.Rumah
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&rumah)
	data["rumah"] = rumah

	var listrik models.Listrik
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&listrik)
	data["listrik"] = listrik

	var kendaraan models.Kendaraan
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&kendaraan)
	data["kendaraan"] = kendaraan

	var pendukung models.Pendukung
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&pendukung)
	data["pendukung"] = pendukung

	var bobot models.Bobot
	db.Where("id = ?", 1).First(&bobot) // Default fetch id=1
	data["bobot"] = bobot

	var ukt models.Ukt
	db.Where("major_id = ? AND entrance = ?", cmahasiswa.ProdiCmahasiswa, cmahasiswa.JalurCmahasiswa).First(&ukt)
	data["ukt"] = ukt

	// Kalkulasi V1 - V5
	v1 := vFirst(float64(ibu.PenghasilanIbu), float64(ayah.PenghasilanAyah), float64(ibu.SampinganIbu), float64(ayah.SampinganAyah), float64(wali.KesanggupanWali), float64(cmahasiswa.PenghasilanCmahasiswa), float64(pendukung.Tanggungan))
	v2 := vSecond(float64(rumah.BiayaPbb), float64(rumah.JumlahKepalaKeluarga), float64(rumah.BiayaKontrak), float64(bobot.Pbb), float64(bobot.Kontrak))
	v3 := vThird(float64(listrik.Pengeluaran))
	v4 := vFourthFifth(float64(kendaraan.PajakMotor))
	v5 := vFourthFifth(float64(kendaraan.PajakMobil))

	// Bobot Av1 - Ev5
	av1 := v1 * 6 * bobot.A
	bv2 := v2 * 6 * bobot.B
	cv3 := v3 * 6 * bobot.C
	dv4 := v4 * 6 * bobot.D
	ev5 := v5 * 6 * bobot.E

	// Hitung IKB
	ikb := av1 + bv2 + cv3 + dv4 + ev5

	// Decision Golongan
	choosenUkt := decisionMaker(ikb, ukt)

	// Save calculation metrics to data map
	data["v1"] = v1
	data["v2"] = v2
	data["v3"] = v3
	data["v4"] = v4
	data["v5"] = v5
	data["av1"] = av1
	data["bv2"] = bv2
	data["cv3"] = cv3
	data["dv4"] = dv4
	data["ev5"] = ev5
	data["ikb"] = ikb
	data["choosenUkt"] = choosenUkt

	// Translating Value.update(...)
	valueUpdate := map[string]interface{}{
		"v1": v1, "v2": v2, "v3": v3, "v4": v4, "v5": v5,
		"av1": av1, "bv2": bv2, "cv3": cv3, "dv4": dv4, "ev5": ev5,
		"ikb": ikb,
	}
	var valueResult models.Value
	db.Model(&models.Value{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(valueUpdate)
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&valueResult)
	data["value"] = valueResult

	// Translating CMahasiswa.update(golongan_id)
	db.Model(&models.CMahasiswa{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Update("golongan_id", choosenUkt)
	
	var updatedCMhs models.CMahasiswa
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&updatedCMhs)
	data["uktCmahasiswa"] = updatedCMhs

	return data, nil
}

// JustCompute is exactly the same without the DB Updates
func (s *UKTService) JustCompute(noPeserta string, atribut string) (map[string]interface{}, error) {
	// ... (Sama seperti ComputeUkt di awal)
	db := config.DB
	data := make(map[string]interface{})

	var cmahasiswa models.CMahasiswa
	if err := db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&cmahasiswa).Error; err != nil {
		return nil, err
	}
	var ayah models.Ayah
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&ayah)
	var ibu models.Ibu
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&ibu)
	var wali models.Wali
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&wali)
	var rumah models.Rumah
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&rumah)
	var listrik models.Listrik
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&listrik)
	var kendaraan models.Kendaraan
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&kendaraan)
	var pendukung models.Pendukung
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&pendukung)
	var bobot models.Bobot
	db.Where("id = ?", 1).First(&bobot)
	
	var ukt models.Ukt
	db.Where("major_id = ? AND entrance = ?", cmahasiswa.ProdiCmahasiswa, cmahasiswa.JalurCmahasiswa).First(&ukt)

	v1 := vFirst(float64(ibu.PenghasilanIbu), float64(ayah.PenghasilanAyah), float64(ibu.SampinganIbu), float64(ayah.SampinganAyah), float64(wali.KesanggupanWali), float64(cmahasiswa.PenghasilanCmahasiswa), float64(pendukung.Tanggungan))
	v2 := vSecond(float64(rumah.BiayaPbb), float64(rumah.JumlahKepalaKeluarga), float64(rumah.BiayaKontrak), float64(bobot.Pbb), float64(bobot.Kontrak))
	v3 := vThird(float64(listrik.Pengeluaran))
	v4 := vFourthFifth(float64(kendaraan.PajakMotor))
	v5 := vFourthFifth(float64(kendaraan.PajakMobil))

	av1 := v1 * 6 * bobot.A
	bv2 := v2 * 6 * bobot.B
	cv3 := v3 * 6 * bobot.C
	dv4 := v4 * 6 * bobot.D
	ev5 := v5 * 6 * bobot.E

	ikb := av1 + bv2 + cv3 + dv4 + ev5
	choosenUkt := decisionMaker(ikb, ukt)

	// Save data
	data["cmahasiswa"], data["ayah"], data["ibu"], data["wali"] = cmahasiswa, ayah, ibu, wali
	data["rumah"], data["listrik"], data["kendaraan"], data["pendukung"] = rumah, listrik, kendaraan, pendukung
	data["bobot"], data["ukt"] = bobot, ukt
	data["v1"], data["v2"], data["v3"], data["v4"], data["v5"] = v1, v2, v3, v4, v5
	data["av1"], data["bv2"], data["cv3"], data["dv4"], data["ev5"] = av1, bv2, cv3, dv4, ev5
	data["ikb"], data["choosenUkt"] = ikb, choosenUkt

	return data, nil
}

// ByCmahasiswa resolves the UKT nominal for a single student profile
func (s *UKTService) ByCmahasiswa(mhs models.CMahasiswa) (int, error) {
	var ukt models.Ukt
	err := config.DB.Where("major_id = ? AND entrance = ?", mhs.ProdiCmahasiswa, mhs.JalurCmahasiswa).First(&ukt).Error
	if err != nil {
		return 0, err
	}

	switch mhs.GolonganID {
	case "I":
		return ukt.I, nil
	case "II":
		return ukt.II, nil
	case "III":
		return ukt.III, nil
	case "IV":
		return ukt.IV, nil
	case "V":
		return ukt.V, nil
	case "VI":
		return ukt.VI, nil
	case "VII":
		return ukt.VII, nil
	case "VIII":
		return ukt.VIII, nil
	default:
		return 0, nil
	}
}

// PerCmahasiswa handles batch resolution of UKT nominals for a slice of students
func (s *UKTService) PerCmahasiswa(students []models.CMahasiswa) ([]map[string]interface{}, error) {
	var results []map[string]interface{}
	for _, mhs := range students {
		nominal, _ := s.ByCmahasiswa(mhs)
		item := map[string]interface{}{
			"student": mhs,
			"nominal": nominal,
		}
		results = append(results, item)
	}
	return results, nil
}
