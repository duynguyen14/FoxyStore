package com.example.back.service;

import com.example.back.Until.VNPUntils;
import com.example.back.configuration.VNPCofig;
import com.example.back.dto.request.Bill.CreateBillRequest;
import com.example.back.dto.request.Bill.PaymentRequest;
import com.example.back.dto.request.User.ActionDTO;
import com.example.back.dto.response.Bill.BillDTO;
import com.example.back.dto.response.Bill.BillDetailResponse;
import com.example.back.dto.response.Bill.BillResponse;
import com.example.back.dto.response.Bill.RecentBillDTO;
import com.example.back.dto.response.Bill.RevenueAndTotalRespone;
import com.example.back.entity.Bill;
import com.example.back.entity.User;
import com.example.back.dto.response.Bill.PaymentResponse;
import com.example.back.dto.response.Cart.CartResponse;
import com.example.back.dto.response.Product.ProductSizeDTO;
import com.example.back.entity.*;
import com.example.back.enums.ActionUser;
import com.example.back.enums.BillStatus;
import com.example.back.enums.ErrorCodes;
import com.example.back.exception.AppException;
import com.example.back.mapper.AddressMapper;
import com.example.back.mapper.BillMapper;
import com.example.back.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.transaction.annotation.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class BillService {
    BillDetailRepository billDetailRepository;
    BillRepository billRepository;

    UserRepository userRepository;
    ProductSizeRepository productSizeRepository;
    BillMapper billMapper;

    ShoppingCartRepository shoppingCartRepository;
    AddressRepository addressRepository;
    AddressMapper addressMapper;

    VNPUntils vnPayUtils;
    VNPCofig vnpCofig;

    BehaviorService behaviorService;
    User getCurrentUser() {
        Integer userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodes.USER_NOT_FOUND));
    }

