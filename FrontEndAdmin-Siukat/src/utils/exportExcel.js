import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import { saveAs } from "file-saver";
import swal from "sweetalert";

/**
 * Utility untuk export data ke Excel dengan styling premium SIUKAT.
 */

const GREEN_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF10B981" }, // Emerald 500
};

const BOLD_WHITE_FONT = {
  color: { argb: "FFFFFFFF" },
  bold: true,
  size: 11,
};

const CENTER_ALIGN = { vertical: "middle", horizontal: "center" };

const BORDER_STYLE = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

const formatCurrency = (cell) => {
  cell.numFmt = '"Rp "#,##0';
};

/**
 * Export Rekapitulasi (Fakultas / Prodi)
 */
export const exportRekapExcel = async (type, data, totals) => {
  console.log(`[SIUKAT] Memulai Export ${type}...`, { dataCount: data.length });
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Rekapitulasi");

    const isFakultas = type === "fakultas";
    const labelColumn = isFakultas ? "Fakultas" : "Program Studi";
    const fileName = isFakultas
      ? `Rekap_Fakultas_${new Date().toLocaleDateString()}.xlsx`
      : `Rekap_Prodi_${new Date().toLocaleDateString()}.xlsx`;

    // 1. Header Title
    worksheet.mergeCells("A1:N1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `REKAPITULASI ${type.toUpperCase()} - OFFICIAL DATA REPORT SIUKAT UNJ`;
    titleCell.font = { size: 16, bold: true, italic: true };
    titleCell.alignment = CENTER_ALIGN;

    worksheet.mergeCells("A2:N2");
    const dateCell = worksheet.getCell("A2");
    dateCell.value = `Tanggal Export: ${new Date().toLocaleString("id-ID")}`;
    dateCell.alignment = CENTER_ALIGN;

    // 2. Table Headers (Row 4 & 5)
    // Row 4
    const headerRow1 = worksheet.getRow(4);
    headerRow1.values = [
      "NO",
      labelColumn,
      "TOTAL MHS",
      "DISTRIBUSI GOLONGAN UKT",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "KIPK",
      "SELESAI",
      "TOTAL NOMINAL UKT",
    ];

    // Merge columns for multi-row header structure
    worksheet.mergeCells("A4:A5"); // NO
    worksheet.mergeCells("B4:B5"); // Name
    worksheet.mergeCells("C4:C5"); // Total MHS
    worksheet.mergeCells("D4:K4"); // Golongan Span
    worksheet.mergeCells("L4:L5"); // KIPK
    worksheet.mergeCells("M4:M5"); // Selesai
    worksheet.mergeCells("N4:N5"); // Nominal

    // Row 5 (Golongan list)
    const headerRow2 = worksheet.getRow(5);
    headerRow2.getCell(4).value = "I";
    headerRow2.getCell(5).value = "II";
    headerRow2.getCell(6).value = "III";
    headerRow2.getCell(7).value = "IV";
    headerRow2.getCell(8).value = "V";
    headerRow2.getCell(9).value = "VI";
    headerRow2.getCell(10).value = "VII";
    headerRow2.getCell(11).value = "VIII";

    // Apply Style to Headers
    [4, 5].forEach((rowNum) => {
      const row = worksheet.getRow(rowNum);
      row.eachCell((cell) => {
        cell.fill = GREEN_FILL;
        cell.font = BOLD_WHITE_FONT;
        cell.alignment = CENTER_ALIGN;
        cell.border = BORDER_STYLE;
      });
    });

    // 3. Add Data Rows
    data.forEach((item, index) => {
      const row = worksheet.addRow([
        index + 1,
        isFakultas ? item.fakultas : item.prodi || item.program_studi,
        item.total_mahasiswa || 0,
        item.I || 0,
        item.II || 0,
        item.III || 0,
        item.IV || 0,
        item.V || 0,
        item.VI || 0,
        item.VII || 0,
        item.VIII || 0,
        item.bidikmisi || 0,
        item.subtotal || 0,
        item.total_ukt || 0,
      ]);

      row.eachCell((cell, colNumber) => {
        cell.border = BORDER_STYLE;
        cell.alignment = {
          vertical: "middle",
          horizontal: colNumber === 2 ? "left" : "center",
        };
        if (colNumber === 14) formatCurrency(cell);
      });
    });

    // 4. Add Grand Total Row
    if (totals) {
      const footerRow = worksheet.addRow([
        "",
        "GRAND TOTAL",
        totals.total_mahasiswa,
        totals.I,
        totals.II,
        totals.III,
        totals.IV,
        totals.V,
        totals.VI,
        totals.VII,
        totals.VIII,
        totals.bidikmisi,
        totals.subtotal,
        totals.total_ukt,
      ]);

      footerRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF065F46" },
        }; // Darker green
        cell.font = BOLD_WHITE_FONT;
        cell.border = BORDER_STYLE;
        cell.alignment = CENTER_ALIGN;
        if (colNumber === 14) formatCurrency(cell);
      });
      worksheet.mergeCells(`A${footerRow.number}:B${footerRow.number}`);
    }

    // Adjust column widths
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 40;
    worksheet.getColumn(3).width = 15;
    for (let i = 4; i <= 11; i++) worksheet.getColumn(i).width = 6;
    worksheet.getColumn(12).width = 12;
    worksheet.getColumn(13).width = 12;
    worksheet.getColumn(14).width = 25;

    // Generate and Download
    console.log(`[SIUKAT] Menulis Buffer untuk ${type}...`);
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
    console.log(`[SIUKAT] Export ${type} Berhasil Diturunkan!`);
  } catch (error) {
    console.error(`[SIUKAT] Error Export ${type}:`, error);
    swal({
      title: "Export Gagal!",
      text: `Terjadi kesalahan saat mengekspor data ${type}.`,
      icon: "error",
    });
  }
};

