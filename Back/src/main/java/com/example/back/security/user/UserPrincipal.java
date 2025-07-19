package com.example.back.security.user;

import com.example.back.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class UserPrincipal implements OAuth2User, UserDetails {
    private Integer id;
    private String email; // email người dùng
    private String password; // Mật khẩu dùng cho login truền thống
    private String name;
    private Collection<? extends GrantedAuthority> authorities; //  danh sách quền
    private Map<String, Object> attributes;

    public UserPrincipal(Integer id,String name, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name =name;
        this.authorities = authorities;
    }

    // Tạo user ap quyen mac dinh la role user
    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toList());

        return new UserPrincipal(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
    //Tạo UserPrincipal dành cho OAuth2 login, gán thêm attributes nhận từ Google
    public static UserPrincipal create(User user, Map<String, Object> attributes) {
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        userPrincipal.setAttributes(attributes);
        return userPrincipal;
    }

    public Integer getId() {
        return id;
    }


    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return name;
    }

//     Những phương thức này giúp xác định tài khoản có còn hợp lệ không.
//     Ở đây, bạn luôn trả true (tức là mọi tài khoản đều hợp lệ).
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public Map<String, Object> getAttributes() { // tra ve du lieu tu google
        return attributes;
    }

    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getName() { // id dinh danh
        return name;
    }
}
