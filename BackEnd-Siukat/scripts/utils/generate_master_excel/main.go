package main

import (
	"fmt"
	"github.com/xuri/excelize/v2"
	"strings"
)

func main() {
	originalPath := `./DATA/inject_snbp_2026_new.xlsx`
	outputPath := `./DATA/READY_TO_INJECT_SNBP_2026_FIXED.xlsx`
	
	f, err := excelize.OpenFile(originalPath)
	if err != nil {
		fmt.Printf("Gagal buka file: %v\n", err)
		return
	}
	defer f.Close()

	fmt.Println("Membuat Master Excel Bersih (1:1)...")
	sheets := f.GetSheetList()

	for _, sheetName := range sheets {
		rows, _ := f.GetRows(sheetName)
		if len(rows) == 0 { continue }

		headers := rows[0]
		sqlCol := -1
		for i, h := range headers {
			if strings.Contains(strings.ToLower(h), "insert into") {
				sqlCol = i
				break
			}
		}

		for i := 0; i < len(rows); i++ {
			rowIdx := i + 1
			if sheetName == "tb_user" {
				if i == 0 {
					f.SetCellValue(sheetName, "D1", "jalur_masuk")
				} else {
					f.SetCellValue(sheetName, "D"+fmt.Sprintf("%d", rowIdx), "1")
				}
			}

			if sqlCol != -1 {
				for c := sqlCol + 1; c <= 20; c++ {
					colName, _ := excelize.ColumnNumberToName(c)
					f.SetCellValue(sheetName, fmt.Sprintf("%s%d", colName, rowIdx), nil)
				}
			}
		}
		fmt.Printf("- Sheet [%s] Bersih.\n", sheetName)
	}

	f.SaveAs(outputPath)
	fmt.Printf("\nSUCCESS: Master Excel disimpan di %s\n", outputPath)
}