/**
 * Export Master Data Students
 */
export const exportMasterDataExcel = async (data) => {
  console.log("[SIUKAT] Memulai Export Master Data (Sync with PDF)...", {
    dataCount: data.length,
  });
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data_Master_Students");

    // Headers (Matching PDF Master Structure)
    const headers = [
      { header: "No.", key: "no", width: 5 },
      { header: "No. Peserta", key: "no_peserta", width: 20 },
      { header: "Nama Lengkap", key: "nama_cmahasiswa", width: 40 },
      { header: "Bidik Misi", key: "bidik_misi_cmahasiswa", width: 12 },
      { header: "Fakultas", key: "fakultas_nama", width: 30 },
      { header: "Program Studi", key: "prodi_nama", width: 35 },
      { header: "Kelompok UKT", key: "golongan_label", width: 15 },
      { header: "Nominal UKT", key: "nominal_original", width: 20 },
      { header: "Tagihan UKT", key: "nominal_tagihan", width: 20 },
      { header: "Status", key: "status_label", width: 18 },
      { header: "UKT Tinggi", key: "ukt_tinggi", width: 12 },
    ];

    worksheet.columns = headers;

    // Helper Status Label (Matching PDF Template)
    const getStatusLabel = (flag) => {
      const labels = {
        terima_ukt: "Terima",
        sanggah_ukt: "Sanggah",
        selesai_sanggah: "Selesai Sanggah",
        pengumuman: "Pengumuman",
        selesai_isi: "Selesai Isi",
        pengisian: "Pengisian",
      };
      return labels[flag] || flag;
    };

    // Style Header Row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = GREEN_FILL;
      cell.font = BOLD_WHITE_FONT;
      cell.alignment = CENTER_ALIGN;
      cell.border = BORDER_STYLE;
    });

    // Add Data
    data.forEach((item, idx) => {
      const isSanggah = item.atribut === "sanggah";
      const row = worksheet.addRow({
        no: idx + 1,
        no_peserta: item.no_peserta,
        nama_cmahasiswa: item.nama_cmahasiswa,
        bidik_misi_cmahasiswa:
          item.bidik_misi_cmahasiswa === "Ya" ? "Ya" : "Tidak",
        fakultas_nama: item.fakultas ? item.fakultas.nama : "-",
        prodi_nama: item.prodi ? item.prodi.nama : "-",
        golongan_label: isSanggah
          ? `Sanggah: ${item.golongan_id}`
          : item.golongan_id,
        nominal_original: item.original_nominal || 0,
        nominal_tagihan: item.ukt ? item.ukt.nominal : 0,
        status_label: getStatusLabel(item.flag),
        ukt_tinggi: item.ukt_tinggi === "ya" ? "Ya" : "-",
      });

      row.eachCell((cell, colNumber) => {
        cell.border = BORDER_STYLE;
        cell.alignment = {
          vertical: "middle",
          horizontal:
            colNumber <= 3
              ? "center"
              : colNumber >= 8 && colNumber <= 9
                ? "right"
                : "left",
        };
        if (colNumber === 8 || colNumber === 9) formatCurrency(cell);

        // Highlight Sanggah
        if (colNumber === 7 && isSanggah) {
          cell.font = { color: { argb: "FF92400E" }, bold: true }; // Amber/Brownish font
        }
      });
    });

    // Generate and Download
    console.log("[SIUKAT] Menulis Buffer untuk Master Data...");
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `Data_Master_Siukat_${new Date().toLocaleDateString()}.xlsx`,
    );
    console.log("[SIUKAT] Export Master Data Berhasil Diturunkan!");
  } catch (error) {
    console.error("[SIUKAT] Error Export Master Data:", error);
    swal({
      title: "Export Gagal!",
      text: "Gagal mengekspor Master Data. Silahkan cek koneksi atau hubungi admin.",
      icon: "error",
    });
  }
};
