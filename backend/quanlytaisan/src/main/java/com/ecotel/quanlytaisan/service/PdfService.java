package com.ecotel.quanlytaisan.service;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
@Service
public class PdfService {
    public void mergePdfs(File[] pdfFiles, OutputStream outputStream) throws IOException {
        PDFMergerUtility merger = new PDFMergerUtility();
        merger.setDestinationStream(outputStream);

        for (File file : pdfFiles) {
            merger.addSource(file);
        }
        merger.mergeDocuments(null);
    }
}
