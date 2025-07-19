package com.example.back.controllers;

import com.example.back.dto.request.CategoryRequestDTO.CategoryCreateUpdateDTO;
import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.Category.CategoryDTO;
import com.example.back.dto.response.Category.CategoryDTOWithCTLid;
import com.example.back.dto.response.Category.CategoryDetailDTO;
import com.example.back.dto.response.Category.ResponeDTO;
import com.example.back.repository.CategoryRepository;
import com.example.back.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.key}/category")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CategoryController {
    @Autowired
    CategoryService categoryService;
    @GetMapping("/getAll")
    public APIResponse<List<CategoryDTO>> getCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return APIResponse.<List<CategoryDTO>>builder()
                .result(categories)
                .build();
    }
    @GetMapping("/detail")
    public APIResponse<List<CategoryDetailDTO>> getAllDetails() {
        return APIResponse.<List<CategoryDetailDTO>>builder()
                .result(categoryService.getAllCategoryDetails())
                .build();
    }
    @PostMapping("/create")
    public APIResponse<ResponeDTO> createCategory(@RequestBody CategoryCreateUpdateDTO createDto) {
        try {
            ResponeDTO createdCategory = categoryService.createCategory(createDto);
            return APIResponse.<ResponeDTO>builder()
                    .code(1000)
                    .message("Tạo mới category thành công")
                    .result(createdCategory)
                    .build();
        } catch (RuntimeException e) {
            return APIResponse.<ResponeDTO>builder()
                    .code(9999)
                    .message("Lỗi khi tạo mới category: " + e.getMessage())
                    .result(null)
                    .build();
        }
    }
    @PutMapping("/update/{id}")
    public APIResponse<CategoryDTOWithCTLid> updateCategory(@PathVariable Integer id,
                                                            @RequestBody CategoryCreateUpdateDTO updateDto) {
        try {
            CategoryDTOWithCTLid updatedCategory = categoryService.updateCategory(id, updateDto);
            return APIResponse.<CategoryDTOWithCTLid>builder()
                    .code(1000)
                    .message("Cập nhật category thành công")
                    .result(updatedCategory)
                    .build();
        } catch (RuntimeException e) {
            return APIResponse.<CategoryDTOWithCTLid>builder()
                    .code(9999)
                    .message("Không tìm thấy category với id = " + id)
                    .result(null)
                    .build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public APIResponse<Void> deleteCategory(@PathVariable Integer id) {
        try {
            categoryService.deleteCategory(id);
            return APIResponse.<Void>builder()
                    .code(1000)
                    .message("Xóa category thành công")
                    .result(null)
                    .build();
        } catch (RuntimeException e) {
            return APIResponse.<Void>builder()
                    .code(2000)
                    .result(null)
                    .build();
        }
    }
}
