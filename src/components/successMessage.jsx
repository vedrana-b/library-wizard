import React from "react";
import successLogo from "../assets/success.svg";

const SuccessMessage = ({ onRestart }) => {
  return (
    <div className="success-page">
      <img className="success-page__logo" src={successLogo}></img>
      <div className="success-page__text">
        <p>Book added successfully</p>
      </div>
      <div className="success-page__btn">
        <button
          onClick={onRestart}
          className="button button__success button__control--next"
        >
          Add another book
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
