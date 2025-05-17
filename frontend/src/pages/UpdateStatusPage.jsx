import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactTyped } from 'react-typed';
import { FaRunning, FaDumbbell, FaArrowUp, FaCommentDots } from 'react-icons/fa';
import NavBar from '../components/NavBar';
import SideUserPanel from '../components/SideUserPanel';
import SideNotoficationPanel from '../components/SideNotoficationPanel';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 }
  }
};

const formStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.97)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
  padding: '2rem',
  margin: '2rem auto',
  maxWidth: '600px',
  backdropFilter: 'blur(10px)'
};

const inputStyle = {
  border: '2px solid #e0f0ff',
  borderRadius: '10px',
  padding: '12px 20px',
  transition: 'all 0.3s ease',
  width: '100%'
};

const labelStyle = {
  color: '#2a4e6c',
  fontWeight: '600',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const UpdateStatus = () => {
  const { id } = useParams();
  const [user, setUser] = useState('');
  const [description, setDescription] = useState('');
  const [distanceRan, setDistanceRan] = useState('');
  const [pushups, setPushups] = useState('');
  const [benchPress, setBenchPress] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/user/StatusTest/${id}`);
        const data = res.data;
        setUser(data.user);
        setDescription(data.description);
        setDistanceRan(data.distanceRan);
        setPushups(data.pushups);
        setBenchPress(data.benchPress);
        setComments(data.comments?.[0] || '');
      } catch (err) {
        console.error('Fetch error: ', err);
      }
    };
    fetchStatus();
  }, [id]);

  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`http://localhost:8080/api/user/StatusTest/${id}`, {
      user: user,
      description: description,
      distanceRan: parseFloat(distanceRan),
      pushups: parseInt(pushups),
      benchPress: parseFloat(benchPress),
      comments: [comments] // Wrap in array to match backend model
    });
    alert('Status updated successfully!');
    window.location.href = "/myprofile";
  } catch (error) {
    console.error('Error updating status: ', error);
    alert(`Error updating status: ${error.response?.data?.message || error.message}`);
  }
};

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/user/StatusTest/${id}`);
      alert('Status deleted successfully!');

      // Reset form fields after successful submission
      setUser('');
      setDescription('');
      setDistanceRan('');
      setPushups('');
      setBenchPress('');
      setComments('');

      // window.location.href='#./StatusAllSingleUser'
      history.push('/StatusAllSingleUser');
      window.location.href = "/myprofile";
    } catch (error) {
      console.error('Error deleting status: ', error);
      window.location.href = "/myprofile";
      //alert('Error deleting status!');
    }
  };

  return (
    <Box sx={{ background: 'rgba(111, 204, 250, 0.6)', minHeight: '100vh' }}>
      <NavBar />
      <Grid container sx={{ pt: 8 }}>
        <Grid item xs={3}>
          <SideUserPanel />
        </Grid>

        <Grid item xs={6}>
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.h1
              variants={itemVariants}
              style={{
                textAlign: 'center',
                padding: '2rem 0 1rem',
                color: '#2a4e6c',
                fontWeight: '700',
                fontSize: '2.5rem'
              }}
            >
              <ReactTyped strings={['Update Your Workout ']} typeSpeed={50} showCursor={false} />
            </motion.h1>

            <motion.div variants={containerVariants} style={formStyle}>
              <form onSubmit={handleUpdate}>
                {/* User - ReadOnly */}
                <motion.div variants={itemVariants} className="mb-4">
                  <label style={labelStyle}>
                    👤 User
                  </label>
                  <input style={inputStyle} type="text" value={user} readOnly />
                </motion.div>

                {/* Description */}
                <motion.div variants={itemVariants} className="mb-4">
                  <label style={labelStyle}><FaCommentDots /> Workout Summary</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '100px' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </motion.div>

                {/* Distance */}
                <motion.div variants={itemVariants} className="mb-4">
                  <label style={labelStyle}><FaRunning /> Distance Ran (KM)</label>
                  <input
                    type="number"
                    step="0.01"
                    style={inputStyle}
                    value={distanceRan}
                    onChange={(e) => setDistanceRan(e.target.value)}
                    required
                  />
                </motion.div>

                {/* Pushups */}
                <motion.div variants={itemVariants} className="mb-4">
                  <label style={labelStyle}><FaArrowUp /> Pushups</label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={pushups}
                    onChange={(e) => setPushups(e.target.value)}
                    required
                  />
                </motion.div>

                {/* Bench Press */}
                <motion.div variants={itemVariants} className="mb-4">
                  <label style={labelStyle}><FaDumbbell /> Bench Press (KG)</label>
                  <input
                    type="number"
                    step="0.01"
                    style={inputStyle}
                    value={benchPress}
                    onChange={(e) => setBenchPress(e.target.value)}
                    required
                  />
                </motion.div>

                {/* Comments */}
                <motion.div variants={itemVariants} className="mb-4">
                  <label style={labelStyle}><FaCommentDots /> Work to be done</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                  />
                </motion.div>

                {/* Buttons */}
                <motion.div variants={itemVariants}>
                  <button className="btn btn-primary w-100 mb-2" type="submit">Update</button>
                  <button className="btn btn-danger w-100" type="button" onClick={handleDelete}>Delete</button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </Grid>

        <Grid item xs={3}>
          <SideNotoficationPanel />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateStatus;
