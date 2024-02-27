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
    USER_UPDATE_PASSWORD_REQUEST,
    USER_UPDATE_PASSWORD_SUCCESS,
    USER_UPDATE_PASSWORD_FAIL,
  } from "../constants/userConstants";
  import axios from "axios";
  
  export const login = (email, password) => async (dispatch) => {
    try {
      dispatch({
        type: USER_LOGIN_REQUEST,
      });
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      const { data } = await axios.post(
        "/api/login/",
        { username: email, password: password },
        config
      );
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });
  
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const logout = () => async (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
  };
  
  export const register = (username, email, password) => async (dispatch) => {
    try {
      dispatch({
        type: USER_REGISTER_REQUEST,
      });
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      const { data } = await axios.post(
        "/api/register/",
        { username, email, password },
        config
      );
  
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data, // Dispatch the received data
      });
  
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

  export const verify = (user_id, otp_id, otp_code) => async (dispatch) => {
    try {
      dispatch({
        type: USER_VERIFY_REQUEST,
      });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      const { data } = await axios.post("/api/verify/", { user_id, otp_id, otp_code }, config);
  
      dispatch({
        type: USER_VERIFY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_VERIFY_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

  export const resendOtp = (user_id, otp_id) => async (dispatch) => {
    try {
      dispatch({
        type: USER_RESEND_OTP_REQUEST,
      });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      const { data } = await axios.post("/api/resend_otp/", { user_id, otp_id }, config);
  
      dispatch({
        type: USER_RESEND_OTP_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_RESEND_OTP_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const userChangePasswordEmail = (email) => async (dispatch) => {
  try {
    dispatch({
      type: USER_SEND_CHANGE_PASSWORD_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/send-reset-password-email/", { email }, config);

    dispatch({
      type: USER_SEND_CHANGE_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_SEND_CHANGE_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}

export const userConfirmChangePassword = (password, password2, uid, token) => async (dispatch) => {
  try {
    dispatch({
      type: USER_CONFIRM_CHANGE_PASSWORD_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(`/api/reset-password/${uid}/${token}/`, { password, password2 }, config); // Concatenate uid and token in the URL

    dispatch({
      type: USER_CONFIRM_CHANGE_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_CONFIRM_CHANGE_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const userUpdatePassword = (oldPassword, newPassword, newPassword2) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PASSWORD_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      "/api/change-password/",
      { old_password: oldPassword, password: newPassword, password2: newPassword2 },
      config
    );

    dispatch({
      type: USER_UPDATE_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};