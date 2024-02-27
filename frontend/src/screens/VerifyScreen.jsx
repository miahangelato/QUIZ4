import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verify, resendOtp } from "../actions/userActions";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const VerifyScreen = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userVerify = useSelector((state) => state.userVerify);
  const { loading: verifyLoading, error } = userVerify;

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo } = userRegister;

  const resendOtpState = useSelector((state) => state.userResendOtp);
  const { loading: resendLoading } = resendOtpState;

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("Submitting OTP:", otp);
    console.log("User Info:", userInfo);
    if (userInfo && userInfo.user_id && userInfo.otp_id) {
      console.log("Dispatching Verify Action...");
      try {
        setIsLoading(true); // Set loading state to true
        const response = await dispatch(verify(userInfo.user_id, userInfo.otp_id, otp));
        console.log("Verification successful");
        if (response && response.status === 200 || error === "undefined") {
          // Navigate only if verification is successful
          navigate("/login");
        }
      } catch (error) {
        console.error("Verification failed:", error);
        if (error.response && error.response.status === 400) {
          // Handle bad request error
          console.log("Bad request: verification failed");
          // Show error message to user
        } else {
          // Handle other errors
        }
      } finally {
        setIsLoading(false); // Set loading state to false after verification completes
      }
    } else {
      console.log("User info is not available.");
      // Handle error appropriately
    }
  };

  const handleResendOtp = () => {
    dispatch(resendOtp(userInfo.user_id, userInfo.otp_id));
  };

  console.log("User Info:", userInfo);
  console.log("Error:", error);

  return (
    <div>
      <h2>Verification</h2>
      {isLoading || verifyLoading || resendLoading ? ( // Show loader if isLoading, verifyLoading, or resendLoading is true
        <Loader />
      ) : (
        <>
          {error && <Message severity="error">{error}</Message>}
          <form onSubmit={submitHandler}>
            <label htmlFor="otp">Enter OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit" disabled={verifyLoading}>
              Verify
            </button>
          </form>
          <button onClick={handleResendOtp} disabled={resendLoading}>
            Resend OTP
          </button>
        </>
      )}
    </div>
  );
};

export default VerifyScreen;
