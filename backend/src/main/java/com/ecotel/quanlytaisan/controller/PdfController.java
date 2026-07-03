package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    @Autowired
    private PdfService pdfService;

    @PostMapping("/merge")
    public ResponseEntity<byte[]> mergePdfFiles(@RequestParam("files") MultipartFile[] files) throws IOException {
        File[] tempFiles = new File[files.length];

        // Lưu file upload vào temp
        for (int i = 0; i < files.length; i++) {
            File temp = File.createTempFile("pdf_", ".pdf");
            try (FileOutputStream fos = new FileOutputStream(temp)) {
                fos.write(files[i].getBytes());
            }
            tempFiles[i] = temp;
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        pdfService.mergePdfs(tempFiles, outputStream);

        // Xóa temp
        for (File f : tempFiles) {
            f.delete();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=merged.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(outputStream.toByteArray());
    }
}
