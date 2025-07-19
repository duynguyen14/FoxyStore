package com.example.back.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillDetailId implements Serializable {
//    @Column(name = "BillId")
    private Integer billId;

//    @Column(name = "ProductId")
    private Integer productSizeId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BillDetailId that = (BillDetailId) o;
        return Objects.equals(billId, that.billId) &&
                Objects.equals(productSizeId, that.productSizeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(billId, productSizeId);
    }
}