//    public List<BillResponse> getAllBillByUser1(){
//        User user=getCurrentUser();
//        List<Bill> bills=billRepository.getByUser(user);
//        return bills.stream().map(billMapper::toBillResponse).toList();
//    }
    public List<BillResponse> getAllBillByUser(){
        User user = getCurrentUser();
        List<Bill> bills=billRepository.findByUser(user);
        return bills.stream().map(billMapper::toBillResponse).toList();
    }
    public RevenueAndTotalRespone getBillStats() {
        Long totalOrders = billRepository.countCompletedBills();
        BigDecimal totalRevenue = billDetailRepository.sumTotalRevenueFromCompletedBills();

        return RevenueAndTotalRespone.builder()
                .totalOrder(totalOrders)
                .totalRevenue(totalRevenue)
                .build();
    }
    //

    public List<RecentBillDTO> getMostRecentBill(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Bill> recentBills = billRepository.findMostRecentBill(pageable);
        if (recentBills.isEmpty()) {
            throw new RuntimeException("Không tìm thấy đơn hàng nào");
        }

        return recentBills.stream()
                .map(bill -> RecentBillDTO.builder()
                        .billId(bill.getBillId())
                        .customerName(bill.getUser().getUserName())
                        .orderDate(bill.getTime())
                        .orderValue(bill.getTotal())
                        .orderStatus(bill.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public BillResponse createBill(CreateBillRequest billRequest){
        User user =getCurrentUser();
        Address address =addressRepository.findById(billRequest.getAddressId()).orElseThrow(()-> new AppException(ErrorCodes.ADDRESS_NOT_FOUND));
        Bill bill = Bill.builder()
                .user(user)
                .time(LocalDateTime.now())
                .status(BillStatus.PENDING.getLabel())
                .address(address)
                .paymentMethod(billRequest.getPaymentMethod())
                .build();
        bill = billRepository.save(bill); // lưu để có ID
        BigDecimal total = BigDecimal.ZERO;
        for (ProductSizeDTO productSizeDTO : billRequest.getProductSizeDTOs()) {
            ProductSize productSize = productSizeRepository.findByIdWithProduct(productSizeDTO.getProductSizeId())
                    .orElseThrow(() -> new AppException(ErrorCodes.PRODUCT_NOT_FOUND));
            if(productSize.getQuantity()< productSizeDTO.getQuantity()){
                throw new AppException(ErrorCodes.PRODUCT_QUANTITY_UNAVAILABLE);
            }
            Product product =productSize.getProduct();
            BigDecimal quantity =BigDecimal.valueOf(productSizeDTO.getQuantity());
            total =total.add(product.getPrice().multiply(quantity));
            BillDetail billDetail = BillDetail.builder()
                    .bill(bill) // liên kết bill
                    .productSize(productSize)
                    .quantity(productSizeDTO.getQuantity())
                    .build();
            billDetail.setId(new BillDetailId(bill.getBillId(), productSize.getId()));
            productSize.setQuantity(productSize.getQuantity()-billDetail.getQuantity());
            //        log behavior
            ActionUser actionUser = ActionUser.PURCHASE;
            ActionDTO actionDTO = ActionDTO.builder()
                    .action(actionUser.getAction())
                    .productId(product.getProductId())
                    .build();
            behaviorService.createBehavior(actionDTO);
            productSizeRepository.save(productSize);
            billDetailRepository.save(billDetail);
        }
        bill.setTotal(total);
        billRepository.save(bill);
        ShoppingCart shoppingCart=shoppingCartRepository.findByUser(user).orElseThrow(()-> new AppException(ErrorCodes.SHOPPING_CART_NOT_FOUND));
        shoppingCart.getCartDetails().clear();
        shoppingCartRepository.delete(shoppingCart);

        return billMapper.toBillResponse(bill);
    }
    public BillDetailResponse getBillDetail(Integer id){
        User user =getCurrentUser();
        Bill bill =billRepository.getBillDetailById(id).orElseThrow(()-> new AppException(ErrorCodes.BILL_NOT_FOUND));
        Address address =bill.getAddress();
        Set<BillDetail> billDetails =bill.getBillDetails();
        List<CartResponse> products=billDetails.stream().map(billDetail -> {
            ProductSize productSize =billDetail.getProductSize();
            Product product =productSize.getProduct();
            Size size =productSize.getSize();
            return CartResponse.builder()
                    .price(product.getPrice())
                    .images(product.getImages().stream().map(Image::getImage).collect(Collectors.toSet()))
                    .productName(product.getName())
                    .sizeName(size.getSizeName())
                    .productSizeId(productSize.getId())
                    .quantity(billDetail.getQuantity())
                    .build();
        }).toList();
        return BillDetailResponse.builder()
                .address(addressMapper.toAddressResponse(address))
                .bill(billMapper.toBillResponse(bill))
                .products(products)
                .build();
    }
    @Transactional
    public String cancelBill(Integer id){
        User user =getCurrentUser();
        Bill bill =billRepository.getBillDetailById(id).orElseThrow(()-> new AppException(ErrorCodes.BILL_NOT_FOUND));
        if(!bill.getUser().equals(user)){
            throw new AppException(ErrorCodes.UNAUTHORIZED);
        }
        if(!bill.getStatus().equalsIgnoreCase("chờ xác nhận")){
            throw new AppException(ErrorCodes.INVALID_BILL_STATUS);
        }
        Set<BillDetail> billDetails =bill.getBillDetails();
        for(BillDetail billDetail: billDetails){
            ProductSize productSize =billDetail.getProductSize();
            productSize.setQuantity(productSize.getQuantity()+billDetail.getQuantity());
            productSizeRepository.save(productSize);
        }
        bill.setStatus(BillStatus.CANCELLED.getLabel());
        billRepository.save(bill);
        return "huỷ đơn hàng thành công";
    }
    public PaymentResponse createPayment(PaymentRequest paymentRequest, HttpServletRequest httpServletRequest) {
        String version = "2.1.0";
        String command = "pay";
        String orderType = "other";
        long amount = paymentRequest.getAmount() * 100; // Số tiền cần nhân với 100

        String transactionReference = vnPayUtils.getRandomNumber(8); // Mã giao dịch
        String clientIpAddress = vnPayUtils.getIpAddress(httpServletRequest);

        String terminalCode = vnpCofig.getVnpTmnCode();

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", version);
        params.put("vnp_Command", command);
        params.put("vnp_TmnCode", terminalCode);
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");

        params.put("vnp_TxnRef", transactionReference);
        params.put("vnp_OrderInfo", "Thanh toan don hang:" + transactionReference);
        params.put("vnp_OrderType", orderType);

        String locale = paymentRequest.getLanguage();

        if (locale != null && !locale.isEmpty()) {
            params.put("vnp_Locale", locale);
        } else {
            params.put("vnp_Locale", "vn");
        }

        params.put("vnp_ReturnUrl", vnpCofig.getVnpReturnUrl());
        params.put("vnp_IpAddr", clientIpAddress);
        if(paymentRequest.getBankCode() != null){
            params.put("vnp_BankCode", paymentRequest.getBankCode());
        }

        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        String createdDate = dateFormat.format(calendar.getTime());
        params.put("vnp_CreateDate", createdDate);

        calendar.add(Calendar.MINUTE, 15);
        String expirationDate = dateFormat.format(calendar.getTime());
        params.put("vnp_ExpireDate", expirationDate);

        List<String> sortedFieldNames = new ArrayList<>(params.keySet());
        Collections.sort(sortedFieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder queryData = new StringBuilder();

        for (Iterator<String> iterator = sortedFieldNames.iterator(); iterator.hasNext(); ) {
            String fieldName = iterator.next();
            String fieldValue = params.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                queryData.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (iterator.hasNext()) {
                    hashData.append('&');
                    queryData.append('&');
                }
            }
        }
        String secureHash = vnPayUtils.hmacSHA512(vnpCofig.getSecretKey(), hashData.toString());
        queryData.append("&vnp_SecureHash=").append(secureHash);

        return PaymentResponse.builder()
                .url(vnpCofig.getVnpPayUrl() + "?" + queryData)
                .build();
    }
    @Transactional(readOnly = true)
    public List<BillDTO> getAllBills() {
        List<Bill> bills = billRepository.getProductInBillByAdmin();
        return bills.stream()
                .map(BillMapper::toDTO)
                .collect(Collectors.toList());
    }
    public List<BillDTO> getRevenue(){
        List<Bill> bills = billRepository.getRevenue(BillStatus.SHIPPED.getLabel());
        return bills.stream()
                .map(BillMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BillDTO getBillById(Integer id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bill not found"));

        bill.getBillDetails().size();
        if (bill.getUser() != null) bill.getUser().getUserName();
        if (bill.getAddress() != null) bill.getAddress().getCity();

        return BillMapper.toDTO(bill);
    }

    @Transactional
    public void updateBillStatus(Integer id, String newStatus) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bill not found"));
        bill.setStatus(newStatus);
        billRepository.save(bill);
    }

}
