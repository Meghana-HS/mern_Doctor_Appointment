import React from "react";
import "../css/about.css";

const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <p>
                       Excellence in Healthcare and Compassionate Care
        CDSIMER Hospital, located in Harohalli, Karnataka, is a leading healthcare institution renowned for delivering exceptional medical services. With advanced facilities and a team of highly experienced professionals, the hospital is committed to providing personalized, patient-focused care. At CDSIMER, we combine cutting-edge technology with compassionate treatment to ensure the best possible outcomes for every patient. Our mission is to foster healthier communities through excellence, innovation, and dedication to well-being.
          </p>
        </div>
        <div className="banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero;
