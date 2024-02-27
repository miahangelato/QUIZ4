import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import { userLoginReducer, userRegisterReducer, userVerifyReducer, userResendOtpReducer
, userSendChangePasswordReducer, userConfirmChangePasswordReducer, userUpdatePasswordReducer} from './reducers/userReducers';


const reducer = combineReducers({
    // Add your reducers here
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userVerify: userVerifyReducer,
    userResendOtp: userResendOtpReducer,
    userSendChangePassword: userSendChangePasswordReducer,
    userConfirmChangePassword: userConfirmChangePasswordReducer,
    userUpdatePassword: userUpdatePasswordReducer
});


const userInfoFromStorage = localStorage.getItem('userInfo') ? 
    JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    // Add your initial states here
    userLogin: { userInfo: userInfoFromStorage },
    userRegister: { userInfo: userInfoFromStorage },
    userVerify: userVerifyReducer
};


const store = configureStore({
    reducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});


export default store;
