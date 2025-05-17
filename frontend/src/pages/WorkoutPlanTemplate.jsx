import React, { useState } from 'react'
import axios from 'axios';
import { Row, Col } from 'react-bootstrap'
import TextField from '@mui/material/TextField';
import WorkoutPalnTempStyle from '../styles/WorkoutPalnTempStyle.module.css'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import NavBar from '../components/NavBar';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import ReactPlayer from 'react-player';



import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { storage } from "../Config/FireBaseConfig.js";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from 'react-router-dom';

const dropzoneStyle = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '20px',
};

const WorkoutPlanTemplate = () => {

    const [isLoading, setIsLoading] = useState(false);
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [nameTouched, setNameTouched] = useState(false);
    const [description, setDescription] = useState('');
    const [descriptionTouched, setDescriptionTouched] = useState(false);
    const [Exercise, setExerciseTableData] = useState([{
        name: '',
        description: '',
        targetAreas: '',
        equipments: '',
        sets: '',
        reps: '',
        nameTouched: false,
    }]);
    const [duration, setDuration] = useState('');
    const [durationTouched, setDurationTouched] = useState(false);
    const [intensity, setIntensity] = useState('');
    const [intensityTouched, setIntensityTouched] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);


    //handlers in exercise table
    const handleAddRowExercise = () => {
        setExerciseTableData((prevData) => [
            ...prevData,
            {
                name: '',
                description: '',
                targetAreas: '',
                equipments: '',
                sets: '',
                reps: '',
                nameTouched: false,
                setsTouched: false,
                repsTouched: false,
            },
        ]);
    };

    const handleExerciseBlur = (index, field) => {
        setExerciseTableData(prevData => {
            const newData = [...prevData];
            newData[index][`${field}Touched`] = true;
            return newData;
        });
    };

    const handleRemoveExercise = (index) => {
        setExerciseTableData((prevData) => {
            const newData = [...prevData];
            newData.splice(index, 1);
            return newData;
        });
    };

    const handleInputChangeExercise = (index, field, value) => {
        setExerciseTableData((prevData) => {
            const newData = [...prevData];
            newData[index][field] = value;
            return newData;
        });
    };

    //handler for image preview
    const handleImageChange = (event) => {
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

    //video
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setVideo(file);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'video/*', multiple: false });


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

    //image upload handler
    const uploadProfileImage = async () => {
        return new Promise((resolve, reject) => {
            if (image == null) {
                resolve(null); // Resolve with null if no image is provided
            } else {
                const ProfileImageRef = ref(
                    storage,
                    `${storedUserInfo.userName} / WorkoutPlan / ${image.name + v4()}`
                );

                uploadBytes(ProfileImageRef, image)
                    .then(() => {
                        getDownloadURL(ProfileImageRef)
                            .then((downloadURL) => {

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
        })
    }

    //video upload handler
    const uploadVideo = async () => {
        return new Promise((resolve, reject) => {
            if (video == null) {
                resolve(null); // Resolve with null if no image is provided
            } else {
                const ProfileImageRef = ref(
                    storage,
                    `${storedUserInfo.userName} / WorkoutPlan / ${video.name + v4()}`
                );

                uploadBytes(ProfileImageRef, video)
                    .then(() => {
                        getDownloadURL(ProfileImageRef)
                            .then((downloadURL) => {
                                alert('added to firebase')
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
        })
    }



    const submitHandler = async () => {
        // Mark all fields as touched
        setNameTouched(true);
        setDescriptionTouched(true);
        setDurationTouched(true);
        setIntensityTouched(true);
        setExerciseTableData(prevData =>
            prevData.map(ex => ({
                ...ex,
                nameTouched: true,
                setsTouched: true,
                repsTouched: true
            }))
        );

        const exercisesValid = Exercise.every(ex => {
            const sets = parseInt(ex.sets, 10);
            const reps = parseInt(ex.reps, 10);
            return ex.name.trim() &&
                !isNaN(sets) && sets > 0 &&
                !isNaN(reps) && reps > 0;
        });

        // Basic field validations
        const basicValidation = [
            name.trim(),
            description.trim(),
            duration,
            intensity,
            exercisesValid,
            Exercise.length > 0,
            Exercise.every(ex => ex.name.trim())
        ].every(Boolean);

        
        if (!basicValidation) {
            toast.error("Please fill all required fields");
            return;
        }

        // Duration validation
        const durationNumber = parseInt(duration, 10);
        if (isNaN(durationNumber) || durationNumber <= 0 || durationNumber > 30) {
            toast.error("Invalid Video Duration");
            return;
        }

        setIsLoading(true);

        try {
            // Upload files and submit
            const downUrl = await uploadProfileImage();
            const downVideoUrl = await uploadVideo();

            const WorkoutPlan = {
                name: name,
                description: description,
                exercises: Exercise,
                duration: durationNumber,
                intensity: intensity,
                image: downUrl,
                video: downVideoUrl,
                creatorId: storedUserInfo.id,
                creatorName: storedUserInfo.userName,
            };

            await axios.post('http://localhost:8080/api/workoutPlans', WorkoutPlan);
            toast.success("Workout Plan published successfully!");
            navigate('/myprofile');
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to publish workout plan");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>

            <NavBar />

            {isLoading ? (
                <>
                    <div style={{ margin: '20% 0% 0% 50%' }}>

                        <CircularProgress />

                    </div>
                </>
            ) : (
                <>
                    <div className={WorkoutPalnTempStyle.bodyDiv} >

                        <div style={{ marginRight: '15%' }}>
                            <h2 className={WorkoutPalnTempStyle.header} >NEW WORKOUT PLAN</h2>
                        </div>

                        <div style={{ backgroundColor: "#ffffff", padding: '3%', marginRight: '15%', borderRadius: '10px' }}>

                            <Row>
                                <Col xs={6}>
                                    <Row className={WorkoutPalnTempStyle.rows}>

                                        <TextField
                                            label="WorkOut Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onBlur={() => setNameTouched(true)}
                                            error={nameTouched && !name.trim()}
                                            helperText={nameTouched && !name.trim() && 'Required'}
                                        />
                                    </Row>

                                    <Row className={WorkoutPalnTempStyle.rows}>
                                        <TextField
                                            id="outlined-multiline-flexible"
                                            label="Description"
                                            placeholder="Small description about your workout"
                                            multiline
                                            fullWidth
                                            required
                                            variant="outlined"
                                            rows={6}
                                            value={description}
                                            onBlur={() => setDescriptionTouched(true)}
                                            error={descriptionTouched && !description.trim()}
                                            helperText={descriptionTouched && !description.trim() && 'Required'}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />

                                    </Row>

                                </Col>

                                <Col>

                                    <Row className={WorkoutPalnTempStyle.rows} style={{ height: '93%' }}>
                                        <Row style={{ paddingLeft: '15%' }}>
                                            <form>
                                                <label >
                                                    <div style={{ textAlign: 'center' }}>
                                                        {imagePreview ? (
                                                            <img src={imagePreview} alt="Preview" style={{ width: '325px', height: '200px', margin: '0% 0px 0px 13%' }} />
                                                        ) : (
                                                            <img src={'/src/assets/images/upload-icon.png'} alt="Preview" style={{ width: '325px', height: '200px', margin: '0% 0px 0px 13%' }} />
                                                        )}
                                                    </div>

                                                </label>
                                            </form>
                                        </Row>
                                        <Row style={{ paddingLeft: '44%', width: '360px', paddingTop: '2%' }}>
                                            <Button style={{ border: "1px solid rgb(0, 170, 255)" }}
                                                component="label"
                                                role={undefined}
                                                tabIndex={-1}
                                                startIcon={<CloudUploadIcon />}
                                                onChange={handleImageChange}
                                            >
                                                Upload
                                                <VisuallyHiddenInput type="file" />
                                            </Button>
                                        </Row>



                                    </Row>
                                </Col>

                            </Row>

                            <Row style={{ paddingBottom: '2%', color: 'rgb(0, 170, 255)' }}>
                                <h4>Exercises</h4>
                            </Row>

                            <Row className={WorkoutPalnTempStyle.rows} style={{ paddingBottom: '0%' }}>
                                <TableContainer component={Paper} style={{ padding: '0%' }} >
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Name</TableCell>
                                                <TableCell align="left">Description</TableCell>
                                                <TableCell align="left">Traget Areas</TableCell>
                                                <TableCell align="left">Equipments</TableCell>
                                                <TableCell align="left">Sets</TableCell>
                                                <TableCell align="left">Repetitons</TableCell>
                                                <TableCell align="left">Remove</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Exercise.map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            value={row.name}
                                                            onBlur={() => handleExerciseBlur(index)}
                                                            error={row.nameTouched && !row.name.trim()}
                                                            helperText={row.nameTouched && !row.name.trim() && 'Required'}
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "name",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            multiline
                                                            minRows={1}
                                                            value={row.description}
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "description",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            value={row.targetAreas}
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "targetAreas",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            value={row.equipments}
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "equipments",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            type='number'
                                                            value={row.sets}
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "sets",
                                                                    e.target.value
                                                                )
                                                            }
                                                            onBlur={() => handleExerciseBlur(index, 'sets')}
                                                            error={row.setsTouched && (row.sets === '' || parseInt(row.sets) <= 0)}
                                                            helperText={row.setsTouched &&
                                                                (row.sets === '' ? 'Required' :
                                                                    parseInt(row.sets) <= 0 ? 'Must be > 0' : '')}
                                                            inputProps={{ min: 1 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            id="standard-basic"
                                                            variant="standard"
                                                            type='number'
                                                            value={row.reps}
                                                            onChange={(e) =>
                                                                handleInputChangeExercise(
                                                                    index,
                                                                    "reps",
                                                                    e.target.value
                                                                )
                                                            }
                                                            onBlur={() => handleExerciseBlur(index, 'reps')}
                                                            error={row.repsTouched && (row.reps === '' || parseInt(row.reps) <= 0)}
                                                            helperText={row.repsTouched &&
                                                                (row.reps === '' ? 'Required' :
                                                                    parseInt(row.reps) <= 0 ? 'Must be > 0' : '')}
                                                            inputProps={{ min: 1 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button style={{
                                                            color: 'red',
                                                            borderColor: 'red', width: '100px',
                                                            marginBottom: '3%',
                                                            marginTop: '3%'

                                                        }} variant="outlined" onClick={() => handleRemoveExercise(index)}>Remove</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Row>
                            <Row className={WorkoutPalnTempStyle.rows}>
                                <Button variant="contained" style={{ background: 'rgb(0, 170, 255)' }} fullWidth onClick={handleAddRowExercise}>Add Rows</Button>

                            </Row>



                            <Row>


                                {video && (
                                    <div>
                                        <p>Preview:</p>
                                        <ReactPlayer url={URL.createObjectURL(video)} controls />
                                    </div>
                                )}

                                <div {...getRootProps()} style={dropzoneStyle}>
                                    <input {...getInputProps()} />
                                    <p>Drag & drop a video file here, or click to select one</p>
                                </div>


                            </Row>


                            <Row className={WorkoutPalnTempStyle.rows}>
                                <Col xs={6}>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label" required>Intensity</FormLabel>
                                        <RadioGroup

                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={intensity}
                                            onClick={(e) => setIntensity(e.target.value)}


                                        >
                                            <FormControlLabel value="Beginner" control={<Radio />} label="Beginner" />
                                            <FormControlLabel value="Intermediate" control={<Radio />} label="Intermediate" />
                                            <FormControlLabel value="Advanced" control={<Radio />} label="Advanced" />

                                        </RadioGroup>
                                    </FormControl>
                                </Col>


                                <Col>
                                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password" required>Duration</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            value={duration}
                                            type='number'
                                            onChange={(e) => setDuration(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    min
                                                </InputAdornment>
                                            }
                                            label="Duration"
                                            onBlur={() => setDurationTouched(true)}
                                            error={durationTouched && (!duration || parseInt(duration) <= 0)}
                                        />
                                        {durationTouched && (!duration || parseInt(duration) <= 0 || parseInt(duration) > 30) && (
                                            <FormHelperText error>Less than 30s duration video required !!  </FormHelperText>
                                        )}

                                    </FormControl>
                                </Col>

                            </Row>

                            <Row>

                                <Button style={{ background: 'rgb(0, 170, 255)', width: '15%', marginLeft: '41%' }} variant="contained" onClick={submitHandler}>Publish</Button>
                            </Row>

                        </div>



                    </div>
                </>
            )}


        </>

    )
}

export default WorkoutPlanTemplate
