import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Form } from 'react-bootstrap';
import UserRegisterPageStyle from '../styles/UserRegisterPageStyle.module.css';
import EmptyMenuBar from '../components/EmptyMenuBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Button from '@mui/material/Button';
import { CheckCircle } from "lucide-react";
import toast from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress';
import { storage } from "../Config/FireBaseConfig.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { auth, provider } from '../Config/FireBaseConfig.js';
import { signInWithPopup } from 'firebase/auth';

const UserRegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        dob: '',
        gender: '',
        weight: '',
        height: '',
        password: '',
        cpassword: ''
    });
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const navigate = useNavigate();

    const requiredFields = ['firstName', 'lastName', 'userName', 'email', 'dob', 'gender', 'password', 'cpassword'];

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) error = 'This field is required';
                else if (/\d/.test(value)) error = 'Cannot contain numbers';
                break;
            case 'userName':
                if (!value.trim()) error = 'Username is required';
                break;
            case 'email':
                if (!value.trim()) error = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
                break;
            case 'password':
                if (!value.trim()) error = 'Password is required';
                else if (value.length < 6) error = 'Password must be at least 6 characters';
                if (formData.cpassword && value !== formData.cpassword) {
                    setErrors(prev => ({ ...prev, cpassword: 'Passwords do not match' }));
                }
                break;
            case 'cpassword':
                if (!value.trim()) error = 'Confirm password is required';
                else if (value !== formData.password) error = 'Passwords do not match';
                break;
            case 'weight':
            case 'height':
                if (value && value < 0) error = 'Must be a positive number';
                else if (!value) error = 'field is required';
                break;
            case 'dob':
                if (!value) error = 'Date of birth is required';
                break;
            case 'gender':
                if (!value) error = 'Gender is required';
                break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    useEffect(() => {
        const allFieldsFilled = requiredFields.every(field => formData[field].toString().trim() !== '');
        const noErrors = Object.values(errors).every(error => error === '');
        setFormValid(allFieldsFilled && noErrors);
    }, [formData, errors]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const uploadProfileImage = async () => {
        if (!image) return null;
        const imageRef = ref(storage, `profileImages/${image.name + v4()}`);
        await uploadBytes(imageRef, image);
        return await getDownloadURL(imageRef);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const profileImageURL = await uploadProfileImage();

            const userData = {
                ...formData,
                profilePicURL: profileImageURL || '',
                userType: "User"
            };

            const response = await axios.post('http://localhost:8080/api/users/register', userData);
            toast.success("Registration successful!");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const response = await axios.post('http://localhost:8080/api/users/googleSignUp', {
                name: user.displayName,
                userName: user.email,
                email: user.email,
                profileImageUrl: user.photoURL
            })

            localStorage.setItem("UserInfo", JSON.stringify(response.data))
            navigate("/")
            toast.success("Google signup successful!")
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
         <div className={UserRegisterPageStyle.bodyDiv}>
            <EmptyMenuBar />
            <Container>
                <Row className={UserRegisterPageStyle.rowDiv}>
                    <Col md={6} className={UserRegisterPageStyle.leftDiv}>
                        <div className={UserRegisterPageStyle.contentWrapper}>
                            <h1 className={UserRegisterPageStyle.welcomeText}>Join BioFit</h1>
                            <p className={UserRegisterPageStyle.tagline}>
                                Start your fitness journey with our community
                            </p>
                            <ul className={UserRegisterPageStyle.featureList}>
                                {[
                                    "Track your progress",
                                    "Connect with experts",
                                    "Personalized plans",
                                    "Join challenges"
                                ].map((feature, index) => (
                                    <li key={index} className={UserRegisterPageStyle.featureItem}>
                                        <CheckCircle size={24} color="#4CAF50" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>

                     <Col md={6} className={UserRegisterPageStyle.rightDiv}>
                        <h2 className={UserRegisterPageStyle.formTitle}>Create Account</h2>

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={8}>
                                    <Row>
                                         <Col md={6}>
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="First Name"
                                                className={UserRegisterPageStyle.inputField}
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                            {errors.firstName && (
                                                <div className={UserRegisterPageStyle.errorText}>
                                                    {errors.firstName}
                                                </div>
                                            )}
                                        </Col>
                                        <Col md={6}>
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Last Name"
                                                className={UserRegisterPageStyle.inputField}
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                            {errors.lastName && (
                                                <div className={UserRegisterPageStyle.errorText}>
                                                    {errors.lastName}
                                                </div>
                                            )}
                                        </Col>
                                    </Row>

                                    <input
                                        type="text"
                                        name="userName"
                                        placeholder="Username"
                                        className={UserRegisterPageStyle.inputField}
                                        value={formData.userName}
                                        onChange={handleChange}
                                    />
                                    {errors.userName && (
                                        <div className={UserRegisterPageStyle.errorText}>
                                            {errors.userName}
                                        </div>
                                    )}


                                     <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        className={UserRegisterPageStyle.inputField}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <div className={UserRegisterPageStyle.errorText}>
                                            {errors.email}
                                        </div>
                                    )}
                                </Col>
                                

                                <Col md={4} className={UserRegisterPageStyle.avatarUpload}>
                                    <label htmlFor="imageInput">
                                        <img
                                            src={imagePreview || '/src/assets/images/user-avatars.png'}
                                            alt="Profile Preview"
                                            className={UserRegisterPageStyle.avatarPreview}
                                        />
                                    </label>
                                    <input
                                        id="imageInput"
                                        type="file"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                </Col>
                            </Row>

                            <Row>
                                 <Col md={6}>
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        className={UserRegisterPageStyle.inputField}
                                        value={formData.dob}
                                        onChange={handleChange}
                                        max={getCurrentDate()}
                                        style={{ color: '#666' }}
                                    />
                                    {errors.dob && (
                                        <div className={UserRegisterPageStyle.errorText}>
                                            {errors.dob}
                                        </div>
                                    )}
                                </Col>
                                <Col md={6}>
                                    <div className={UserRegisterPageStyle.radioGroup}>
                                        <label>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={formData.gender === 'male'}
                                                onChange={handleChange}
                                            /> Male
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={formData.gender === 'female'}
                                                onChange={handleChange}
                                            /> Female
                                        </label>
                                    </div>
                                    {errors.gender && (
                                        <div className={UserRegisterPageStyle.errorText}>
                                            {errors.gender}
                                        </div>
                                    )}
                                </Col>
                            </Row>

                            <Row>
                                 <Col md={5}>
                                    <div className={UserRegisterPageStyle.inputGroup}>
                                        <input
                                            type="number"
                                            name="weight"
                                            placeholder="Weight"
                                            className={UserRegisterPageStyle.inputField}
                                            value={formData.weight}
                                            onChange={handleChange}
                                            min="0"
                                        />
                                        <span className={UserRegisterPageStyle.unitLabel}>kg</span>
                                    </div>
                                    {errors.weight && (
                                        <div className={UserRegisterPageStyle.errorText}>
                                            {errors.weight}
                                        </div>
                                    )}
                                </Col>
                                 <Col md={5}>
                                    <div className={UserRegisterPageStyle.inputGroup}>
                                        <input
                                            type="number"
                                            name="height"
                                            placeholder="Height"
                                            className={UserRegisterPageStyle.inputField}
                                            value={formData.height}
                                            onChange={handleChange}
                                            min="0"
                                        />
                                        <span className={UserRegisterPageStyle.unitLabel}>cm</span>
                                    </div>
                                    {errors.height && (
                                        <div className={UserRegisterPageStyle.errorText}>
                                            {errors.height}
                                        </div>
                                    )}
                                </Col>
                            </Row>

                            <Row>
                               <Col md={5}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Password"
                                        className={UserRegisterPageStyle.inputField}
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <div className={UserRegisterPageStyle.errorText}>
                                            {errors.password}
                                        </div>
                                    )}
                                </Col>
                                <Col md={5}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="cpassword"
                                        placeholder="Confirm Password"
                                        className={UserRegisterPageStyle.inputField}
                                        value={formData.cpassword}
                                        onChange={handleChange}
                                    />
                                    {errors.cpassword && (
                                        <div className={UserRegisterPageStyle.errorText}>
                                            {errors.cpassword}
                                        </div>
                                    )}
                                </Col>
                                <Col md={2} className="absolute transform -translate-y-1/2">
                                    <motion.span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="cursor-pointer text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                        animate={{ scale: showPassword ? 1.2 : 1, opacity: showPassword ? 1 : 0.8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        <span className="text-sm" style={{ cursor: 'pointer' }}>{showPassword ? " Hide" : " Show"}</span>
                                    </motion.span>
                                </Col>
                            </Row>


                            <Button
                                type="submit"
                                className={UserRegisterPageStyle.submitButton}
                                disabled={!formValid || isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                            </Button>

                            <div className="text-center mt-3">
                                <span>Already have an account? </span>
                                <a href="/login" className={UserRegisterPageStyle.linkText}>
                                    Sign In
                                </a>
                            </div>

                            <div className={UserRegisterPageStyle.divider}>
                                Or continue with
                            </div>

                            <Button
                                className={UserRegisterPageStyle.googleButton}
                                fullWidth
                                onClick={handleGoogleSignUp}startIcon={<img src="/src/assets/images/googleLogo.png"
                                    alt="Google"
                                    width="20" />}
                            >
                                Sign up with Google
                            </Button>

                           
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserRegisterPage