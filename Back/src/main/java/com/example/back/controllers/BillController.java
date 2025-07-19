package com.example.back.controllers;

import com.example.back.dto.request.Bill.CreateBillRequest;
import com.example.back.dto.request.Bill.PaymentRequest;
import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.Bill.*;
import com.example.back.service.BillService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.key}/bill")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class BillController {
    BillService billService;
    @GetMapping("getAll")
    public APIResponse<List<BillResponse>> getAllBillByUser(){
        return  APIResponse.<List<BillResponse>>builder()
                .result(billService.getAllBillByUser())
                .build();
    }
    @GetMapping("stats")
    public RevenueAndTotalRespone getBillStats() {
        return billService.getBillStats();
    }
    @GetMapping("recent")
    public APIResponse<List<RecentBillDTO>> getMostRecentBills(@RequestParam(defaultValue = "5") int limit) {
        try {
            List<RecentBillDTO> recentBills = billService.getMostRecentBill(limit);
            return APIResponse.<List<RecentBillDTO>>builder()
                    .result(recentBills)
                    .build();
        } catch (RuntimeException e) {
            return APIResponse.<List<RecentBillDTO>>builder()
                    .code(404)
                    .message(e.getMessage())
                    .build();
        }
    }


    @PostMapping("create")
    public APIResponse<BillResponse> createBill(@RequestBody CreateBillRequest createBillRequest){
        return APIResponse.<BillResponse>builder()
                .result(billService.createBill(createBillRequest))
                .build();
    }
    @GetMapping("detail/{id}")
    public APIResponse<BillDetailResponse> getBillDetail(@PathVariable Integer id){
        return APIResponse.<BillDetailResponse>builder()
                .result(billService.getBillDetail(id))
                .build();
    }
    @PatchMapping("detail/{id}")
    public APIResponse<String> cancelBill(@PathVariable Integer id){
        return APIResponse.<String>builder()
                .result(billService.cancelBill(id))
                .build();
    }
    @PostMapping("create/payment")
    public APIResponse<PaymentResponse> createPaymentResponse(@RequestBody PaymentRequest paymentRequest, HttpServletRequest httpServletRequest){
        return APIResponse.<PaymentResponse>builder()
                .result(billService.createPayment(paymentRequest,httpServletRequest))
                .build();
    }
    @GetMapping("admin")
    public ResponseEntity<?> getAllBills() {
        try {
            List<BillDTO> bills = billService.getAllBills();
            return ResponseEntity.ok(bills);
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi chi tiết vào console
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("code", 9999, "message", e.getClass().getSimpleName() + ": " + e.getMessage()));
        }
    }

    @GetMapping("admin/revenue")
    public APIResponse<List<BillDTO>> getRevenue(){
        return APIResponse.<List<BillDTO>>builder()
                .result(billService.getRevenue())
                .build();
    }
    @GetMapping("admin/{id}")
    public ResponseEntity<?> getBillById(@PathVariable Integer id) {
        try {
            BillDTO bill = billService.getBillById(id);
            return ResponseEntity.ok(bill);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("code", 404, "message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("code", 9999, "message", e.getClass().getSimpleName() + ": " + e.getMessage()));
        }
    }
    @PutMapping("admin/{id}/status")
    public ResponseEntity<?> updateBillStatus(@PathVariable Integer id, @RequestParam String status) {
        try {
            billService.updateBillStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("code", 404, "message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("code", 9999, "message", e.getClass().getSimpleName() + ": " + e.getMessage()));
        }
    }
}
