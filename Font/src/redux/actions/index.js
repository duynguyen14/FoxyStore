import Type from "../types"

const showLoading=()=>{
    return{
        type: Type.loading.show,
        payload :true
    }
}
const hideLoading=()=>{
    return{
        type: Type.loading.hide,
        payload :false
    }
}
const addProductToCart=(product)=>{
    return{
        type: Type.cart.addProductToCart,
        payload: product
        
    }
}
const getProductFromCart=(products)=>{
    return{
        type: Type.cart.getProductInCart,
        payload: products
    }
}
const updateProductFromCart=(productSizeId, quantity)=>{
    return{
        type :Type.cart.updateProductInCart,
        payload :{productSizeId, quantity}
    }
}
const removeProductFromCart=(productSizeId)=>{
    return{
        type :Type.cart.removeProductInCart,
        payload :productSizeId
    }
}
const order=()=>{
    return{
        type : Type.cart.order,
    }
}
export {showLoading, hideLoading,addProductToCart,getProductFromCart,updateProductFromCart,removeProductFromCart,order}