@echo off
REM Đặt thư mục log
set LOG_DIR=D:\QUANLYTAISAN\logs
if not exist %LOG_DIR% mkdir %LOG_DIR%

REM Chạy Spring Boot JAR
"C:\Program Files\Java\jdk-21\bin\javaw.exe" -jar "D:\QUANLYTAISAN\PM-QL-tai-san\quanlytaisan\target\quanlytaisan-0.0.1-SNAPSHOT.jar" ^
    >> "%LOG_DIR%\QuanLyTaiSanBE-out.log" 2>> "%LOG_DIR%\QuanLyTaiSanBE-err.log"
