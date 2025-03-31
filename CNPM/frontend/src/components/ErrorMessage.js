import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <span role="img" aria-label="error">⚠️</span> {message}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage; 