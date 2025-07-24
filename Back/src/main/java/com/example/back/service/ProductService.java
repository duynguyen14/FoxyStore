package com.example.back.service;

import com.example.back.dto.request.Products.ProductRequestDTO;
import com.example.back.dto.request.Products.ProductUpdateRequest;
import com.example.back.dto.response.Product.*;
import com.example.back.entity.*;
import com.example.back.enums.ErrorCodes;
import com.example.back.exception.AppException;
import com.example.back.mapper.ProductMapper;
import com.example.back.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductService {

    static final String URL_UPLOAD="D:/Ki6/java web/Upload_Images/images";
    ProductRepository productRepository;
    ProductMapper productMapper;
    CategoryRepository categoryRepository;
    SizeRepository sizeRepository;
    ImageRepository imageRepository;
    ProductSizeRepository productSizeRepository;
    void deletePhysicalFiles(String imagePath){
        Path path = Paths.get(imagePath);
        try {
            Files.deleteIfExists(path);
        }
        catch (Exception e){
            System.out.println("Failed to delete File "+  imagePath);
        }
    }
    public HomeResponseDTO getProductHome(){

        List<Product> productsNew= productRepository.findProductNew(PageRequest.of(0,10));
        List<Product> productsSale =productRepository.findProductSale(PageRequest.of(0,10));

        return HomeResponseDTO.builder()
                .productsSale(productsSale.stream().map(productMapper::toProductHomeDTO).toList())
                .productsNew(productsNew.stream().map(productMapper::toProductHomeDTO).toList())
                .build();

    }

    public ProductDetail getProductDetail(Integer id){
        Product product =productRepository.findProductWithDetail(id).orElseThrow(()->new AppException(ErrorCodes.PRODUCT_NOT_FOUND));
        return productMapper.toProductDetail(product);
    }
    public List<ProductHome> getRelatedProduct(Integer id){
        Product product =productRepository.findByProductId(id).orElseThrow(()-> new AppException(ErrorCodes.PRODUCT_NOT_FOUND));
        Category category = product.getCategory();
        List<Product> products =productRepository.findByCategory(category, PageRequest.of(0,10));
        return products.stream().map(productMapper::toProductHomeDTO).toList();

    }

    public List<ProductHome> getAllProduct(int page){
        List<Product> products =productRepository.findAllProduct(PageRequest.of(page,12));

        return products.stream().map(productMapper::toProductHomeDTO).toList();
    }
    public List<ProductHome> getByCategoryId(Integer CategoryId, int page,String sort){
        Category category= categoryRepository.findByCategoryId(CategoryId).orElseThrow(()-> new AppException(ErrorCodes.CATEGORY_NOT_FOUND));
        Sort sortOrder;
        switch (sort){
            case "bestSold":
                sortOrder=Sort.by(Sort.Direction.DESC, "soldCount");
                break;
            case "price_desc":
                sortOrder =Sort.by(Sort.Direction.DESC,"price");
                break;
            case "price_asc":
                sortOrder= Sort.by(Sort.Direction.ASC,"price");
                break;
            default:
                sortOrder = Sort.by(Sort.Direction.DESC, "createdDate");
                break;
        }
        List<Product> products =productRepository.findByCategory(category,PageRequest.of(page,12,sortOrder));
        return products.stream().map(productMapper::toProductHomeDTO).toList();
    }
    //admin
    public List<TopProductDTO> getTopRatedProducts() {
        List<Product> topProducts = productRepository.findTopRatedProducts(PageRequest.of(0, 5));

        return topProducts.stream().map(product -> {
            double avgRating = product.getReviews().stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);

            String imageUrl = product.getImages().stream()
                    .findFirst()
                    .map(Image::getImage)
                    .orElse(null);

            return TopProductDTO.builder()
                    .id(product.getProductId().longValue())
                    .name(product.getName())
                    .description(product.getDescription())
                    .image(imageUrl)
                    .price(product.getPrice())
                    .soldCount(product.getSoldCount())
                    .createdAt(product.getCreatedDate())
                    .category(product.getCategory() != null ? product.getCategory().getName() : null)
                    .averageRating(avgRating)
                    .build();
        }).collect(Collectors.toList());
    }
    // qlsp
    public Page<ProductInfoDTO> searchProducts(String name, Pageable pageable,BigDecimal minPrice, BigDecimal maxPrice, Integer categoryId) {
        Page<ProductInfoDTO> productPage=productRepository.getAllProductByAdmin(pageable,name,minPrice,maxPrice,categoryId);
        List<Integer> productIds = productPage.getContent().stream().map(ProductInfoDTO::getProductId).toList();
        if(productIds.isEmpty()){
            return productPage;
        }
        List<Object[]> sizeRows = productRepository.getSizesByProductIds(productIds);
        List<Object[]> imageRows =productRepository.getImagesByProductIds(productIds);
        Map<Integer, List<Integer>> sizeMap = new HashMap<>();
        for(Object[] sizeRow : sizeRows){
            Integer productIs = (Integer) sizeRow[0];
            Integer sizeId =(Integer) sizeRow[1];
            sizeMap.computeIfAbsent(productIs, k-> new ArrayList<>()).add(sizeId);
        }
        Map<Integer, List<String>> imageMap = new HashMap<>();
        for(Object[] imageRow: imageRows){
            Integer productId = (Integer) imageRow[0];
            String image =(String) imageRow[1];
            imageMap.computeIfAbsent(productId, k-> new ArrayList<>()).add(image);
        }
        productPage.getContent().forEach(
                productInfoDTO -> {
                    productInfoDTO.setSizes(sizeMap.getOrDefault(productInfoDTO.getProductId(), List.of()));
                    productInfoDTO.setImages(imageMap.getOrDefault(productInfoDTO.getProductId(),List.of()));
                }
        );
        return productPage;

    }
    public SummaryProduct getSummaryProduct(){
        SummaryProduct summaryProduct = productRepository.summaryProduct();
        List<Size> sizes = sizeRepository.findAll();
        List<Category> categories =categoryRepository.findAll();
        summaryProduct.setSizes(sizes);
        summaryProduct.setCategories(categories);
        return summaryProduct;
    }
    // create
    @Transactional
    public void createProduct(ProductRequestDTO request, List<MultipartFile> images) throws IOException {
        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .description(request.getDescription())
                .createdDate(LocalDateTime.now())
                .soldCount(0)
                .isDeleted(false)
                .build();

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);

        // Lưu ảnh
        Set<Image> imageEntities = new HashSet<>();

        // Đường dẫn lưu thực tế (tuyệt đối)
        Path path = Paths.get(URL_UPLOAD);
        for (MultipartFile file : images) {
            if (!file.isEmpty()) {
                // Lấy phần mở rộng
                String originalFilename = file.getOriginalFilename();
                String extension = originalFilename.substring(originalFilename.lastIndexOf(".")); // ví dụ: .jpg

                // Tạo tên ảnh không chứa đuôi
                String filenameNoExt = UUID.randomUUID().toString();

                // Tên file thực tế khi lưu
                String savedFileName = filenameNoExt + extension;

                // Lưu file vào local
                Path savePath = path.resolve(savedFileName);
                Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);

                // Lưu tên file (không có đuôi) vào DB
                imageEntities.add(Image.builder()
                        .image(filenameNoExt)
                        .product(product)
                        .build());
            }
        }

        product.setImages(imageEntities);
        productRepository.save(product);

        // Lưu size
        Set<ProductSize> productSizes = new HashSet<>();
        for (Integer sizeId : request.getSizeIds()) {
            Size size = sizeRepository.findById(sizeId)
                    .orElseThrow(() -> new RuntimeException("Size not found"));
            productSizes.add(ProductSize.builder()
                    .product(product)
                    .size(size)
                    .build());
        }

        product.setProductSizes(productSizes);
        productRepository.save(product);
    }
    @Transactional
    public ProductInfoDTO createProductAdmin(ProductRequestDTO request,List<MultipartFile> images) throws IOException{
        Category category = categoryRepository.findByCategoryId(request.getCategoryId()).orElseThrow(()-> new AppException(ErrorCodes.CATEGORY_NOT_FOUND));
        Product product = Product.builder()
                .createdDate(LocalDateTime.now())
                .description(request.getDescription())
                .name(request.getName())
                .price(request.getPrice())
                .isDeleted(false)
                .soldCount(0)
                .quantity(request.getQuantity())
                .build();
        product.setCategory(category);
        productRepository.save(product);
        Path uploadDir =  Paths.get(URL_UPLOAD);
        Set<Image> imageSet = new HashSet<>();
        for(MultipartFile file : images){
            Image image = Image.builder()
                    .product(product)
                    .build();
            imageRepository.save(image);
            String newFileName = image.getImageId().toString()+".png";
            image.setImage(image.getImageId().toString());
//            imageRepository.save(image);
            imageSet.add(image);
            Path savePath = uploadDir.resolve(newFileName);
            Files.copy(file.getInputStream(),savePath,StandardCopyOption.REPLACE_EXISTING);
        }
        product.setImages(imageSet);
        Set<ProductSize> productSizes =new HashSet<>();
        for(Integer sizeId : request.getSizeIds()){
            Size size = sizeRepository.findById(sizeId).orElseThrow(()-> new AppException(ErrorCodes.SIZE_NOT_FOUND));
            ProductSize productSize = ProductSize.builder()
                    .product(product)
                    .size(size)
                    .quantity(request.getQuantity())
                    .build();
            productSizes.add(productSize);
        }
        product.setProductSizes(productSizes);
        productRepository.save(product);
        return productMapper.toProductInfoDTO(product);
    }



    @Transactional
    public ProductInfoDTO updateProduct (Integer productId, ProductUpdateRequest request, List<MultipartFile> newImages) throws IOException {
//        System.out.println("sizes: "+request.getSizeIds());
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCodes.PRODUCT_NOT_FOUND));

        // Cập nhật thông tin cơ bản
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setDescription(request.getDescription());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCodes.CATEGORY_NOT_FOUND));
        product.setCategory(category);

        // ===== Cập nhật ảnh =====
        Set<Image> currentImages = product.getImages();
        if (currentImages == null) {
            currentImages = new HashSet<>();
            product.setImages(currentImages);
        }

        // Xoá ảnh không còn giữ
        Iterator<Image> iterator = currentImages.iterator();
        while (iterator.hasNext()) {
            Image img = iterator.next();
            if (request.getOldImageNames() == null || !request.getOldImageNames().contains(img.getImage())) {
                Path oldPath = Paths.get(URL_UPLOAD).resolve(img.getImage() + ".png");
                Files.deleteIfExists(oldPath);
                iterator.remove(); // xóa khỏi set, JPA sẽ tự orphanRemove
            }
        }
        System.out.println("new images : "+newImages);
        // Thêm ảnh mới
        if (newImages != null) {
            Path path = Paths.get(URL_UPLOAD);
            if (!Files.exists(path)) Files.createDirectories(path);

            for (MultipartFile file : newImages) {
                if (!file.isEmpty()) {
                    String newName = UUID.randomUUID().toString();
                    Path savePath = path.resolve(newName + ".png");
                    Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);
                    Image newImage = Image.builder()
                            .image(newName)
                            .product(product)
                            .build();
                    currentImages.add(newImage);
                }
            }
        }
        List<Integer> newSizes = request.getSizeIds();
        // ===== Cập nhật size =====
        Set<ProductSize> productSizes = new HashSet<>();
