FROM maven:3.9.5-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

#chuẩn bị môi trường cho java
FROM eclipse-temurin:21-jdk-alpine
#thư mục làm việc nơi lưu trữ source code
WORKDIR /app
#thư mục cần copy
COPY --from=builder /app/target/*.jar app.jar
# COPY .env .env
#cổng chạy
EXPOSE 8080
#cmd để chạ
CMD ["java","-jar","app.jar"]