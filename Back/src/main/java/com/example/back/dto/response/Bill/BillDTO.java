package com.example.back.dto.response.Bill;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillDTO {
    private Integer billId;
    private LocalDateTime time;
    private String status;
    private String userName;
    private String address;
    private List<BillDetailDTO> billDetails;
}

