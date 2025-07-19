package com.example.back.enums;

import lombok.RequiredArgsConstructor;


public enum Payments {
    COD("COD"),
    QR("QR"),
    BANK("BANK")
    ;
    private final  String methodPayment;

    Payments(String methodPayment) {
        this.methodPayment = methodPayment;
    }

    public String getMethodPayment() {
        return methodPayment;
    }
}
