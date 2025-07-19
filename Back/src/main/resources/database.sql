
    CREATE DATABASE foxy_shop;
    USE foxy_shop;

    CREATE TABLE USERS (
      UserId INT PRIMARY KEY AUTO_INCREMENT,
      Email VARCHAR(200),
      UserName VARCHAR(200),
      Password VARCHAR(200),
      Status VARCHAR(200),
      Gender VARCHAR(50),
      DOB DATETIME
    );

    CREATE TABLE ROLE (
      RoleId INT PRIMARY KEY AUTO_INCREMENT,
      RoleName VARCHAR(200),
      Description VARCHAR(200)
    );

    CREATE TABLE USER_ROLE (
      id INT PRIMARY KEY AUTO_INCREMENT,
      UserId INT,
      RoleId INT,
      FOREIGN KEY (UserId) REFERENCES USERS(UserId),
      FOREIGN KEY (RoleId) REFERENCES ROLE(RoleId)
    );

    CREATE TABLE CATALOG (
      CatalogId INT PRIMARY KEY AUTO_INCREMENT,
      Name VARCHAR(200)
    );

    CREATE TABLE CATEGORY (
      CategoryId INT PRIMARY KEY AUTO_INCREMENT,
      Name VARCHAR(200),
      CatalogId INT,
      FOREIGN KEY (CatalogId) REFERENCES CATALOG(CatalogId)
    );

    CREATE TABLE PRODUCT (
      ProductId INT PRIMARY KEY AUTO_INCREMENT,
      Name VARCHAR(200),
      Price DECIMAL(10,2),
      Quantity INT,
      Description VARCHAR(200),
      CategoryId INT,
      FOREIGN KEY (CategoryId) REFERENCES CATEGORY(CategoryId)
    );

    CREATE TABLE SIZE (
      SizeId INT PRIMARY KEY AUTO_INCREMENT,
      SizeName VARCHAR(20)
    );

    CREATE TABLE PRODUCT_SIZE (
      ProductId INT,
      SizeId INT,
      PRIMARY KEY (ProductId, SizeId),
      FOREIGN KEY (ProductId) REFERENCES PRODUCT(ProductId),
      FOREIGN KEY (SizeId) REFERENCES SIZE(SizeId)
    );

    CREATE TABLE IMAGE (
      ImageId INT PRIMARY KEY AUTO_INCREMENT,
      Image VARCHAR(200),
      Description VARCHAR(200),
      ProductId INT,
      FOREIGN KEY (ProductId) REFERENCES PRODUCT(ProductId)
    );

    CREATE TABLE REVIEW (
      ReviewId INT PRIMARY KEY AUTO_INCREMENT,
      Comment VARCHAR(200),
      Rating INT,
      Time DATETIME,
      ProductId INT,
      UserId INT,
      FOREIGN KEY (ProductId) REFERENCES PRODUCT(ProductId),
      FOREIGN KEY (UserId) REFERENCES USERS(UserId)
    );

    CREATE TABLE ADDRESS (
      AddressId INT PRIMARY KEY AUTO_INCREMENT,
      City VARCHAR(100),
      Street VARCHAR(200),
      DetailedAddress VARCHAR(200),
      Name VARCHAR(200),
      PhoneNumber VARCHAR(15),
      UserId INT,
      FOREIGN KEY (UserId) REFERENCES USERS(UserId)
    );

    CREATE TABLE BILL (
      BillId INT PRIMARY KEY AUTO_INCREMENT,
      Time DATETIME,
      Status VARCHAR(50),
      UserId INT,
      AddressId INT,
      FOREIGN KEY (UserId) REFERENCES USERS(UserId),
      FOREIGN KEY (AddressId) REFERENCES ADDRESS(AddressId)
    );

    CREATE TABLE BILLDETAIL (
      BillId INT,
      ProductId INT,
      Quantity INT,
      PRIMARY KEY (BillId, ProductId),
      FOREIGN KEY (BillId) REFERENCES BILL(BillId),
      FOREIGN KEY (ProductId) REFERENCES PRODUCT(ProductId)
    );

    CREATE TABLE SHOPPINGCART (
      ShoppingCartId INT PRIMARY KEY AUTO_INCREMENT,
      Description VARCHAR(200),
      UserId INT,
      FOREIGN KEY (UserId) REFERENCES USERS(UserId)
    );

    CREATE TABLE SHOPPINGCARTDETAIL (
      ShoppingCartId INT,
      ProductId INT,
      Quantity INT,
      Total DECIMAL(10,2),
      PRIMARY KEY (ShoppingCartId, ProductId),
      FOREIGN KEY (ShoppingCartId) REFERENCES SHOPPINGCART(ShoppingCartId),
      FOREIGN KEY (ProductId) REFERENCES PRODUCT(ProductId)
    );