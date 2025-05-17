import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Grid,
  Card,
  CardContent,
  Typography
} from '@mui/material';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddMealPlanPageStyle from '../styles/AddMealPlanPageStyle.module.css';
import { storage } from '../Config/FireBaseConfig.js';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import SideUserPanel from '../components/SideUserPanel';
import SideNotoficationPanel from '../components/SideNotoficationPanel';
import NavBar from '../components/NavBar.jsx';

const UpdateMealPlanPage = () => {
  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);

  const { mealplanId } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Janul');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [mealCards, setMealCards] = useState([
    {
      name: '',
      ingredients: [],
      instructions: '',
      size: '',
      nutritious: [],
    },
  ]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadData();
  }, [mealplanId]);



  const loadData = async () => {
    try {
      if (mealplanId) {
        const res = await axios.get(
          `http://localhost:8080/api/user/mealplan/${mealplanId}`
        );
        console.log('API response:', res.data);

        if (res.data) {
          const mealPlanData = res.data;

          setTitle(mealPlanData.title);
          setCategory(mealPlanData.category);
          setImagePreview(mealPlanData.mealsPicURL);
          setMealCards(mealPlanData.meals);
        } else {
          toast.error('Failed to fetch meal plan data');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Error fetching meal plan data');
    }
  };

  const handleImageChange = (event) => {
    event.preventDefault();
    const selectedImage = event.target.files[0];
    setImage(selectedImage);

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
    // Trigger the file input dialog when image is clicked
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
      .put(
        `http://localhost:8080/api/user/mealplan/${mealplanId}`,
        newmealPlanData
      )
      .then((response) => {
        console.log('Form submitted successfully!' + response);
        toast.success('Successfully MealPlan Updated!');
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
          <Card sx={{
            mb: 3,
            background: 'white',
            marginTop:'30px'
          }}>
            <Typography variant="h4" sx={{ color: ' rgb(0, 170, 255)', p: 3 ,
    
    boxShadow: '0 4px 6px rgba(0, 166, 249, 0.1)',textAlign:'center'}}>
              Update Meal Plan
            </Typography>
          </Card>

          <Grid container sx={{ background: 'white', p: 3, borderRadius: 2 }}>
            {/* Form Section */}
            <Grid item xs={12} container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Meal Plan Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="Vegan">Vegan</MenuItem>
                    <MenuItem value="Keto">Keto</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <Box
                  onClick={handleImageClick}
                  sx={{
                    border: '2px dashed #00a6f9',
                    borderRadius: 2,
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#007bb5' }
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: 200 }}
                    />
                  ) : (
                    <Box textAlign="center">
                      <CloudUploadIcon sx={{ fontSize: 40, color: '#00a6f9' }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Click to upload cover image
                      </Typography>
                    </Box>
                  )}
                  <VisuallyHiddenInput
                    type="file"
                    id="imageInput"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Meals Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{
                color: '#00a6f9',
                pb: 1,
                borderBottom: '2px solid #00a6f9',
                mb: 3
              }}>
                Meal Details
              </Typography>

              <Grid container spacing={3}>
                {mealCards.map((meal, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ height: '100%', p: 2 }}>
                      <CardContent>
                        <TextField
                          fullWidth
                          label="Meal Name"
                          value={meal.name}
                          onChange={(e) => handleInputChange(e, 'name', index)}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Ingredients (comma separated)"
                          value={meal.ingredients}
                          onChange={(e) => handleInputChange(e, 'ingredients', index)}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Instructions"
                          multiline
                          rows={3}
                          value={meal.instructions}
                          onChange={(e) => handleInputChange(e, 'instructions', index)}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Portion Size (e.g., 200g)"
                          value={meal.size}
                          onChange={(e) => handleInputChange(e, 'size', index)}
                          sx={{ mb: 2 }}
                          error={!/^[0-9]+ (mg|g|kg|l|ml)$/.test(meal.size)}
                          helperText={!/^[0-9]+ (mg|g|kg|l|ml)$/.test(meal.size) &&
                            "Valid formats: 100mg, 200g, 5kg, 500ml, 1l"}
                        />
                        <TextField
                          fullWidth
                          label="Nutrients (comma separated)"
                          value={meal.nutritious}
                          onChange={(e) => handleInputChange(e, 'nutritious', index)}
                          sx={{ mb: 2 }}
                        />
                        <Box display="flex" justifyContent="flex-end">
                          <Button
                            color="error"
                            onClick={() => handleRemoveMealCard(index)}
                          >
                            Remove
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
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
                  Update Meal Plan
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={3}>
          <SideNotoficationPanel />
        </Grid>
      </Grid>
    </Box>



  );
};

export default UpdateMealPlanPage;
