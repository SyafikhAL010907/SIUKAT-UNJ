package services

// ServiceRegistry — Hub semua instance service (Parity dengan services/index.js Node.js)
type ServiceRegistry struct {
	Cmahasiswa  *CMahasiswaService
	Ayah        *AyahService
	Ibu         *IbuService
	Wali        *WaliService
	Rumah       *RumahService
	Listrik     *ListrikService
	Kendaraan   *KendaraanService
	Pendukung   *PendukungService
	Prodi       *ProdiService
	Ukt         *UKTService
	Users       *UsersService
	Value       *ValueService
	Summarydata *SummaryService
	Keringanan  *KeringananService
	Dashboard   *DashboardService
}

var Registry = &ServiceRegistry{
	Cmahasiswa:  &CMahasiswaService{},
	Ayah:        &AyahService{},
	Ibu:         &IbuService{},
	Wali:        &WaliService{},
	Rumah:       &RumahService{},
	Listrik:     &ListrikService{},
	Kendaraan:   &KendaraanService{},
	Pendukung:   &PendukungService{},
	Prodi:       &ProdiService{},
	Ukt:         &UKTService{},
	Users:       &UsersService{},
	Value:       &ValueService{},
	Summarydata: &SummaryService{},
	Keringanan:  &KeringananService{},
	Dashboard:   &DashboardService{},
}
