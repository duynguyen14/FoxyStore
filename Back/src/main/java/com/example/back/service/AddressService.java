package com.example.back.service;

import com.example.back.dto.response.Address.AddressDTO;
import com.example.back.entity.Address;
import com.example.back.entity.User;
import com.example.back.enums.ErrorCodes;
import com.example.back.exception.AppException;
import com.example.back.mapper.AddressMapper;
import com.example.back.repository.AddressRepository;
import com.example.back.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressService {
    AddressRepository addressRepository;
    UserRepository userRepository;
    AddressMapper addressMapper;
    User findByUserId(){
        Integer userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
        return userRepository.findById(userId).orElseThrow(()-> new AppException(ErrorCodes.USER_NOT_FOUND));
    }
    @Transactional
    public List<AddressDTO> getAllAddress(){
        User user =findByUserId();
        List<Address> addressList = addressRepository.findByUser(user);
        return  addressList.stream().map(addressMapper::toAddressResponse).toList();
    }
    @Transactional
    public List<AddressDTO> addAddress(AddressDTO addressDTO){
        User user =findByUserId();
        if(addressDTO.getIsDefault()){
            addressRepository.UpdateAllToNonDefault(user.getId());
        }
        Address address =addressMapper.toAddress(addressDTO);
        address.setUser(user);
        addressRepository.save(address);
        List<Address> addressList = addressRepository.findByUser(user);
        return  addressList.stream().map(addressMapper::toAddressResponse).toList();
    }
    @Transactional
    public List<AddressDTO> deleteAddress(Integer id){
        User user =findByUserId();
        Address address =addressRepository.findById(id).orElseThrow(()-> new AppException(ErrorCodes.ADDRESS_NOT_FOUND));
        if(!user.getId().equals(address.getUser().getId())){
            throw new AppException(ErrorCodes.UNAUTHORIZED);
        }
        if(address.getIsDefault()){
            throw new AppException(ErrorCodes.ADDRESS_IS_DEFAULTED);
        }
        addressRepository.delete(address);
        List<Address> addressList = addressRepository.findByUser(user);
        return  addressList.stream().map(addressMapper::toAddressResponse).toList();
    }
    @Transactional
    public List<AddressDTO> updateAddress(AddressDTO addressDTO){
        User user =findByUserId();
        Address address =addressRepository.findById(addressDTO.getId()).orElseThrow(()-> new AppException(ErrorCodes.ADDRESS_NOT_FOUND));
        if(!address.getUser().getId().equals(user.getId())){
            throw new AppException(ErrorCodes.UNAUTHORIZED);
        }
        if (addressDTO.getIsDefault()) {
            List<Address> allAddresses = addressRepository.findByUser(user);
            for (Address addr : allAddresses) {
                if (!addr.getAddressId().equals(addressDTO.getId()) && Boolean.TRUE.equals(addr.getIsDefault())) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            }
        }
        addressMapper.updateAddressFromDto(addressDTO,address);
//        addressMapper.toAddress(addressDTO);
        addressRepository.save(address);
        List<Address> addressList = addressRepository.findByUser(user);
        return  addressList.stream().map(addressMapper::toAddressResponse).toList();
    }
}
