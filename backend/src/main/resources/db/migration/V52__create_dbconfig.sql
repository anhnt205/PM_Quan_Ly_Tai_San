 CREATE TABLE DbConfig (
                    Id NVARCHAR(50) PRIMARY KEY,
                    Dbms NVARCHAR(50),
                    Ip NVARCHAR(50),
                    Port NVARCHAR(20),
                    Username NVARCHAR(50),
                    Password NVARCHAR(255),
                    IdCongTy NVARCHAR(50),
                    NgayTao NVARCHAR(50),
                    NgayCapNhat NVARCHAR(50)
 )