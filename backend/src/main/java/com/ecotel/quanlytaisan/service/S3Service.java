package com.ecotel.quanlytaisan.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.Map;

@Service
public class S3Service {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    private final S3Presigner presigner;
    private final S3Client s3Client;

    // Bản đồ Content-Type tương đương Node.js
    private final Map<String, String> contentTypes = Map.of(
        "webp", "image/webp",
        "jpg", "image/jpeg",
        "jpeg", "image/jpeg",
        "png", "image/png",
        "pdf", "application/pdf",
        "xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    public S3Service(@Value("${aws.s3.region}") String region,
                     @Value("${aws.s3.access-key}") String accessKey,
                     @Value("${aws.s3.secret-key}") String secretKey) {
        StaticCredentialsProvider credentialsProvider = StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey));

        this.presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(credentialsProvider)
                .build();

        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(credentialsProvider)
                .build();
    }

    public String generatePresignedPutUrl(String fileName, String type) {
        String prefix = switch (type) {
            case "chuky" -> "chuky/";
            case "tailieu" -> "tailieu/";
            default -> throw new IllegalArgumentException("Invalid type");
        };

        String ext = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        String contentType = contentTypes.getOrDefault(ext, "application/octet-stream");
        String fileKey = prefix + fileName;

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(5))
                .putObjectRequest(objectRequest)
                .build();

        return presigner.presignPutObject(presignRequest).url().toString();
    }

    public String generatePresignedGetUrl(String key) {
        GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(30))
                .getObjectRequest(objectRequest)
                .build();

        return presigner.presignGetObject(presignRequest).url().toString();
    }

     public String generatePresignedUpdateUrl(String key) {
    // 1. Xác định Content-Type
    String ext = "";
    if (key.lastIndexOf(".") > 0) {
        ext = key.substring(key.lastIndexOf(".") + 1).toLowerCase();
    }
    // Đảm bảo PDF luôn là application/pdf
    String contentType = ext.equals("pdf") ? "application/pdf" : contentTypes.getOrDefault(ext, "application/octet-stream");

    // 2. Build Request
    PutObjectRequest objectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key) // Key S3 giữ nguyên bản có dấu (S3 SDK sẽ tự handle encoding khi ký)
            .contentType(contentType) // S3 yêu cầu header này phải khớp lúc PUT
            .build();

    PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(10))
            .putObjectRequest(objectRequest)
            .build();

    // 3. Trả về URL dạng String
    return presigner.presignPutObject(presignRequest).url().toString();
}

    public byte[] downloadFile(String key) {
        GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(objectRequest);
        return objectBytes.asByteArray();
    }

    public String getContentType(String fileName) {
        String ext = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        return contentTypes.getOrDefault(ext, "application/octet-stream");
    }
}