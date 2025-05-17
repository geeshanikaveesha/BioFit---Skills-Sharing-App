// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/AllStatusSingleCardStyle.module.css";
import { Link } from 'react-router-dom';
import { ReactTyped } from 'react-typed';


const StatusAllSingleUserCard = () => {

  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);

  const [data, setData] = useState([]);
  const username = storedUserInfo.userName;                   //Fetching User User Name
  const profilePic = storedUserInfo.profilePicURL;             //Fetching User Profile Picture
  console.log(username)

  useEffect(() => {
    const fetchData = async () => {
      try {


        const response = await axios.get(`http://localhost:8080/api/user/StatusTest/user/${username}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (createdAt) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return new Date(createdAt).toLocaleString(undefined, options);
  };

  return (
    <div className="container">
      <h2 style={{ paddingTop: '20px' }}><center><ReactTyped className="fw-bolder" strings={['My Status Line !']} typeSpeed={100} backSpeed={50} loop /></center></h2>
      <div className="row">
        {data.map((item) => (
          <div key={item.id} className="col-md-4 mb-4 mt-2">
            <div className="card shadow border-0 rounded-4 p-4" style={{ minHeight: "250px", background: "#f9f9fb" }}>
              <div className="d-flex align-items-center p-3">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="rounded-circle me-3"
                  style={{ width: "70px", height: "70px", objectFit: "cover", border: "3px solid rgba(2, 137, 255, 0.81)" }}
                />
                <div>
                  <h6 className="mb-1 fw-bold">{item.user}</h6>
                </div>
              </div>

              <div className="mt-3">
                <p className="mb-1"><strong>Highlight:</strong></p>
                <p className="text-muted small">✦ {item.description}</p>
                <div className="d-flex flex-wrap small">
                  <div className="me-3"><strong>🏃 Best Run:</strong> {item.distanceRan} KM</div>
                  <div className="me-3"><strong>💪 Push-ups:</strong> {item.pushups}</div>
                  <div className="me-3"><strong>🏋️ Bench:</strong> {item.benchPress} KG</div>
                </div>
                <p className="mt-2 small"><strong>📌 To Do:</strong> {item.comments}</p>
              </div>

              <Link
                to={`/UpdateStatusPage/${item.id}`}
                className="btn btn-outline-danger btn-sm w-100 mt-2"
                style={{ borderRadius: "10px", fontWeight: "bold" }}
              >
                Edit My Status
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StatusAllSingleUserCard;
