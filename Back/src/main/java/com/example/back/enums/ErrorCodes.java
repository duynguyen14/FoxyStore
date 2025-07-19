package com.example.back.enums;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCodes {

    UNCATEGORIZED_EXCEPTION(9999,"undefined error",HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXISTED(1001,"user is existed", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1002,"user not found", HttpStatus.NOT_FOUND),
    USER_NAME_OR_PASSWORD_INCORRECT(1003, "user name or password incorrect", HttpStatus.BAD_REQUEST),
    EMAIL_IS_REQUIRED(1004, "Email không được để trống", HttpStatus.BAD_REQUEST),
    USER_NAME_IS_REQUIRED(1008, "Tên người dùng không được để trống", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1005, "Email không đúng định dạng", HttpStatus.BAD_REQUEST),
    PASSWORD_IS_REQUIRED(1006, "Mật khẩu không được để trống", HttpStatus.BAD_REQUEST),
    PASSWORD_TOO_SHORT(1007, "password must be at least 6 characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INCORRECT(1008,"password incorrect", HttpStatus.BAD_REQUEST),
    ADDRESS_IS_DEFAULTED(1101, "address is defaulted", HttpStatus.BAD_REQUEST),
    ADDRESS_NOT_FOUND(1102,"address not found", HttpStatus.NOT_FOUND),

    UNAUTHENTICATED(2000,"unauthorized", HttpStatus.UNAUTHORIZED),

    UNAUTHORIZED(2001, "you do not have permission",HttpStatus.FORBIDDEN),
    ROLE_NOT_FOUND(1101, "role not found", HttpStatus.NOT_FOUND),


    PRODUCT_NOT_FOUND(1201,"product not found",HttpStatus.NOT_FOUND),
    PRODUCT_QUANTITY_UNAVAILABLE(1202, "product quantity unavailable", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(1203,"category not found", HttpStatus.NOT_FOUND),

    SIZE_NOT_FOUND(1301, "size not found", HttpStatus.NOT_FOUND),

    SHOPPING_CART_NOT_FOUND(1401, "shopping cart not found", HttpStatus.NOT_FOUND),
    SHOPPING_CART_DETAIL_NOT_FOUND(1402, "shopping cart detail not found", HttpStatus.NOT_FOUND),


    BILL_NOT_FOUND(1501,"bill not found", HttpStatus.NOT_FOUND),
    INVALID_BILL_STATUS(1502,"invalid bill status", HttpStatus.BAD_REQUEST),

    FAVORITE_PRODUCT_NOT_FOUND(1601,"favorite product not found", HttpStatus.NOT_FOUND)
    ;

    ErrorCodes(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
    private final int code;
    private final String message;
    private final HttpStatus status;
}
