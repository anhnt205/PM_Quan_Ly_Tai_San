import imageCompression from "browser-image-compression";
import api from "../config/api.config";
import { showErrorAlert } from "../components/Alert";

class S3Service {
  private static instance: S3Service;
  public static getInstance(): S3Service {
    if (!S3Service.instance) {
      S3Service.instance = new S3Service();
    }
    return S3Service.instance;
  }
  public async presignedPutUrl(key: string): Promise<string> {
    const res = await api.get(`/s3/update?key=${key}`);
    return res.data.data || "";
  }
  public async presignedGetUrl(key: string): Promise<string> {
    const res = await api.get(`/s3/get?key=${key}`);
    return res.data.data || "";
  }
  public async download(currentKey: string): Promise<any> {
    if (!currentKey) return;
    try {
      // Encode tên file để xử lý ký tự đặc biệt
      const fileName = decodeURIComponent(
        currentKey.split("/").pop() || "file",
      );
      const response = await api.get(`/s3/download?key=${currentKey}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showErrorAlert("Không thể tải tập tin");
    }
  }
  public async preview(key: string): Promise<any> {
    if (!key) return;
    try {
      // Encode tên file để xử lý ký tự đặc biệt
      const response = await api.get(`/s3/preview?key=${key}`, {
        responseType: "blob",
      });
      // response.data lúc này là một đối tượng Blob (Binary Large Object)
      return response.data;
    } catch (error) {
      console.log("Không thể tải tập tin");
      return null;
    }
  }
  public async put({
    name,
    file,
    type,
  }: {
    name: string;
    file: File;
    type: "tailieu" | "chuky";
  }): Promise<string> {
    let fileToUpload: File | Blob = file;
    let ext = "pdf";
    let contentType = "application/pdf";

    if (type === "chuky") {
      // 1. Chuyển sang PNG để pdf-lib có thể đọc trực tiếp (embedPng)
      fileToUpload = await imageCompression(file, {
        maxWidthOrHeight: 300,
        maxSizeMB: 1,
        fileType: "image/png", // ÉP BUỘC ĐỊNH DẠNG PNG
      });
      ext = "png";
      contentType = "image/png";
    } else {
      // 2. Nếu là tài liệu: Giữ nguyên file PDF
      if (file.type !== "application/pdf") {
        alert("Vui lòng chọn định dạng file PDF cho tài liệu");
        throw new Error("Invalid file type"); // Nên throw lỗi để mutation nhận biết
      }
      fileToUpload = file;
      ext = "pdf";
      contentType = "application/pdf";
    }

    // Tạo fileName ngẫu nhiên
    const fileName = `${name.split(".")?.[0] || "file"}-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    // 3. Gọi API Spring Boot
    const res = await api.get(`/s3/put`, {
      params: { fileName, type },
    });

    const url = res.data?.data;

    // 4. Upload trực tiếp lên S3
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: fileToUpload,
    });

    // 5. Trả về key
    const key = url.split(".amazonaws.com/")[1].split("?")[0];
    return key || "";
  }
  public async updatePresignedPutUrl(
    documentUrl: string,
    pdfBlob: Blob,
  ): Promise<any> {
    const presignedPutUrl =
      await S3Service.getInstance().presignedPutUrl(documentUrl);

    fetch(presignedPutUrl, {
      method: "PUT",
      body: pdfBlob, // File PDF mới sau khi ký
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  }
}

export default S3Service.getInstance();
