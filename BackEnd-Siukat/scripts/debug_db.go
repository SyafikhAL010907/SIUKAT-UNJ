package main

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Info struct {
	Kode        int    `gorm:"primaryKey;column:kode"`
	Stage       string `gorm:"column:stage"`
	Tahun       string `gorm:"column:tahun"`
	BillIssueID int    `gorm:"column:bill_issue_id"`
}

func (Info) TableName() string { return "ref_info" }

type User struct {
	NoPeserta  string `gorm:"primaryKey;column:no_peserta"`
	JalurMasuk string `gorm:"column:jalur_masuk"`
}

func (User) TableName() string { return "tb_user" }

type BillDetail struct {
	Nit string `gorm:"column:nim"`
}
func (BillDetail) TableName() string { return "tb_bill_detail" }


func main() {
	dsn := "root:@tcp(127.0.0.1:3306)/siukat_2026_unj?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println("Error connecting to SIUKAT:", err)
		return
	}

	var infos []Info
	db.Find(&infos)
	fmt.Printf("--- REF_INFO ---\n")
	for _, info := range infos {
		fmt.Printf("Kode: %d, Stage: '%s', Tahun: '%s', BillIssueID: %d\n", info.Kode, info.Stage, info.Tahun, info.BillIssueID)
	}

	var users []User
	db.Limit(5).Find(&users)
	fmt.Printf("\n--- TB_USER ---\n")
	for _, u := range users {
		fmt.Printf("NoPeserta: '%s', JalurMasuk: '%s'\n", u.NoPeserta, u.JalurMasuk)
	}
}
