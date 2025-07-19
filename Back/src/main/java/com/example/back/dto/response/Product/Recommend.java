package com.example.back.dto.response.Product;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Recommend {
    Integer productId;
}