//        Set<Integer> oldSizes = product.getProductSizes().stream().map(productSize -> productSize.getSize().getSizeId()).collect(Collectors.toSet());
        for(Integer sizeId : newSizes){
            Size size = sizeRepository.findById(sizeId).orElseThrow(()-> new AppException(ErrorCodes.SIZE_NOT_FOUND));
            ProductSize productSize = ProductSize.builder()
                    .size(size)
                    .product(product)
                    .build();
            productSizes.add(productSize);
        }
        product.getProductSizes().clear();
        product.getProductSizes().addAll(productSizes);
//        product.setProductSizes(productSizes);
        productRepository.save(product);
        return productMapper.toProductInfoDTO(product);
    }

    @Transactional
    public String deleteProduct(Integer productId){
        if(productId==null){
            throw new AppException(ErrorCodes.PRODUCT_NOT_FOUND);
        }
        Product product = productRepository.findByProductId(productId).orElseThrow(()-> new AppException(ErrorCodes.PRODUCT_NOT_FOUND));
        for(Image image : product.getImages()){
            Path imagePath = Paths.get(URL_UPLOAD, image.getImage() + ".png");
            System.out.println("delete "+imagePath.toString());
            deletePhysicalFiles(imagePath.toString());
        }

        productRepository.delete(product);
        return "delete product successfully";
    }
}
