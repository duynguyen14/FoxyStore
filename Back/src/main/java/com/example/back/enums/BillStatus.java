package com.example.back.enums;

import lombok.Getter;

@Getter
public enum BillStatus {
    PENDING("Chờ xác nhận"),
    CONFIRMED("Đã xác nhận"),
    SHIPPING("Đang giao"),
    SHIPPED("Đã giao"),
    CANCELLED("Đã huỷ")

    ;
    private final String label;

    BillStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
