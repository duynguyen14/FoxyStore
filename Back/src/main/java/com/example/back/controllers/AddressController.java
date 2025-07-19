package com.example.back.controllers;

import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.Address.AddressDTO;
import com.example.back.service.AddressService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("${api.key}/")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AddressController {
    AddressService addressService;

    @GetMapping("address")
    public APIResponse<List<AddressDTO>> listAPIResponse(){
        return APIResponse.<List<AddressDTO>>builder()
                .result(addressService.getAllAddress())
                .build();
    }
    @PostMapping("address")
    public APIResponse<List<AddressDTO>> addAddress(@RequestBody @Valid AddressDTO addressDTO){
        System.out.println(addressDTO.getIsDefault());
        return APIResponse.<List<AddressDTO>>builder()
                .result(addressService.addAddress(addressDTO))
                .build();
    }
    @DeleteMapping("address/{id}")
    public APIResponse<List<AddressDTO>> deleteAddress(@PathVariable Integer id){
        return  APIResponse.<List<AddressDTO>>builder()
                .result(addressService.deleteAddress(id))
                .build();
    }
    @PatchMapping("address")
    public APIResponse<List<AddressDTO>> updateAddress(@RequestBody @Valid AddressDTO addressDTO){
        System.out.println(addressDTO.getName());
        return APIResponse.<List<AddressDTO>>builder()
                .result(addressService.updateAddress(addressDTO))
                .build();
    }
}
