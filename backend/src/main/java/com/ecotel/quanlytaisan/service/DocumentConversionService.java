package com.ecotel.quanlytaisan.service;

import org.springframework.stereotype.Service;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import com.itextpdf.html2pdf.HtmlConverter;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class DocumentConversionService {

    private static final String TEMP_DIR = System.getProperty("java.io.tmpdir");

    /**
     * Convert DOCX file to PDF using Apache POI + iText (no Office required)
     * @param docxFile Input DOCX file
     * @return Path to the converted PDF file
     * @throws Exception if conversion fails
     */
    public Path convertDocxToPdf(File docxFile) throws Exception {
        // Tạo tên file PDF ngẫu nhiên
        String pdfFileName = UUID.randomUUID().toString() + ".pdf";
        Path pdfPath = Paths.get(TEMP_DIR, pdfFileName);
        
        try (FileInputStream docxInputStream = new FileInputStream(docxFile);
             FileOutputStream pdfOutputStream = new FileOutputStream(pdfPath.toFile())) {
            
            // Load DOCX document
            XWPFDocument document = new XWPFDocument(docxInputStream);
            
            // Convert DOCX to HTML
            StringBuilder htmlContent = new StringBuilder();
            htmlContent.append("<!DOCTYPE html><html><head><meta charset='UTF-8'>");
            htmlContent.append("<style>body{font-family:Arial,sans-serif;line-height:1.6;margin:20px;}</style>");
            htmlContent.append("</head><body>");
            
            // Process paragraphs
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                htmlContent.append("<p>");
                for (XWPFRun run : paragraph.getRuns()) {
                    String text = run.getText(0);
                    if (text != null) {
                        // Basic formatting
                        if (run.isBold()) {
                            htmlContent.append("<strong>").append(text).append("</strong>");
                        } else if (run.isItalic()) {
                            htmlContent.append("<em>").append(text).append("</em>");
                        } else {
                            htmlContent.append(text);
                        }
                    }
                }
                htmlContent.append("</p>");
            }
            
            htmlContent.append("</body></html>");
            
            // Convert HTML to PDF using iText
            HtmlConverter.convertToPdf(htmlContent.toString(), pdfOutputStream);
            
            document.close();
            return pdfPath;
            
        } catch (Exception e) {
            // Xóa file PDF nếu conversion thất bại
            if (Files.exists(pdfPath)) {
                Files.deleteIfExists(pdfPath);
            }
            throw new Exception("Lỗi khi convert DOCX sang PDF: " + e.getMessage(), e);
        }
    }

    /**
     * Convert DOCX file to PDF and return as byte array
     * @param docxFile Input DOCX file
     * @return PDF content as byte array
     * @throws Exception if conversion fails
     */
    public byte[] convertDocxToPdfBytes(File docxFile) throws Exception {
        Path pdfPath = convertDocxToPdf(docxFile);
        try {
            return Files.readAllBytes(pdfPath);
        } finally {
            // Xóa file tạm
            Files.deleteIfExists(pdfPath);
        }
    }

    /**
     * Convert DOCX file to PDF and save to specified location
     * @param docxFile Input DOCX file
     * @param outputPath Output PDF file path
     * @return Path to the converted PDF file
     * @throws Exception if conversion fails
     */
    public Path convertDocxToPdf(File docxFile, String outputPath) throws Exception {
        Path pdfPath = convertDocxToPdf(docxFile);
        Path targetPath = Paths.get(outputPath);
        
        // Tạo thư mục nếu chưa có
        Files.createDirectories(targetPath.getParent());
        
        // Copy file PDF đến vị trí mong muốn
        Files.copy(pdfPath, targetPath);
        
        // Xóa file tạm
        Files.deleteIfExists(pdfPath);
        
        return targetPath;
    }

    /**
     * Check if file is a valid DOCX file
     * @param file File to check
     * @return true if file is DOCX, false otherwise
     */
    public boolean isDocxFile(File file) {
        if (file == null || !file.exists() || !file.isFile()) {
            return false;
        }
        
        String fileName = file.getName().toLowerCase();
        return fileName.endsWith(".docx") || fileName.endsWith(".doc");
    }

    /**
     * Get file size in MB
     * @param file File to check
     * @return File size in MB
     */
    public double getFileSizeInMB(File file) {
        if (file == null || !file.exists()) {
            return 0;
        }
        return file.length() / (1024.0 * 1024.0);
    }
}
