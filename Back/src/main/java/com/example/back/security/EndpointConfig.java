package com.example.back.security;

import org.springframework.http.HttpMethod;

import java.util.List;

public class EndpointConfig {
    public static final List<SecuredEndpoint> PUBLIC_ENDPOINTS = List.of(
            new SecuredEndpoint("/api/v1/user/register", HttpMethod.POST),
            new SecuredEndpoint("/api/v1/user/login", HttpMethod.POST),
            new SecuredEndpoint("/api/v1/user/demo", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/products/home",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/product/{id}",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/product/{id}/related",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/user/list",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/products",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/category/{id}",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/address",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/address",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/address/{id}",HttpMethod.DELETE),
            new SecuredEndpoint("/api/v1/address",HttpMethod.PATCH),
            new SecuredEndpoint("/api/v1/address",HttpMethod.PATCH),
            new SecuredEndpoint("/api/v1/bill/getAll",HttpMethod.GET),
            // open ai
            new SecuredEndpoint("api/v1/chatbot/training/retrain",HttpMethod.POST),
            new SecuredEndpoint("api/v1/openai/ask",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/products",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/products/{productsId}",HttpMethod.PUT),

            new SecuredEndpoint("/api/v1/product/recommend",HttpMethod.GET),


            //behavior
            new SecuredEndpoint("/api/v1/behavior/create",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/behavior/user/{userId}",HttpMethod.GET),
//            web socket
            new SecuredEndpoint("/api/v1/message/admin",HttpMethod.GET)



    );
    public static final List<SecuredEndpoint> AUTHENTICATED_ENDPOINTS=List.of(
            new SecuredEndpoint("/api/v1/user/profile",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/user/change-password",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/user/change-password",HttpMethod.POST)

    );


    public static final List<SecuredEndpoint> USER_ENDPOINTS = List.of(
            new SecuredEndpoint("/api/v1/cart", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/cart", HttpMethod.POST),
            new SecuredEndpoint("/api/v1/cart/{productSizeId}",HttpMethod.DELETE),
            new SecuredEndpoint("/api/v1/cart/update",HttpMethod.PATCH),
//            new SecuredEndpoint("/api/v1/user/profile",HttpMethod.GET),
//            new SecuredEndpoint("/api/v1/user/profile",HttpMethod.PATCH),
//            new SecuredEndpoint("/api/v1/user/change-password",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/bill/getAll",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/bill/create",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/bill/detail/{id}",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/bill/detail/{id}",HttpMethod.PATCH),
            new SecuredEndpoint("/api/v1/bill/create/payment",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/favorite/getAll",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/favorite/{id}",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/favorite/{id}",HttpMethod.DELETE),
            new SecuredEndpoint("/api/v1/reviews/check/{id}",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/reviews/create/{id}",HttpMethod.POST)
            );

    public static final List<SecuredEndpoint> ADMIN_ENDPOINTS = List.of(
//            new SecuredEndpoint("/api/v1/catalog/admin", HttpMethod.GET),
//            new SecuredEndpoint("/api/v1/catalog/admin", HttpMethod.POST),
//            new SecuredEndpoint("/api/v1/catalog/admin/{catalogId}", HttpMethod.PUT),
//            new SecuredEndpoint("/api/v1/catalog/admin/{catalogId}", HttpMethod.DELETE),
//
//
//            new SecuredEndpoint("/api/v1/category/admin", HttpMethod.GET),
//            new SecuredEndpoint("/api/v1/category/admin", HttpMethod.POST),
////            new SecuredEndpoint("/api/v1/category/**/admin", HttpMethod.PUT),
////            new SecuredEndpoint("/api/v1/category/**/admin", HttpMethod.DELETE),

            new SecuredEndpoint("/api/v1/bill/admin", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/bill/admin/{id}", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/bill/admin", HttpMethod.POST),
            new SecuredEndpoint("/api/v1/bills/admin/{id}/status", HttpMethod.PUT),
            new SecuredEndpoint("/api/v1/bill/admin/revenue", HttpMethod.GET),

            new SecuredEndpoint("/api/v1/reviews/admin", HttpMethod.GET),
//            new SecuredEndpoint("/api/v1/reviews/admin", HttpMethod.POST),

            new SecuredEndpoint("/api/v1/admin/getAll", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/admin/user/{id}", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/users/{id}/admin", HttpMethod.PUT),
            new SecuredEndpoint("/api/v1/admin/user/{id}/status", HttpMethod.PUT),
            new SecuredEndpoint("/api/v1/admin/user/{id}/role", HttpMethod.PUT),
            new SecuredEndpoint("/api/v1/reviews/{reviewId}/admin/reply", HttpMethod.PUT),

            // admin
            new SecuredEndpoint("/api/v1/bill/stats", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/bill/recent", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/products/tops", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/products", HttpMethod.POST),
            new SecuredEndpoint("/api/v1/products/{productId}", HttpMethod.PUT),
            new SecuredEndpoint("/api/v1/products/{productId}", HttpMethod.DELETE),
            new SecuredEndpoint("/api/v1/reviews/recent", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/chart/revenue/daily", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/chart/revenue/monthly", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/chart/revenue/quarterly", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/chart/catalog/revenue", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/chart/catalog/products", HttpMethod.GET),
            new SecuredEndpoint("/api/v1/products/search",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/products/summary",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/category/getAll",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/catalog/getAll",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/catalog/active",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/catalog/create",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/catalog/update/{id}",HttpMethod.PUT),
            new SecuredEndpoint("/api/v1/catalog/delete/{id}",HttpMethod.DELETE),
            new SecuredEndpoint("/api/v1/category/detail",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/category/update/{id}",HttpMethod.PUT),
            new SecuredEndpoint("/api/v1/category/create",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/category/delete/{id}",HttpMethod.DELETE),
            new SecuredEndpoint("/api/v1/sale/getAll",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/sale/update/{id}",HttpMethod.PUT),
            new SecuredEndpoint("/api/v1/sale/create",HttpMethod.POST),
            new SecuredEndpoint("/api/v1/sale/delete/{id}",HttpMethod.DELETE),
    // report
            new SecuredEndpoint("/api/v1/inventory",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/revenue",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/revenue/detail",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/inventory/export",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/revenue/export",HttpMethod.GET),
            new SecuredEndpoint("/api/v1/summary",HttpMethod.GET)


    );
}
