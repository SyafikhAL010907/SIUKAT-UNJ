package main

import (
	"fmt"
	"log"
	"os"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Admin struct {
	Username string
	Role     string
}

func (Admin) TableName() string {
	return "tb_admin"
}

func main() {
	dsn := "root:@tcp(127.0.0.1:3306)/siukat_2026_unj?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	var admin Admin
	username := "DeveloperUtama"
	if len(os.Args) > 1 {
		username = os.Args[1]
	}

	result := db.Where("username = ?", username).First(&admin)
	if result.Error != nil {
		fmt.Printf("Error: %v\n", result.Error)
		return
	}

	fmt.Printf("User: %s, Role: %s\n", admin.Username, admin.Role)
}
