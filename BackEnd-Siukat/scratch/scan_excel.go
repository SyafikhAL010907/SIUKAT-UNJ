package main

import (
	"fmt"
	"log"

	"github.com/xuri/excelize/v2"
)

func main() {
	f, err := excelize.OpenFile("../data/inject_snbp_2026_new.xlsx")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	sheets := f.GetSheetList()
	fmt.Printf("Total Sheets: %d\n", len(sheets))

	for i, sheet := range sheets {
		fmt.Printf("\n--- Sheet %d: %s ---\n", i+1, sheet)
		rows, err := f.GetRows(sheet)
		if err != nil {
			fmt.Printf("Error reading sheet %s: %v\n", sheet, err)
			continue
		}

		if len(rows) > 0 {
			fmt.Printf("Headers: %v\n", rows[0])
			fmt.Printf("Example Row 1: %v\n", rows[1])
		} else {
			fmt.Println("Sheet is empty")
		}
	}
}
