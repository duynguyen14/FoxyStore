package com.example.back.dto.response.User;
import lombok.*;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRole {
    private Set<Integer> roleIds;
}
