import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function OAuthRedirect() {
    const navigate = useNavigate();
    const handled = useRef(false);

    useEffect(() => {
        if (handled.current) return;
        handled.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        console.log("Query string:", window.location.search);
        console.log("Parsed token:", token);

        if (token) {
            localStorage.setItem("token", token);

            // ✅ Clean the URL after saving token
            window.history.replaceState({}, document.title, window.location.pathname);

            navigate("/",{ state: { successLogin: true } });
        } else {
            alert("Không nhận được token từ backend!");
            navigate("/login");
        }
    }, [navigate]);

    return <div>Đang xử lý đăng nhập Google...</div>;
}

export default OAuthRedirect;
