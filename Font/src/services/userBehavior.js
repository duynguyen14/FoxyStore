import { getOrCreateSessionId } from '../untils/session.js';
async function logBehavior(request,action, productId) {
    const key ="behavior_last_time";
    const value = JSON.parse(localStorage.getItem(key));
    if(value && value.productId==productId && Number(Date.now())- value.lasttime < 1000 * 60 * 3){
        return;
    }
    else{
        const token = localStorage.getItem("token");
        const newValue ={
            productId: productId,
            lasttime: Date.now().toString(),
        }
        localStorage.setItem(key, JSON.stringify(newValue));
        if (token) {
            try {
                const response = await request.post("behavior/create", {
                    action,
                    productId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data;
            } catch (error) {
                console.error("Error logging user behavior:", error);
                throw error;
            }
        }
        else{
            // If no token, create a session ID and log behavior without authentication
            const sessionId = getOrCreateSessionId();
            try {
                const response = await request.post("behavior/create", {
                    action,
                    productId,
                    sessionId,
                },
            );
                return response.data;
            } catch (error) {
                console.error("Error logging user behavior without authentication:", error);
                throw error;
            }

    }
    }
}
export {
    logBehavior
}