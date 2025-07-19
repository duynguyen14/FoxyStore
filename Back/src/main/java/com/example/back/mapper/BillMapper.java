package com.example.back.mapper;

import com.example.back.dto.response.Bill.BillDTO;
import com.example.back.dto.response.Bill.BillDetailDTO;
import com.example.back.dto.response.Bill.BillResponse;
import com.example.back.entity.Address;
import com.example.back.entity.Bill;
import com.example.back.entity.BillDetail;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@Component
public class BillMapper {
    public BillResponse toBillResponse(Bill bill){
        return BillResponse.builder()
                .id(bill.getBillId())
                .total(bill.getTotal())
                .status(bill.getStatus())
                .time(bill.getTime())
                .build();
    }


    public static BillDTO toDTO(Bill bill) {
        return BillDTO.builder()
                .billId(bill.getBillId())
                .time(bill.getTime())
                .status(bill.getStatus())
                .userName(bill.getUser() != null ? bill.getUser().getUserName() : "N/A")
                .address(buildAddressString(bill))
                .billDetails(mapBillDetails(bill.getBillDetails()))
                .build();
    }

    private static String buildAddressString(Bill bill) {
        Address address = bill.getAddress();
        if (address == null) return "N/A";

        return String.join(", ",
                safeValue(address.getStreet()),
                safeValue(address.getDetailedAddress()),
                safeValue(address.getCity())
        );
    }

    private static List<BillDetailDTO> mapBillDetails(Set<BillDetail> billDetails) {
        return billDetails.stream().map(detail -> BillDetailDTO.builder()
                .productName(detail.getProductSize() != null ? detail.getProductSize().getProduct().getName() : "N/A")
                .quantity(detail.getQuantity())
                .price(detail.getProductSize() != null ? detail.getProductSize().getProduct().getPrice() : null)  // Lấy giá từ product
                .build()
        ).collect(Collectors.toList());
    }

    private static String safeValue(String value) {
        return value != null ? value : "N/A";
    }
}
