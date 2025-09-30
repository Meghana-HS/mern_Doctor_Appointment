import React from "react";
import "../css/about.css";
import hospitalImage from "./assets/image.png";

const Biography = () => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={hospitalImage} alt="hospital" />
        </div>
        <div className="banner text-section">
          <p className="subtitle"><b>BIOGRAPHY</b></p>
          {/* <h3 className="title">CDSIMER Hospital</h3> */}

          <p>
                   CDSIMER Hospital, located in Harohalli, Karnataka, is a premier
            medical institution dedicated to providing exceptional healthcare
            services. With state-of-the-art facilities, experienced doctors, and
            modern technology, the hospital strives to deliver comprehensive and
            affordable healthcare to patients across the region.
          </p><p>
            The hospital is part of the Dayananda Sagar Institutions group,
            known for its excellence in education and healthcare. It aims to
            serve society by combining compassionate care with clinical
            expertise.
          </p><p>
            At CDSIMER Hospital, we focus on patient-centered treatment,
            advanced medical research, and continuous innovation in healthcare
            practices. 
          </p>
         
        </div>
      </div>
    </>
  );
};

export default Biography;
