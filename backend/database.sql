create database QuanLyNhanSu
go
use QuanLyNhanSu
go
create table IdentityType(
    IdentityTypeID int identity(1,1) primary key,
    Name nvarchar(500),
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate(),
    CreateBy nvarchar(50),
    UpdatedBy nvarchar(50),
    IsActive bit default 1
)
go
create table WorkType(
    WorkTypeID int identity(1,1) primary key,
    Name nvarchar(500),
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate(),
    CreateBy nvarchar(50),
    UpdatedBy nvarchar(50),
    IsActive bit default 1
)
go
create table User(
    UserID int identity(1,1) primary key,
    UserName nvarchar(50),
    Password nvarchar(50),
    FullName nvarchar(100),
    Email nvarchar(100),
    PhoneNumber nvarchar(15),
    Avatar ntext,
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate()    
    CompanyID int,
    IsActive bit default 1
)
go
create table Role(
    RoleID int identity(1,1) primary key,
    Name nvarchar(100),
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate(),
    CreateBy nvarchar(50),
    UpdatedBy nvarchar(50),
    CompanyID int
    IsActive bit default 1
)
go
create table RoleMajor(
    RoleMajorID int identity(1,1) primary key,
    RoleID int
    Name nvarchar(100),
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate(),
    CreateBy nvarchar(50),
    UpdatedBy nvarchar(50),
    CompanyID int
    IsActive bit default 1
)
go
create table SetRole(
    ID int identity(1,1) primary key,
    RoleID int,
    UserID int
)
go
create table SetRole(
    ID int identity(1,1) primary key,
    RoleMajorID int,
    UserID int
)
go
create table Company(
    CompanyID int identity(1,1) primary key,
    CompanyName nvarchar(500),
    ShortName nvarchar(50),
    IdentityTypeID int,
    Email varchar(100),
    HeadquarterCountry nvarchar(100),
    HeadquarterCity nvarchar(100),
    HeadquarterCommune nvarchar(100),
    HeadquarterOther nvarchar(500),
    CompanyFavicon nvarchar(1000),
    TaxNumber varchar(100),
    Website varchar(200),
    PhoneNumber varchar(20),
    Representative int,
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate(),
    CreateBy nvarchar(50),
    UpdatedBy nvarchar(50),
    IsActive bit default 1
)
go
create table OfficeCompany(
    OfficeCompanyID int identity(1,1) primary key,
    CompanyID int,
    OfficeCountry nvarchar(100),
    OfficeCity nvarchar(100),
    OfficeCommune nvarchar(100),
    OfficeOther nvarchar(500),
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate(),
    CreateBy nvarchar(50),
    UpdatedBy nvarchar(50),
    IsActive bit default 1
)
go
create table Department(
    DepartmentID int identity(1,1) primary key,
    DepartmentName nvarchar(100),
    Description nvarchar(500),
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate(),
    CreateBy nvarchar(50),
    UpdatedBy nvarchar(50),
    CompanyID int,
    ManagerID int,
    SuperiorDepartmentID int
    RateKPI float,
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate(),
    CreateBy nvarchar(50),
    UpdatedBy nvarchar(50),
    IsActive bit default 1
)
go
create table Position(
    PositionID int identity(1,1) primary key,
    PositionName nvarchar(100),
    Level int,
    ShortName nvarchar(50),
    ThresholdTime float,
    KPISalary float,
    TravelAllowance float,
    PhoneAllowance float,
    ResponsibilityAllowance float,
    MealAllowance float,
    OtherAllowance float,
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate(),
    CreateBy nvarchar(50),
    UpdatedBy nvarchar(50),
    DepartmentID int,
    IsActive bit default 1
)
go
create table RecruitmentPosition(
    RecruitmentPositionID int identity(1,1) primary key,
    Description ntext,
    DepartmentID int,
    OfficeCompanyID int,
    WorkTypeID int,
    Target int,
    RecruiterID,
    InterviewerID, 
    DepartmentID int,
    PositionID int
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate(),
    CreateBy nvarchar(50),
    UpdatedBy nvarchar(50),
    Note ntext,
    IsActive bit default 1
)
go
create table SetPosition(
    ID int identity(1,1) primary key,
    PositionID int,
    UserId int
)
go
create table Decision(
    ID int identity(1,1) primary key,
    Name nvarchar(100),
    CreatedAt datetime default getdate(),
    UpdatedAt datetime default getdate(),
    CreateBy nvarchar(50),
    UpdatedBy nvarchar(50),
    CompanyID int
    IsActive bit default 1
)
go

