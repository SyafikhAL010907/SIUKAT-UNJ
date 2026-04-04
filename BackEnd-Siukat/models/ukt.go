package models

type Ukt struct {
	IDUkt    int    `gorm:"primaryKey;column:id_ukt" json:"id_ukt"`
	MajorID  string `gorm:"column:major_id;type:varchar(255)" json:"major_id"`
	Entrance int    `gorm:"column:entrance" json:"entrance"`
	Semester int    `gorm:"column:semester" json:"semester"`
	Status   string `gorm:"column:status;type:enum('aktif','nonaktif')" json:"status"`
	Degree   string `gorm:"column:degree;type:varchar(255)" json:"degree"`
	Decree   string `gorm:"column:decree;type:varchar(255)" json:"decree"`
	I        int    `gorm:"column:I" json:"I"`
	II       int    `gorm:"column:II" json:"II"`
	III      int    `gorm:"column:III" json:"III"`
	IV       int    `gorm:"column:IV" json:"IV"`
	V        int    `gorm:"column:V" json:"V"`
	VI       int    `gorm:"column:VI" json:"VI"`
	VII      int    `gorm:"column:VII" json:"VII"`
	VIII     int    `gorm:"column:VIII" json:"VIII"`
}

func (Ukt) TableName() string {
	return "ref_ukt"
}
