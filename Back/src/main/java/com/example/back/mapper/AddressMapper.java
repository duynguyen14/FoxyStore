package com.example.back.mapper;

import com.example.back.dto.response.Address.AddressDTO;
import com.example.back.entity.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {
    public AddressDTO toAddressResponse(Address address){
        return AddressDTO.builder()
                .id(address.getAddressId())
                .phoneNumber(address.getPhoneNumber())
                .detailAddress(address.getDetailedAddress())
                .city(address.getCity())
                .name(address.getName())
                .street(address.getStreet())
                .isDefault(address.getIsDefault())
                .build();
    }
    public Address toAddress(AddressDTO addressDTO){
        return Address.builder()
                .detailedAddress(addressDTO.getDetailAddress())
                .isDefault(addressDTO.getIsDefault())
                .street(addressDTO.getStreet())
                .city(addressDTO.getCity())
                .phoneNumber(addressDTO.getPhoneNumber())
                .name(addressDTO.getName())
                .build();
    }
    public void updateAddressFromDto(AddressDTO dto, Address entity) {
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setDetailedAddress(dto.getDetailAddress());
        entity.setCity(dto.getCity());
        entity.setName(dto.getName());
        entity.setStreet(dto.getStreet());
        entity.setIsDefault(dto.getIsDefault());
    }

}
