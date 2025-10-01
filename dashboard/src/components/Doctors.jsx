import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import API_BASE from "../config";
import { FaTrash } from "react-icons/fa";  // 🔥 Import trash icon

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/user/doctors`, {
        withCredentials: true,
      });
      setDoctors(data.doctors);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const { data } = await axios.delete(`${API_BASE}/user/doctor/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete doctor");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>
      <div className="banner">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => {
            return (
              <div className="card" key={element._id}>
                <img
                  src={element.docAvatar && element.docAvatar.url}
                  alt="doctor avatar"
                />
                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                <div className="details">
                  <p>Email: <span>{element.email}</span></p>
                  <p>Phone: <span>{element.phone}</span></p>
                  <p>DOB: <span>{element.dob.substring(0, 10)}</span></p>
                  <p>Department: <span>{element.doctorDepartment}</span></p>
                  <p>NIC: <span>{element.nic}</span></p>
                  <p>Gender: <span>{element.gender}</span></p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(element._id)}
                  title="Delete Doctor"
                >
                  <FaTrash />
                </button>
              </div>
            );
          })
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Doctors;
