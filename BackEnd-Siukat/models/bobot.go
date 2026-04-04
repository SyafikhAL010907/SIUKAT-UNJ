package models

type Bobot struct {
	ID      int     `gorm:"primaryKey;column:id" json:"id"`
	A       float64 `gorm:"column:a;type:decimal(10,2)" json:"a"`
	B       float64 `gorm:"column:b;type:decimal(10,2)" json:"b"`
	C       float64 `gorm:"column:c;type:decimal(10,2)" json:"c"`
	D       float64 `gorm:"column:d;type:decimal(10,2)" json:"d"`
	E       float64 `gorm:"column:e;type:decimal(10,2)" json:"e"`
	Pbb     float64 `gorm:"column:pbb;type:decimal(10,2)" json:"pbb"`
	Kontrak float64 `gorm:"column:kontrak;type:decimal(10,2)" json:"kontrak"`
}

func (Bobot) TableName() string {
	return "ref_bobot"
}
