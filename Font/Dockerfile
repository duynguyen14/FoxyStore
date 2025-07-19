#chuẩn bị môi trường cho java
FROM eclipse-temurin:21-jdk-alpine
#thư mục làm việc nơi lưu trữ source code
WORKDIR /app
#thư mục cần copy
COPY target/back-0.0.1-SNAPSHOT.jar app.jar
COPY .env .env
#cổng chạy
EXPOSE 8080
#cmd để chạy
CMD ["java","-jar","app.jar"]