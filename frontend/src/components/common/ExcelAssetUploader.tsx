import React, { useRef } from "react";
import { Box, Button } from "@mui/material";
import { Download, Upload } from "@mui/icons-material";
import * as XLSX from "xlsx";

export interface ExcelAssetItem {
  id: string;
  name: string;
  originalData?: any;
}

interface ExcelAssetUploaderProps {
  availableAssets: ExcelAssetItem[];
  onUploadSuccess: (matchedAssets: ExcelAssetItem[]) => void;
  fileName?: string;
  readOnly?: boolean;
}

export default function ExcelAssetUploader({
  availableAssets,
  onUploadSuccess,
  fileName = "Template_Tai_San",
  readOnly = false,
}: ExcelAssetUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    // Header: Cột A để nhập mã, Cột C và D làm danh sách tra cứu
    const data: any[][] = [
      [
        "Mã tài sản (Cần điền)",
        "",
        "Danh sách mã (Tra cứu)",
        "Tên tài sản (Tra cứu)",
      ],
    ];

    if (availableAssets && availableAssets.length > 0) {
      availableAssets.forEach((asset) => {
        data.push(["", "", asset.id, asset.name]);
      });
    }

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();

    // Tùy chỉnh độ rộng cột
    ws["!cols"] = [{ wch: 25 }, { wch: 5 }, { wch: 30 }, { wch: 50 }];

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const ab = evt.target?.result as ArrayBuffer;
        const wb = XLSX.read(ab, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        // Đọc dữ liệu ra mảng array of arrays, bỏ qua dòng tiêu đề (header: 1)
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as string[][];

        // Lấy danh sách số thẻ từ cột A (bỏ qua dòng tiêu đề dòng 0)
        const uploadedIds: string[] = [];
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (row && row.length > 0 && row[0]) {
            uploadedIds.push(String(row[0]).trim());
          }
        }

        if (uploadedIds.length === 0) {
          alert("Không tìm thấy dữ liệu 'Số thẻ' ở Cột A từ dòng 2.");
          return;
        }

        // Khớp với availableAssets dựa trên chuẩn hóa ID
        const matchedAssets = availableAssets.filter((asset) => {
          return uploadedIds.includes(String(asset.id).trim());
        });

        onUploadSuccess(matchedAssets);
      } catch (error) {
        console.error("Error parsing excel file", error);
        alert("Lỗi đọc file Excel. Vui lòng kiểm tra lại định dạng file.");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset input để up lại cùng 1 file không lỗi
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Box display="flex" gap={1}>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        startIcon={<Download />}
        onClick={handleDownloadTemplate}
        disabled={readOnly}
        sx={{ textTransform: "none", bgcolor: "#f5f5f5" }}
      >
        Tải file mẫu
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<Upload />}
        onClick={() => fileInputRef.current?.click()}
        disabled={readOnly}
        sx={{ textTransform: "none", bgcolor: "#f5f5f5" }}
      >
        Tải lên (Upload)
      </Button>

      <input
        title="Upload Excel"
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />
    </Box>
  );
}
