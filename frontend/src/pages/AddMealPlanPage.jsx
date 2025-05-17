import React from 'react';
import { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'; import {
  Button,

  Grid,
  Typography,
  CardContent




} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Form } from 'react-bootstrap';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AddMealPlanPageStyle from '../styles/AddMealPlanPageStyle.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { storage } from '../Config/FireBaseConfig.js';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { v4 } from 'uuid';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import SideUserPanel from '../components/SideUserPanel';
import SideNotoficationPanel from '../components/SideNotoficationPanel';
import NavBar from '../components/NavBar.jsx';
import { Loader } from 'lucide-react';

const AddMealPlanPage = () => {
  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);

  const [userName, setUserName] = useState('Janul');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const [mealCards, setMealCards] = useState([
    {
      name: '',
      ingredients: [],
      instructions: '',
      size: '',
      nutritious: [],
    },
  ]);

  useEffect(() => {
    // Initially, display one card
    setMealCards([
      {
        name: '',
        ingredients: [],
        instructions: '',
        size: '',
        nutritious: [],
      },
    ]);
  }, []);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    event.preventDefault();
    const selectedImage = event.target.files[0];

    setImage(selectedImage);
    console.log('Image:', image);

    // Preview the selected image
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(selectedImage);
  };
  const handleImageClick = () => {
    document.getElementById('imageInput').click();
  };

  const uploadMealImage = async () => {
    console.log('Image:', image);
    return new Promise((resolve, reject) => {
      if (image == null) {
        resolve(null); // Resolve with null if no image is provided
      } else {
        const MealplanImageRef = ref(
          storage,
          `${userName}/mealImages/${image.name + v4()}`
        );

        uploadBytes(MealplanImageRef, image)
          .then(() => {
            getDownloadURL(MealplanImageRef)
              .then((downloadURL) => {
                console.log('Download URL:', downloadURL);
                alert('Image uploaded. Download URL: ' + downloadURL);
                resolve(downloadURL);
              })
              .catch((error) => {
                // Error getting download URL
                reject(error);
              });
          })
          .catch((error) => {
            // Error uploading image
            reject(error);
          });
      }
    });
  };

  const handleInputChange = (e, field, index) => {
    const { value } = e.target;
    setMealCards((prevCards) => {
      const updatedCards = [...prevCards];

      if (field === 'ingredients' || field === 'nutritious') {
        // Split comma-separated values into an array
        updatedCards[index][field] = value.split(',');
      } else {
        updatedCards[index][field] = value;
      }
      return updatedCards;
    });
  };

  const handleAddMealCard = (e) => {
    e.preventDefault();
    setMealCards((prevCards) => [
      ...prevCards,
      {
        name: '',
        ingredients: [],
        instructions: '',
        size: '',
        nutritious: [],
      },
    ]);
  };

  const handleRemoveMealCard = (index, e) => {
    e.preventDefault();
    setMealCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards.splice(index, 1);
      return updatedCards;
    });
  };

  const submitHandler = async () => {
    const mealPlanImgDownURL = await uploadMealImage();

  

    const newmealPlanData = {
      userId: storedUserInfo.id,
      title,
      category,
      meals: mealCards,
      mealsPicURL: mealPlanImgDownURL,
    };

    console.log(newmealPlanData);
    axios
      .post('http://localhost:8080/api/user/mealplan', newmealPlanData)
      .then((response) => {
        console.log('Form submitted successfully!' + response);
        toast.success('Successfully MealPlan Added!');
        navigate('/myprofile');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (

    <Box sx={{
      background: 'rgba(111, 204, 250, 0.6)',
      minHeight: '100vh'
    }}>
      <NavBar />

      <Grid container sx={{ pt: 8 }}>
        <Grid item xs={3}>
          <SideUserPanel />
        </Grid>

        <Grid item xs={6}>
          <div className={AddMealPlanPageStyle.bodyDiv}>
            <Card className={AddMealPlanPageStyle.headerCard}>
              <h1 className={AddMealPlanPageStyle.header}>Add Meal Plans</h1>
            </Card>

            <div className={AddMealPlanPageStyle.formContainer}>
              <Row className={AddMealPlanPageStyle.formRow}>
                <Col xs={6} className={AddMealPlanPageStyle.inputGroup}>
                  <TextField
                    fullWidth
                    label="Meal Title"
                    variant="outlined"
                    value={title}
                    required
                    sx={{ mb: 3 }}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      required
                      onChange={(e) => setCategory(e.target.value)}
                      label="Category"
                    >
                      <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                      <MenuItem value="Vegan">Vegan</MenuItem>
                      <MenuItem value="Keto">Keto</MenuItem>
                    </Select>
                  </FormControl>
                </Col>

                <Col className={AddMealPlanPageStyle.imageUploadSection}>
                  <Box
                    sx={{
                      border: '2px dashed #00a6f9',
                      borderRadius: 2,
                      p: 2,
                      textAlign: 'center',
                      '&:hover': { borderColor: '#007bb5' },
                      cursor: 'pointer'  // Add cursor pointer
                    }}
                    onClick={handleImageClick}  // Add click handler here
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className={AddMealPlanPageStyle.imagePreview}
                      />
                    ) : (
                      <div className={AddMealPlanPageStyle.uploadPrompt}>
                        <CloudUploadIcon sx={{ fontSize: 40, color: '#00a6f9' }} />
                        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                          Click to upload meal plan cover image
                        </Typography>
                      </div>
                    )}
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="imageInput"  // Add ID for the input
                    />
                  </Box>
                </Col>
              </Row>

              <Typography variant="h6" sx={{
                color: '#00a6f9',
                py: 2,
                mt: 4,
                borderBottom: '2px solid #00a6f9'
              }}>
                Meal Details
              </Typography>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                {mealCards.map((meal, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Card sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <TextField
                          fullWidth
                          label="Meal Name"
                          variant="outlined"
                          value={meal.name}
                          required
                          sx={{ mb: 2 }}
                          onChange={(e) => handleInputChange(e, 'name', index)}
                        />

                        <TextField
                          fullWidth
                          label="Ingredients (comma separated)"
                          variant="outlined"
                          value={meal.ingredients}
                          required
                          sx={{ mb: 2 }}
                          onChange={(e) => handleInputChange(e, 'ingredients', index)}
                        />

                        <TextField
                          id="standard-multiline-flexible"
                          label="Enter Instructions"
                          multiline
                          maxRows={4}
                          variant="standard"
                          value={meal.instructions}
                          required
                          onChange={(e) =>
                            handleInputChange(e, 'instructions', index)
                          }
                          style={{ width: '100%' }}
                        />

                        <TextField
                          id="standard-basic"
                          label="Enter positon size"
                          variant="standard"
                          value={meal.size}
                          required
                          onChange={(e) => handleInputChange(e, 'size', index)}
                          InputProps={{
                            inputProps: {
                              pattern: '[0-9]+ (mg|kg|l|ml)',
                              title:
                                "Enter necessary measurement (e.g., '100 mg', '200 kg', '5 l', '10 ml')",
                            },
                          }}
                          error={!/^[0-9]+ (mg|kg|l|ml|g)$/.test(meal.size)}
                          helperText={
                            !/^[0-9]+ (mg|kg|l|ml|g)$/.test(meal.size)
                              ? "Enter necessary measurement (e.g., '100 mg', '200 kg', '5 l', '10 ml')"
                              : ''
                          }
                          style={{ width: '100%' }}
                        />
                        <TextField
                          id="standard-basic"
                          label="Enter Nutritious"
                          variant="standard"
                          value={meal.nutritious}
                          required
                          onChange={(e) =>
                            handleInputChange(e, 'nutritious', index)
                          }
                          style={{ width: '100%' }}
                        />
                        <br />
                        <br />

                        <Box sx={{
                          mt: 'auto',
                          display: 'flex',
                          justifyContent: 'flex-end'
                        }}>
                          <Button
                            color="error"
                            onClick={(e) => handleRemoveMealCard(index, e)}
                          >
                            Remove
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2
              }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddMealCard}
                  sx={{
                    borderColor: '#00a6f9',
                    color: '#00a6f9',
                    '&:hover': { borderColor: '#007bb5' }
                  }}
                >
                  Add Meal
                </Button>

                <Button
                  variant="contained"
                  onClick={submitHandler}
                  sx={{
                    bgcolor: '#00a6f9',
                    '&:hover': { bgcolor: '#007bb5' }
                  }}
                >
                  Create Meal Plan
                </Button>
              </Box>
            </div>
          </div>
        </Grid>

        <Grid item xs={3}>
          <SideNotoficationPanel />
        </Grid>
      </Grid>
    </Box>

  );
};

export default AddMealPlanPage;
