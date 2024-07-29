import { App_uri } from '../../config';

export const APP_LAST_URI = Object.freeze({

    userLogin: {
        path: App_uri.BASE_URI + "v1/users/login",
        isAuth: false,
        isPicLocation: false,
        isEncrypt: false,
        method: "POST"
    },

    verifyToken: {
        path: App_uri.BASE_URI + "v1/participant/verifyToken",
        isAuth: false,
        isPicLocation: false,
        isEncrypt: false,
        method: "POST"
    },

    

})