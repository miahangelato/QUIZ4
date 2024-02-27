import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_VERIFY_REQUEST,
    USER_VERIFY_SUCCESS,
    USER_VERIFY_FAIL,
    USER_RESEND_OTP_REQUEST,
    USER_RESEND_OTP_SUCCESS,
    USER_RESEND_OTP_FAIL,
    USER_SEND_CHANGE_PASSWORD_REQUEST,
    USER_SEND_CHANGE_PASSWORD_SUCCESS,
    USER_SEND_CHANGE_PASSWORD_FAIL,
    USER_CONFIRM_CHANGE_PASSWORD_REQUEST,
    USER_CONFIRM_CHANGE_PASSWORD_SUCCESS,
    USER_CONFIRM_CHANGE_PASSWORD_FAIL,
    USER_CONFIRM_CHANGE_PASSWORD_RESET,
    USER_UPDATE_PASSWORD_REQUEST,
    USER_UPDATE_PASSWORD_SUCCESS,
    USER_UPDATE_PASSWORD_FAIL,

  } from "../constants/userConstants";
  
  export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_LOGIN_REQUEST:
        return { loading: true };
      case USER_LOGIN_SUCCESS:
        return { loading: false, userInfo: action.payload };
      case USER_LOGIN_FAIL:
        return { loading: false, error: action.payload };
      case USER_LOGOUT:
        return {};
      default:
        return state;
    }
  };
  
  export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_REGISTER_REQUEST:
        return { loading: true };
      case USER_REGISTER_SUCCESS:
        return { loading: false, userInfo: action.payload };
      case USER_REGISTER_FAIL:
        return { loading: false, error: action.payload };
      case USER_LOGOUT:
        return {};
      default:
        return state;
    }
  };

  export const userVerifyReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_VERIFY_REQUEST:
        return { loading: true };
      case USER_VERIFY_SUCCESS:
        return { loading: false, userInfo: action.payload };
      case USER_VERIFY_FAIL:
        return { loading: false, error: action.payload };
      case USER_LOGOUT:
        return {};
      default:
        return state;
    }
  }

export const userResendOtpReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_RESEND_OTP_REQUEST:
      return { loading: true };
    case USER_RESEND_OTP_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_RESEND_OTP_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
}

export const userSendChangePasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SEND_CHANGE_PASSWORD_REQUEST:
      return { loading: true };
    case USER_SEND_CHANGE_PASSWORD_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_SEND_CHANGE_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
}

export const userConfirmChangePasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CONFIRM_CHANGE_PASSWORD_REQUEST:
      return { loading: true };
    case USER_CONFIRM_CHANGE_PASSWORD_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_CONFIRM_CHANGE_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    case USER_CONFIRM_CHANGE_PASSWORD_RESET:
      return {};
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
}

export const userUpdatePasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PASSWORD_REQUEST:
      return { loading: true };
    case USER_UPDATE_PASSWORD_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_UPDATE_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
}