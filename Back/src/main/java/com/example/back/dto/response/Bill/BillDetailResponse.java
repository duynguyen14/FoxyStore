package com.example.back.dto.response.Bill;

import com.example.back.dto.response.Address.AddressDTO;
import com.example.back.dto.response.Cart.CartResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillDetailResponse {
    AddressDTO address;
    BillResponse bill;
    List<CartResponse> products;
}
