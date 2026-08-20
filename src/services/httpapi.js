import axios from "axios";
import router from "../router";
import store from "../store";

const csrfToken = document.head.querySelector('meta[name="csrf-token"]');

const http_axios = axios.create({
    baseURL: (process.env.VITE_BASE_URL || "/") + "api/",
    headers: {
        "X-CSRF-TOKEN": csrfToken ? csrfToken.content : '',
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

http_axios.interceptors.request.use((request) => {
    if (store.state.token) {
        request.headers.Authorization = "Bearer " + store.state.token;
    }

    return request;
});

http_axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
            //window.location.href = "/";
            router.push("/home/game");
        }
        return Promise.reject(error);
    }
);

export default http_axios;
