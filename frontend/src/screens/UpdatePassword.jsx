import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userUpdatePassword } from '../actions/userActions';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await dispatch(userUpdatePassword(oldPassword, password, password2));
      setSuccessMessage('Password updated successfully');
      setErrorMessage('');
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  return (
    <div>
      <h2>Update Password</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            placeholder="Enter your old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            placeholder="Confirm your new password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default UpdatePassword;
