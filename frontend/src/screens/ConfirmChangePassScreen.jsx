import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userConfirmChangePassword } from '../actions/userActions';
import { useParams } from 'react-router-dom';

const ConfirmPasswordChangeScreen = () => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useDispatch();
  const { uid, token } = useParams(); // Retrieve uid and token from URL params

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await dispatch(userConfirmChangePassword(password, password2, uid, token)); // Pass uid and token to action creator
      setSuccessMessage('Password changed successfully'); // Set the success message upon successful password change
    } catch (error) {
      // Handle error here, if necessary
    }
  };

  return (
    <div>
      <h2>Confirm Password Change</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}
      <form onSubmit={submitHandler}>
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
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
};

export default ConfirmPasswordChangeScreen;
