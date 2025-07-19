package com.example.back.dto.response.Bill;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillResponse {
    Integer id;
    LocalDateTime time;
    String status;
    BigDecimal total;
}
