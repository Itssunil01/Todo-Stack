import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const signupSuccess = (msg) => {
    toast.success(msg , {
        position: "top-right"
    })
}

export const signupError = (msg) => {
    toast.error(msg , {
        position: "top-right"
    })
}

export const loginSuccess = (msg) => {
    toast.success(msg , {
        position: "top-right"
    })
}

export const loginError = (msg) => {
    toast.error(msg , {
        position: "top-right"
    })
}