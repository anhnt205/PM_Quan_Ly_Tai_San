package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.model.ChatResponse;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

@Service
public class ChatbotService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.model}")
    private String openaiModel;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final int MAX_ROWS = 1000;

    private static final Pattern DANGEROUS_SQL_PATTERN = Pattern.compile(
            "\\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|GRANT|REVOKE)\\b",
            Pattern.CASE_INSENSITIVE
    );

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();

    private final Gson gson = new Gson();

    private static final String DATABASE_SCHEMA = """
        Database: QuanLyTaiSan (Asset Management System)

        === MAIN TABLES ===

        1. TaiSan (Assets):
           - Id VARCHAR(50) PRIMARY KEY
           - TenTaiSan TEXT (Asset name)
           - NguyenGia FLOAT (Original price)
           - GiaTriKhauHaoBanDau FLOAT (Initial depreciation value)
           - KyKhauHaoBanDau INT (Initial depreciation period)
           - GiaTriThanhLy FLOAT (Liquidation value)
           - IdLoaiTaiSan TEXT -> LoaiTaiSan.Id
           - IdNhomTaiSan TEXT -> NhomTaiSan.Id
           - IdMoHinhTaiSan TEXT -> MoHinhTaiSan.Id
           - IdDonViHienThoi TEXT -> PhongBan.Id (Current department)
           - IdDonViBanDau TEXT -> PhongBan.Id (Initial department)
           - IdDuDan TEXT -> DuAn.Id
           - IdNguonVon TEXT -> NguonVon.Id
           - NgayVaoSo TEXT, NgaySuDung TEXT
           - SoLuong INT, DonViTinh VARCHAR(100)
           - HienTrang INT (Status: condition)

        2. CCDCVatTu (Tools and Materials):
           - Id VARCHAR(50) PRIMARY KEY
           - Ten TEXT (Name)
           - GiaTri FLOAT (Value)
           - SoLuong INT
           - IdDonVi TEXT -> PhongBan.Id
           - IdNhomCCDC TEXT
           - HienTrang INT

        3. NhanVien (Employees):
           - Id VARCHAR(50) PRIMARY KEY
           - HoTen VARCHAR(200) (Full name)
           - DiDong VARCHAR(20) (Mobile)
           - EmailCongViec VARCHAR(100)
           - BoPhan TEXT -> PhongBan.Id (Department)
           - ChucVu TEXT (Position)
           - LaQuanLy TINYINT(1) (Is manager)

        4. PhongBan (Departments):
           - Id VARCHAR(50) PRIMARY KEY
           - TenPhongBan VARCHAR(500) (Department name)
           - IdNhomDonVi TEXT -> NhomDonVi.Id
           - IdQuanLy TEXT -> NhanVien.Id (Manager)
           - PhongCapTren TEXT (Parent department)
           - IsKho TINYINT(1) (Is warehouse)

        5. CongTy (Companies):
           - Id VARCHAR(50) PRIMARY KEY
           - TenCongTy VARCHAR(500) (Company name)
           - TenVietTat VARCHAR(50) (Short name)
           - MaSoThue VARCHAR(100) (Tax code)
           - Email, SoDienThoai, Website

        6. LoaiTaiSan (Asset Types):
           - Id VARCHAR(50) PRIMARY KEY
           - TenLoaiTaiSan TEXT

        7. NhomTaiSan (Asset Groups):
           - Id VARCHAR(50) PRIMARY KEY
           - TenNhom VARCHAR(500)

        8. DieuDongTaiSan (Asset Transfers):
           - Id VARCHAR(50) PRIMARY KEY
           - TenPhieu TEXT (Transfer ticket name)
           - SoQuyetDinh TEXT (Decision number)
           - IdDonViGiao TEXT -> PhongBan.Id (From department)
           - IdDonViNhan TEXT -> PhongBan.Id (To department)
           - TrangThai INT (Status)
           - Loai INT (Type: 1=Allocation, 2=Transfer, 3=Return)

        9. ChiTietDieuDongTaiSan (Transfer Details):
           - Id VARCHAR(50) PRIMARY KEY
           - IdDieuDongTaiSan TEXT -> DieuDongTaiSan.Id
           - IdTaiSan TEXT -> TaiSan.Id
           - SoLuong FLOAT

        10. BanGiaoTaiSan (Asset Handovers):
            - Id VARCHAR(50) PRIMARY KEY
            - BanGiaoTaiSan TEXT (Handover name)
            - IdDonViGiao TEXT -> PhongBan.Id
            - IdDonViNhan TEXT -> PhongBan.Id
            - NgayBanGiao TEXT
            - TrangThai INT

        11. ChiTietBanGiaoTaiSan (Handover Details):
            - Id VARCHAR(50) PRIMARY KEY
            - IdBanGiaoTaiSan TEXT -> BanGiaoTaiSan.Id
            - IdTaiSan TEXT -> TaiSan.Id
            - SoLuong FLOAT

        12. NhomDonVi (Organization Groups):
            - Id VARCHAR(50) PRIMARY KEY
            - TenNhom VARCHAR(200)

        13. DuAn (Projects):
            - Id VARCHAR(50) PRIMARY KEY
            - TenDuAn TEXT

        14. NguonVon (Capital Sources):
            - Id VARCHAR(50) PRIMARY KEY
            - TenNguonKinhPhi TEXT

        15. ChucVu (Positions):
            - Id VARCHAR(50) PRIMARY KEY
            - TenChucVu VARCHAR(200)

        16. Kho (Warehouses):
            - Id VARCHAR(50) PRIMARY KEY
            - TenKho VARCHAR(500)
            - IdQuanLy TEXT -> NhanVien.Id

        17. TaiKhoan (User Accounts):
            - Id VARCHAR(50) PRIMARY KEY
            - Username VARCHAR(50)
            - HoTen VARCHAR(100)
            - Email VARCHAR(100)

        === RELATIONSHIPS ===
        - TaiSan.IdLoaiTaiSan -> LoaiTaiSan.Id
        - TaiSan.IdNhomTaiSan -> NhomTaiSan.Id
        - TaiSan.IdDonViHienThoi -> PhongBan.Id
        - TaiSan.IdCongTy -> CongTy.Id
        - NhanVien.BoPhan -> PhongBan.Id
        - PhongBan.IdNhomDonVi -> NhomDonVi.Id
        - PhongBan.IdCongTy -> CongTy.Id
        - DieuDongTaiSan.IdDonViGiao -> PhongBan.Id
        - DieuDongTaiSan.IdDonViNhan -> PhongBan.Id
        - ChiTietDieuDongTaiSan.IdTaiSan -> TaiSan.Id
        - BanGiaoTaiSan.IdDonViGiao -> PhongBan.Id
        - BanGiaoTaiSan.IdDonViNhan -> PhongBan.Id
        """;

    public ChatResponse processQuery(String userMessage) throws Exception {
        // 1. Call OpenAI to generate SQL
        String aiResponse = callOpenAI(userMessage);

        // 2. Parse SQL and explanation from response
        String sqlQuery = extractSql(aiResponse);
        String explanation = extractExplanation(aiResponse);

        // 3. Validate SQL (only SELECT allowed)
        if (!isValidSelectQuery(sqlQuery)) {
            throw new IllegalArgumentException("Chi cho phep cau lenh SELECT. Cac lenh INSERT, UPDATE, DELETE, DROP khong duoc phep.");
        }

        // 4. Add LIMIT if not present
        sqlQuery = ensureLimit(sqlQuery);

        // 5. Execute SQL
        List<Map<String, Object>> data = executeQuery(sqlQuery);

        return new ChatResponse(sqlQuery, data, explanation);
    }

    private String callOpenAI(String userMessage) throws IOException {
        JsonObject requestBody = new JsonObject();
        requestBody.addProperty("model", openaiModel);
        requestBody.addProperty("temperature", 0.1);

        JsonArray messages = new JsonArray();

        // System message with database schema
        JsonObject systemMessage = new JsonObject();
        systemMessage.addProperty("role", "system");
        systemMessage.addProperty("content",
            "Ban la mot SQL expert. Nguoi dung se hoi bang tieng Viet ve du lieu trong database.\n" +
            "Nhiem vu cua ban:\n" +
            "1. Phan tich cau hoi cua nguoi dung\n" +
            "2. Tao cau SQL SELECT phu hop (CHI DUOC DUNG SELECT, KHONG INSERT/UPDATE/DELETE)\n" +
            "3. Tra loi theo format:\n" +
            "SQL: <cau_sql_o_day>\n" +
            "EXPLANATION: <giai_thich_ngan_gon>\n\n" +
            "Database Schema:\n" + DATABASE_SCHEMA
        );
        messages.add(systemMessage);

        // User message
        JsonObject userMsg = new JsonObject();
        userMsg.addProperty("role", "user");
        userMsg.addProperty("content", userMessage);
        messages.add(userMsg);

        requestBody.add("messages", messages);

        RequestBody body = RequestBody.create(
            requestBody.toString(),
            MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
            .url(OPENAI_API_URL)
            .addHeader("Authorization", "Bearer " + openaiApiKey)
            .addHeader("Content-Type", "application/json")
            .post(body)
            .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                throw new IOException("OpenAI API error: " + response.code() + " - " + errorBody);
            }

            String responseBody = response.body().string();
            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);

            return jsonResponse
                .getAsJsonArray("choices")
                .get(0).getAsJsonObject()
                .getAsJsonObject("message")
                .get("content").getAsString();
        }
    }

    private String extractSql(String aiResponse) {
        // Find SQL between "SQL:" and "EXPLANATION:" or end of response
        String response = aiResponse.trim();

        int sqlStart = response.toUpperCase().indexOf("SQL:");
        if (sqlStart == -1) {
            // Try to find SELECT statement directly
            int selectStart = response.toUpperCase().indexOf("SELECT");
            if (selectStart != -1) {
                int endIndex = response.indexOf(";", selectStart);
                if (endIndex == -1) {
                    endIndex = response.toUpperCase().indexOf("EXPLANATION");
                    if (endIndex == -1) endIndex = response.length();
                }
                return response.substring(selectStart, endIndex).trim();
            }
            throw new IllegalArgumentException("Khong tim thay cau SQL trong phan hoi cua AI");
        }

        int sqlEnd = response.toUpperCase().indexOf("EXPLANATION:");
        if (sqlEnd == -1) {
            sqlEnd = response.length();
        }

        String sql = response.substring(sqlStart + 4, sqlEnd).trim();

        // Remove markdown code blocks if present
        sql = sql.replaceAll("```sql", "").replaceAll("```", "").trim();

        // Remove trailing semicolon for consistency
        if (sql.endsWith(";")) {
            sql = sql.substring(0, sql.length() - 1);
        }

        return sql.trim();
    }

    private String extractExplanation(String aiResponse) {
        String response = aiResponse.trim();
        int expStart = response.toUpperCase().indexOf("EXPLANATION:");
        if (expStart == -1) {
            return "Cau query duoc tao tu yeu cau cua ban";
        }
        return response.substring(expStart + 12).trim();
    }

    private boolean isValidSelectQuery(String sql) {
        if (sql == null || sql.isEmpty()) {
            return false;
        }

        String upperSql = sql.toUpperCase().trim();

        // Must start with SELECT or WITH (for CTEs)
        if (!upperSql.startsWith("SELECT") && !upperSql.startsWith("WITH")) {
            return false;
        }

        // Check for dangerous keywords
        return !DANGEROUS_SQL_PATTERN.matcher(sql).find();
    }

    private String ensureLimit(String sql) {
        String upperSql = sql.toUpperCase();
        if (!upperSql.contains("LIMIT")) {
            return sql + " LIMIT " + MAX_ROWS;
        }
        return sql;
    }

    private List<Map<String, Object>> executeQuery(String sql) {
        return jdbcTemplate.queryForList(sql);
    }
}
