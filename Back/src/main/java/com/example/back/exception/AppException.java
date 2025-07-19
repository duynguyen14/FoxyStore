package com.example.back.exception;

import com.example.back.enums.ErrorCodes;

public class AppException extends RuntimeException{
    ErrorCodes errorCodes;

    public AppException(ErrorCodes errorCodes) {
        super(errorCodes.getMessage());
        this.errorCodes=errorCodes;
    }
}
