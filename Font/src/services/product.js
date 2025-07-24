import { request } from "../untils/request.js";
async function getProductForYou() {
    const token = localStorage.getItem("token");
    try {
        if (token !== null) {
            // If token exists, fetch products with authentication
            const response = await request.get("product/recommend", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data.result;
        }
        else {
            const sessionId = localStorage.getItem("session_id");
            const response = await request.get(`product/recommend?sessionId=${sessionId}`);
            return response.data.result;
        }
    }
    catch (error) {
        console.error("Error fetching products for you:", error);
        throw error;
    }
}
export {
    getProductForYou
}