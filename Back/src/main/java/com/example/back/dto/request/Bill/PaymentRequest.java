package com.example.back.dto.request.Bill;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonIgnoreProperties(ignoreUnknown = true)
public class PaymentRequest {
    @JsonProperty("amount")
    Long amount;
    @JsonProperty("language")
    String language; // "vn", "en"
    @JsonProperty("bankCode")
    String bankCode;
    @JsonProperty("name")
    String name;
    @JsonProperty("code")
    String code;

}
