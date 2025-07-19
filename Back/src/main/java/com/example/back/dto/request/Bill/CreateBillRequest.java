package com.example.back.dto.request.Bill;

import com.example.back.dto.response.Product.ProductSizeDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateBillRequest {
    List<ProductSizeDTO> productSizeDTOs;
    Integer addressId;
    String paymentMethod;
}
