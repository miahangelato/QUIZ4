import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {userChangePasswordEmail } from '../actions/userActions';

const SendPasswordChangeRequestScreen = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const userSendChangePassword = useSelector((state) => state.userSendChangePassword);
  const { loading, error } = userSendChangePassword;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(userChangePasswordEmail(email));
  };

  return (
    <div>
      <h2>Send Password Change Request</h2>
      {error && <div>{error}</div>}
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
};

export default SendPasswordChangeRequestScreen;
