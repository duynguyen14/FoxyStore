package com.example.back.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BaseEntity {
    @JsonProperty("id")
    private int id;
}
