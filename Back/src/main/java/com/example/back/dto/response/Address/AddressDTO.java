package com.example.back.dto.response.Address;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressDTO {
    Integer id;
    String city;
    String street;
    String detailAddress;
    String name;
    Integer phoneNumber;
    Boolean isDefault;
}
