import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Row, Col } from 'react-bootstrap'
import TextField from '@mui/material/TextField';
import WorkoutPalnTempStyle from '../styles/WorkoutPalnTempStyle.module.css'
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import IconButton from '@mui/joy/IconButton';
import SideUserPanel from '../components/SideUserPanel';
import SideNotoficationPanel from '../components/SideNotoficationPanel';
import AllStatusSingleCard from '../components/AllStatusSingleCard';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Check from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Switch from '@mui/material/Switch';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import ReactPlayer from 'react-player';
// Material-UI Icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PublishIcon from '@mui/icons-material/Publish';

// Material-UI Components
import {
    Grid,
    Container,
    Typography,
} from '@mui/material';

import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { storage } from "../Config/FireBaseConfig.js";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 } from "uuid";


//transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const dropzoneStyle = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '20px',
};


const WorkoutPlanPostView = () => {

    const postId = useParams('id');
    const [postData, setPostData] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);
    const navigate = useNavigate();

    const descriptionElementRef = React.useRef(null);

    //comment box
    const [italic, setItalic] = useState(false);
    const [fontWeight, setFontWeight] = useState('normal');
    const [anchorEl, setAnchorEl] = useState(null);

    //dialog box in deletePost
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [scroll, setScroll] = useState('paper');

    //update dialog box
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [Exercise, setExerciseTableData] = useState([
        {
            name: '',
            description: '',
            targetAreas: '',
            equipments: '',
            sets: '',
            reps: '',

        }
    ]);
    const [duration, setDuration] = useState('');
    const [intensity, setIntensity] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false);
    const [videoPreview, setVideoPreview] = useState(null);
    const [visibility, setVisibility] = useState();

    //like
    const [userLiked, setUserLiked] = useState(false);
    const [openLike, setOpenLike] = useState(false);

    //visibility
    const [visibCount, setvisibCount] = useState(0);

    //add a comment
    const [commentString, setComment] = useState('');
    const [sendComment, setsendComment] = useState(0);

    //delete a comment
    const [deleteComment, setDeleteComment] = useState(0);

    //edit a comment
    const [editCom, setEditCom] = useState(0);
    const [editComement, setEditComment] = useState('');

    //edit Comment dialogBox
    const [openEditComment, setOpenEditComment] = useState(false);

    //video
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setVideo(file);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'video/*', multiple: false });


    //handlers to handle Edit dialog box
    const handleClickOpenEdit = (scrollType) => () => {
        setOpenEdit(true);
        setScroll(scrollType);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    //handlers to handle delete dialog box
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //handlers to handle viewLikes
    const handleLikeClickOpen = () => {
        setOpenLike(true);
    };

    const handleLikeClickClose = () => {
        setOpenLike(false);
    };

    //handlers to edit Comment Dialog Box
    const handleEditCommentClickOpen = (comment) => {
        setOpenEditComment(true);
        setEditComment(comment);
    };

    const handleEditCommentClose = () => {
        setOpenEditComment(false);
    };


    //handlers for table in edit dialog Box
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

            },
        ]);
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

    //image upload function
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

    //table styles
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


    console.log(userLiked);

    const UpdateHandler = async () => {

        const imageUrl = await uploadProfileImage();
        const videoUrl = await uploadVideo();
        if ((name == '') || (description == '') || (duration === '') || (intensity === '')) {
            toast.error("fail to update. Please Fill required fields");
        }
        else {

            const UpdatedWorkoutPlan = {
                name: name,
                description: description,
                exercises: Exercise,
                duration: duration,
                image: imageUrl,
                video: videoUrl,
                intensity: intensity,
                creatorId: storedUserInfo.id,
                creatorName: storedUserInfo.userName
            };

            console.log(UpdatedWorkoutPlan);



            axios.put(`http://localhost:8080/api/workoutPlans/${postId.id}`, UpdatedWorkoutPlan)
                .then(response => {
                    setIsUpdated(true);
                    console.log("Workout Plan updated successfully!" + response);
                    toast.success("Workout Plan updated successfully!");

                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }

        handleCloseEdit()



    }

    const deleteHandler = () => {
        axios.delete(`http://localhost:8080/api/workoutPlans/${postId.id}`)
            .then(response => {
                console.log("Workout Plan deleted successfully!" + response);
                navigate("/myprofile");
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    const addCommentHandler = async () => {
        console.log(commentString);
        const commentOb = {
            userId: storedUserInfo.id,
            name: storedUserInfo.userName,
            comment: commentString,
        }
        console.log(commentOb);
        await axios.put(`http://localhost:8080/api/workoutPlans/comments/${postId.id}`, commentOb)
            .then(response => {
                setsendComment(sendComment => sendComment + 1);
                console.log("Comment updated successfully!" + response);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    const deleteCommentHandler = async (name, comment) => {

        const commentOb = {
            name: name,
            comment: comment
        }
        console.log(commentOb);
        await axios.put(`http://localhost:8080/api/workoutPlans/deleteComment/${postId.id}`, commentOb)
            .then(response => {
                setDeleteComment(num => num + 1);
                console.log("Comment deleted successfully!" + response);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    const EditCommentHandler = async (name, prevComment, newComment) => {

        const commentOb = {
            name: name,
            prevComment: prevComment,
            newComment: newComment
        }

        console.log(commentOb);
        await axios.put(`http://localhost:8080/api/workoutPlans/editComment/${postId.id}`, commentOb)
            .then(response => {
                setEditCom(prevEditCom => prevEditCom + 1)
                setOpenEditComment(false)
                console.log("Comment deleted successfully!" + response);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    const likeHandler = async () => {
        const likeOb = {
            userId: storedUserInfo.id,
            name: storedUserInfo.userName,
        };

        try {
            const response = await axios.put(`http://localhost:8080/api/workoutPlans/like/${postId.id}`, likeOb);
            const updatedPost = response.data;
            setPostData(updatedPost);
            setUserLiked(updatedPost.likes.some(like => like.userId === storedUserInfo.id));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const UnLikeHandler = async () => {
        const unlikeOb = {
            userId: storedUserInfo.id,
            name: storedUserInfo.userName,
        };

        try {
            const response = await axios.put(`http://localhost:8080/api/workoutPlans/unlike/${postId.id}`, unlikeOb);
            const updatedPost = response.data;
            setPostData(updatedPost);
            setUserLiked(updatedPost.likes.some(like => like.userId === storedUserInfo.id));
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const VisibilityHandler = async () => {

        const updatedvisibility = !visibility
        setVisibility(updatedvisibility);

        await axios.put(`http://localhost:8080/api/workoutPlans/visibility/${postId.id}/${updatedvisibility}`)
            .then(response => {
                console.log("change visibility successfully!" + response);
                setvisibCount((count => count + 1));
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }


    //useEffect
    useEffect(() => {
        const fetchDataAndCheckLike = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:8080/api/workoutPlans/viewPost/${postId.id}`);
                setPostData(response.data);
                setName(response.data.name);
                setDescription(response.data.description);
                setDuration(response.data.duration);
                setIntensity(response.data.intensity);
                setVideoPreview(response.data.video);
                setExerciseTableData(response.data.exercises);
                setVisibility(response.data.visibility);


                console.log(response);




                const isLiked = response.data.likes.some(like => like.userId === storedUserInfo.id);
                setUserLiked(isLiked);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchDataAndCheckLike();


        if (openEdit) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [postId.id, sendComment, openEdit, isUpdated, deleteComment, editCom, visibCount])
    console.log(postData);


    console.log(userLiked);
    return (
        <>
            <NavBar />
            <div style={{
                                        // background: 'linear-gradient(135deg, #E0F7FA, #80DEEA, #4FC3F7, #29B6F6, #039BE5)',
                                        background: 'rgba(111, 204, 250, 0.6)',
                                        minHeight: '100vh'
                                    }}>

            <Grid container sx={{ pt: 8 }}>
                <Grid item xs={3}>
                    <SideUserPanel />
                </Grid>

                <Grid item xs={7}>
                    <Container maxWidth="lg" sx={{ py: 3 }} >
                        {isLoading ? (<>
                            <div style={{ margin: '20% 0% 0% 50%' }}>

                                <CircularProgress />

                            </div>


                        </>)
                            : (
                                <>
                                    
                                        <div >

                                            <div style={{ backgroundColor: "#ffffff", padding: '3%', marginBottom: '10px', maxWidth: '775px', borderRadius: '10px' }}>

                                                {postData.creatorId === storedUserInfo.id ? (
                                                    <>
                                                        <Row>
                                                            <Col xs={9}></Col>
                                                            <Col>
                                                                Post
                                                                <Switch
                                                                    checked={visibility}
                                                                    onChange={VisibilityHandler}
                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                />
                                                                <span>{visibility ? 'Shared' : 'Private'}</span>
                                                            </Col>

                                                        </Row>
                                                    </>
                                                ) : (<></>)}


                                                <Row>

                                                    <Col xs={5} style={{ paddingLeft: '4%' }}>
                                                        <h2 style={{ paddingTop: '10%' }}>
                                                            {postData.name}
                                                        </h2>
                                                        <p style={{ margin: '0%' }}>Posted By : <b style={{ color: '#7960c9' }}>{postData.creatorName}</b></p>
                                                        <p style={{ margin: '0%' }}>Intensity : {postData.intensity}</p>
                                                        <p style={{ margin: '0%' }}>Hours : {postData.duration} min</p>

                                                        <Row>
                                                            <Col xs={2}>
                                                                {userLiked ? (
                                                                    <IconButton onClick={UnLikeHandler}>
                                                                        <ThumbUpIcon />
                                                                    </IconButton>
                                                                ) : (
                                                                    <IconButton onClick={likeHandler}>
                                                                        <ThumbUpOutlinedIcon />
                                                                    </IconButton>
                                                                )}
                                                            </Col>
                                                            <Col>
                                                                <Button style={{ color: 'black', background: '#f6f6f6', }} onClick={handleLikeClickOpen}>
                                                                    ({postData.likes && postData.likes.length}) likes
                                                                </Button>

                                                                <React.Fragment style={{ background: '#66526469' }}>
                                                                    <Dialog
                                                                        style={{ background: '#66526469' }}
                                                                        open={openLike}
                                                                        onClose={handleLikeClickClose}
                                                                        aria-labelledby="alert-dialog-title"
                                                                        aria-describedby="alert-dialog-description"
                                                                        fullWidth
                                                                        maxWidth='xs'
                                                                    >
                                                                        <DialogTitle style={{ marginLeft: '40%' }} id="alert-dialog-title">
                                                                            {"Likes"}
                                                                        </DialogTitle>
                                                                        <DialogContent>
                                                                            <DialogContentText id="alert-dialog-description">
                                                                                {postData.likes && postData.likes.map((row) => (
                                                                                    <Row style={{ background: '#edebff', margin: '5% 1% -3% 1%' }}>
                                                                                        <Col>
                                                                                            <p>{row.name}</p>
                                                                                        </Col>
                                                                                    </Row>
                                                                                ))}

                                                                            </DialogContentText>
                                                                        </DialogContent>
                                                                        <DialogActions>
                                                                            <Button onClick={handleLikeClickClose}>OK</Button>
                                                                        </DialogActions>
                                                                    </Dialog>
                                                                </React.Fragment>
                                                            </Col>

                                                        </Row>

                                                        <Row>

                                                            {postData.creatorId === storedUserInfo.id ? (<>
                                                                <Button style={{
                                                                    color: '#077e16',
                                                                    borderColor: '#077e16', width: '25%',
                                                                    margin: '3% 5% 3% 0%',
                                                                    float: 'left'
                                                                }}

                                                                    variant="outlined"
                                                                    onClick={handleClickOpenEdit('paper')}>Edit</Button>


                                                                <Button style={{
                                                                    color: 'red',
                                                                    borderColor: 'red', width: '25%',
                                                                    marginBottom: '3%',
                                                                    marginTop: '3%'
                                                                }}
                                                                    variant="outlined"
                                                                    onClick={handleClickOpen} >Delete</Button>

                                                            </>) : (<></>)}



                                                            <React.Fragment>
                                                                <Dialog
                                                                    open={open}
                                                                    TransitionComponent={Transition}
                                                                    keepMounted
                                                                    onClose={handleClose}
                                                                    aria-describedby="alert-dialog-slide-description"
                                                                >
                                                                    <DialogTitle>{"Do you really want to delete the Workout Plan?"}</DialogTitle>
                                                                    <DialogContent>
                                                                        <DialogContentText id="alert-dialog-slide-description">
                                                                            Are you sure you want to delete the Workout plan? This action cannot be undone. Please confirm your decision.
                                                                        </DialogContentText>
                                                                    </DialogContent>
                                                                    <DialogActions>
                                                                        <Button onClick={handleClose}>Cancel</Button>
                                                                        <Button onClick={deleteHandler}>Confirm</Button>
                                                                    </DialogActions>
                                                                </Dialog>
                                                            </React.Fragment>
                                                        </Row>

                                                    </Col>

                                                    <Col>
                                                        <div >
                                                            <img style={{ background: 'rgb(207 202 101)', height: '250px', width: '400px', marginTop: '3%' }} src={postData.image} alt="Preview" />
                                                        </div>

                                                    </Col>
                                                </Row>

                                            </div>




                                            <div style={{ backgroundColor: "#ffffff", padding: '3%', marginBottom: '10px', maxWidth: '775px', borderRadius: '10px' }}>



                                                <Row>
                                                    <Col>

                                                        <Row style={{ paddingBottom: '2%' }}>
                                                            <h4>Description</h4>
                                                        </Row>
                                                        <Row>
                                                            <p style={{ color: 'rgb(85 90 93)' }}>
                                                                {postData.description}
                                                            </p>
                                                        </Row>

                                                    </Col>
                                                </Row>

                                                <Row style={{ paddingBottom: '2%' }}>
                                                    <h4>Exercises</h4>
                                                </Row>

                                                {postData.exercises && postData.exercises.map((row) => (
                                                    <Row style={{ color: 'rgb(85 90 93)' }}>
                                                        <p><b>Name :  </b> {row.name}
                                                            <br /><b>Description :  </b>{row.description}
                                                            <br /><b>TargetAreas :  </b>{row.targetAreas}
                                                            <br /><b>Equipments :  </b> {row.equipments}
                                                            <br /><b>Sets :  </b> {row.sets}
                                                            <br /><b>Repetions :  </b>{row.reps}
                                                        </p>
                                                    </Row>
                                                ))
                                                }

                                                <Row>
                                                    <div style={{
                                                        padding: '3%',
                                                        marginBottom: '10px',
                                                        maxWidth: '775px',

                                                    }}>
                                                        <p>Video</p>
                                                        <ReactPlayer url={postData.video} controls />
                                                    </div>

                                                </Row>


                                                <Row>
                                                    <div style={{
                                                        padding: '3%',
                                                        marginBottom: '10px',
                                                        maxWidth: '775px',
                                                        border: '1px solid rgb(185 175 175)'
                                                    }}>

                                                        <Row style={{ paddingBottom: '2%' }}>
                                                            <h4>Comments({postData.comments && postData.comments.length})...</h4>
                                                        </Row>
                                                        <Row style={{ padding: '0% 5% 0% 5%' }}>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Type something here…"
                                                                    minRows={3}
                                                                    value={commentString}
                                                                    onChange={(e) => setComment(e.target.value)}
                                                                    endDecorator={
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                gap: 'var(--Textarea-paddingBlock)',
                                                                                pt: 'var(--Textarea-paddingBlock)',
                                                                                borderTop: '1px solid',
                                                                                borderColor: 'divider',
                                                                                flex: 'auto',
                                                                            }}
                                                                        >
                                                                            <IconButton
                                                                                variant="plain"
                                                                                color="neutral"
                                                                                onClick={(event) => setAnchorEl(event.currentTarget)}
                                                                            >
                                                                                <FormatBold />
                                                                                <KeyboardArrowDown fontSize="md" />
                                                                            </IconButton>
                                                                            <Menu
                                                                                anchorEl={anchorEl}
                                                                                open={Boolean(anchorEl)}
                                                                                onClose={() => setAnchorEl(null)}
                                                                                size="sm"
                                                                                placement="bottom-start"
                                                                                sx={{ '--ListItemDecorator-size': '24px' }}
                                                                            >
                                                                                {['200', 'normal', 'bold'].map((weight) => (
                                                                                    <MenuItem
                                                                                        key={weight}
                                                                                        selected={fontWeight === weight}
                                                                                        onClick={() => {
                                                                                            setFontWeight(weight);
                                                                                            setAnchorEl(null);
                                                                                        }}
                                                                                        sx={{ fontWeight: weight }}
                                                                                    >
                                                                                        <ListItemDecorator>
                                                                                            {fontWeight === weight && <Check fontSize="sm" />}
                                                                                        </ListItemDecorator>
                                                                                        {weight === '200' ? 'lighter' : weight}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Menu>
                                                                            <IconButton
                                                                                variant={italic ? 'soft' : 'plain'}
                                                                                color={italic ? 'primary' : 'neutral'}
                                                                                aria-pressed={italic}
                                                                                onClick={() => setItalic((bool) => !bool)}
                                                                            >
                                                                                <FormatItalic />
                                                                            </IconButton>
                                                                            <Button sx={{ ml: 'auto' }} onClick={() => addCommentHandler()}>Send</Button>
                                                                        </Box>
                                                                    }
                                                                    sx={{
                                                                        minWidth: 300,
                                                                        fontWeight,
                                                                        fontStyle: italic ? 'italic' : 'initial',
                                                                    }}
                                                                />
                                                            </FormControl>

                                                        </Row>

                                                        {postData.comments && postData.comments.map((row) => (
                                                            <Row style={{
                                                                padding: '3%',
                                                                margin: '5%',
                                                                marginTop: '10px',
                                                                marginBottom: '10px',
                                                                maxWidth: '775px',
                                                                borderRadius: '9px',
                                                                boxShadow: '0px 0px 12px 0px rgb(237 230 230)'

                                                            }}>

                                                                <Row>
                                                                    <Col xs={8}> <p style={{ color: '#9d00c2' }}>{row.name}</p></Col>
                                                                    <Col style={{ paddingLeft: '15%' }}>

                                                                        {row.userId === storedUserInfo.id || storedUserInfo.id === postData.creatorId ? (

                                                                            <>

                                                                                <IconButton aria-label="delete" size="large" onClick={() => deleteCommentHandler(row.name, row.comment)}>
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </>
                                                                        ) : (<></>)}


                                                                        {row.userId === storedUserInfo.id ? (
                                                                            <>
                                                                                <IconButton onClick={() => handleEditCommentClickOpen(row.comment)}>
                                                                                    <EditIcon />
                                                                                </IconButton>

                                                                                <React.Fragment>

                                                                                    <Dialog
                                                                                        open={openEditComment}
                                                                                        onClose={handleEditCommentClose}
                                                                                        aria-labelledby="alert-dialog-title"
                                                                                        aria-describedby="alert-dialog-description"
                                                                                        fullWidth
                                                                                        maxWidth="sm"
                                                                                    >
                                                                                        <DialogTitle id="alert-dialog-title">
                                                                                            {row.name}
                                                                                        </DialogTitle>
                                                                                        <DialogContent>
                                                                                            { }
                                                                                            <TextField
                                                                                                id="standard-basic"
                                                                                                variant="standard"
                                                                                                value={editComement}
                                                                                                sx={5}
                                                                                                fullWidth
                                                                                                onChange={(e) => setEditComment(e.target.value)
                                                                                                }
                                                                                            />
                                                                                        </DialogContent>
                                                                                        <DialogActions>
                                                                                            <Button onClick={handleEditCommentClose}>Cancel</Button>
                                                                                            <Button onClick={() => EditCommentHandler(row.name, row.comment, editComement)} autoFocus>
                                                                                                Save
                                                                                            </Button>
                                                                                        </DialogActions>
                                                                                    </Dialog>
                                                                                </React.Fragment>
                                                                            </>
                                                                        ) : (<></>)}


                                                                    </Col>
                                                                    <p>{row.comment}</p>
                                                                </Row>

                                                            </Row>

                                                        ))}


                                                    </div>
                                                </Row>



                                            </div>
                                        </div>


                                    

                                </>)}


                        {/*update workout plan form*/}

                        <React.Fragment>
                            <Dialog
                                open={openEdit}
                                onClose={handleCloseEdit}
                                scroll={scroll}
                                fullWidth
                                maxWidth='md'
                                PaperProps={{
                                    style: {
                                        borderRadius: '16px',
                                        backgroundColor: '#f8faff'
                                    }
                                }}
                            >
                                <DialogTitle
                                    id="scroll-dialog-title"
                                    style={{
                                        backgroundColor: 'rgba(0, 106, 255, 0.83)',
                                        color: 'white',
                                        fontWeight: 600,
                                        padding: '20px 24px',
                                        fontSize: '1.25rem'
                                    }}
                                >
                                    Update Workout Plan
                                </DialogTitle>

                                <DialogContent dividers={scroll === 'paper'} style={{ padding: '24px' }}>
                                    <div style={{
                                        backgroundColor: "white",
                                        padding: '24px',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}>
                                        <Grid container spacing={3}>
                                            {/* Left Column */}
                                            <Grid item xs={12} md={6}>
                                                <div style={{ marginBottom: '24px' }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Workout Name"
                                                        variant="filled"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        InputProps={{
                                                            style: {
                                                                borderRadius: '8px',
                                                                backgroundColor: '#f8faff'
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <div style={{ marginBottom: '24px' }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Description"
                                                        multiline
                                                        rows={6}
                                                        variant="filled"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        InputProps={{
                                                            style: {
                                                                borderRadius: '8px',
                                                                backgroundColor: '#f8faff'
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </Grid>

                                            {/* Right Column - Image Upload */}
                                            <Grid item xs={12} md={6}>
                                                <div style={{
                                                    border: '2px dashed #e0f0ff',
                                                    borderRadius: '12px',
                                                    padding: '16px',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#f8faff'
                                                }}>
                                                    {imagePreview || postData.image ? (
                                                        <img
                                                            src={imagePreview || postData.image}
                                                            alt="Preview"
                                                            style={{
                                                                width: '100%',
                                                                height: '200px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                marginBottom: '16px'
                                                            }}
                                                        />
                                                    ) : (
                                                        <CloudUploadIcon
                                                            style={{
                                                                fontSize: '48px',
                                                                color: '#8e9ea6',
                                                                marginBottom: '12px'
                                                            }}
                                                        />
                                                    )}

                                                    <Button
                                                        component="label"
                                                        variant="outlined"
                                                        startIcon={<CloudUploadIcon />}
                                                        style={{
                                                            borderColor: 'rgba(0, 106, 255, 0.83)',
                                                            color: 'rgba(0, 106, 255, 0.83)',
                                                            textTransform: 'none',
                                                            borderRadius: '8px',
                                                            padding: '8px 16px'
                                                        }}
                                                    >
                                                        Upload Image
                                                        <VisuallyHiddenInput
                                                            type="file"
                                                            onChange={handleImageChange}
                                                        />
                                                    </Button>
                                                </div>
                                            </Grid>
                                        </Grid>

                                        {/* Exercises Section */}
                                        <div style={{ margin: '32px 0 16px 0' }}>
                                            <Typography
                                                variant="subtitle1"
                                                style={{
                                                    color: 'rgba(44, 44, 44, 0.83)',
                                                    fontWeight: 600,
                                                    marginBottom: '16px'
                                                }}
                                            >
                                                Exercises
                                            </Typography>

                                            <TableContainer
                                                component={Paper}
                                                style={{
                                                    borderRadius: '12px',
                                                    boxShadow: 'none',
                                                    border: '1px solid #e0f0ff'
                                                }}
                                            >
                                                <Table>
                                                    <TableHead style={{ backgroundColor: '#f8faff' }}>
                                                        <TableRow>
                                                            {['Name', 'Description', 'Target Areas', 'Equipments', 'Sets', 'Reps', ''].map((header, index) => (
                                                                <TableCell
                                                                    key={index}
                                                                    style={{
                                                                        fontWeight: 600,
                                                                        color: 'rgba(44, 44, 44, 0.83)'
                                                                    }}
                                                                >
                                                                    {header}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        {Exercise.map((row, index) => (
                                                            <TableRow key={index} hover>
                                                                {['name', 'description', 'targetAreas', 'equipments', 'sets', 'reps'].map((field) => (
                                                                    <TableCell key={field}>
                                                                        <TextField
                                                                            fullWidth
                                                                            variant="standard"
                                                                            value={row[field]}
                                                                            onChange={(e) =>
                                                                                handleInputChangeExercise(index, field, e.target.value)
                                                                            }
                                                                            InputProps={{ disableUnderline: true }}
                                                                            style={{
                                                                                backgroundColor: '#f8faff',
                                                                                borderRadius: '4px',
                                                                                padding: '4px 8px'
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                ))}
                                                                <TableCell align="right">
                                                                    <IconButton
                                                                        onClick={() => handleRemoveExercise(index)}
                                                                        style={{ color: '#ff4d4f' }}
                                                                    >
                                                                        <DeleteOutlineIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>

                                            <Button
                                                fullWidth
                                                style={{
                                                    marginTop: '16px',
                                                    border:'1px solid rgba(0, 106, 255, 0.83) ',
                                                    background:'white',
                                                    color: 'rgba(0, 106, 255, 0.83)',
                                                    textTransform: 'none',
                                                    borderRadius: '8px',
                                                    height: '40px'
                                                }}
                                                onClick={handleAddRowExercise}
                                            >
                                                Add New Exercise
                                            </Button>
                                        </div>

                                        {/* Video Upload Section */}
                                        <div style={{ margin: '24px 0' }}>
                                            <div
                                                {...getRootProps()}
                                                style={{
                                                    border: '2px dashed #e0f0ff',
                                                    borderRadius: '12px',
                                                    padding: '24px',
                                                    textAlign: 'center',
                                                    backgroundColor: '#f8faff',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    ':hover': {
                                                        borderColor: 'rgba(0, 106, 255, 0.83)',
                                                        backgroundColor: 'rgba(0, 106, 255, 0.04)'
                                                    }
                                                }}
                                            >
                                                <input {...getInputProps()} />

                                                {video ? (
                                                    <ReactPlayer
                                                        url={URL.createObjectURL(video)}
                                                        controls
                                                        width="100%"
                                                        height="200px"
                                                        style={{ borderRadius: '8px' }}
                                                    />
                                                ) : videoPreview ? (
                                                    <ReactPlayer
                                                        url={videoPreview}
                                                        controls
                                                        width="100%"
                                                        height="200px"
                                                        style={{ borderRadius: '8px' }}
                                                    />
                                                ) : (
                                                    <>
                                                        <PublishIcon style={{
                                                            fontSize: '40px',
                                                            color: '#8e9ea6',
                                                            marginBottom: '12px'
                                                        }} />
                                                        <Typography variant="body2" style={{ color: '#8e9ea6' }}>
                                                            Drag & drop workout video or click to upload
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Intensity & Duration Section */}
                                        <Grid container spacing={3} style={{ marginTop: '16px' }}>
                                            <Grid item xs={12} md={8}>
                                                <FormControl component="fieldset">
                                                    <Typography
                                                        variant="subtitle2"
                                                        style={{
                                                            color: 'rgba(0, 106, 255, 0.83)',
                                                            fontWeight: 600,
                                                            marginBottom: '12px'
                                                        }}
                                                    >
                                                        Intensity Level
                                                    </Typography>

                                                    <RadioGroup row value={intensity}>
                                                        {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                                            <FormControlLabel
                                                                key={level}
                                                                value={level}
                                                                control={
                                                                    <Radio
                                                                        style={{ color: 'rgba(0, 106, 255, 0.83)' }}
                                                                        checkedIcon={<FiberManualRecordIcon />}
                                                                    />
                                                                }
                                                                label={level}
                                                                labelPlacement="bottom"
                                                                style={{
                                                                    marginRight: '24px',
                                                                    backgroundColor: intensity === level ? 'rgba(0, 106, 255, 0.08)' : 'transparent',
                                                                    borderRadius: '8px',
                                                                    padding: '8px 16px'
                                                                }}
                                                                onClick={(e) => setIntensity(e.target.value)}
                                                            />
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Duration"
                                                    variant="filled"
                                                    type="number"
                                                    value={duration}
                                                    onChange={(e) => setDuration(e.target.value)}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">min</InputAdornment>,
                                                        style: {
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f8faff'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>
                                </DialogContent>

                                <DialogActions style={{ padding: '16px 24px' }}>
                                    <Button
                                        onClick={handleCloseEdit}
                                        style={{
                                            backgroundColor: 'rgba(0, 106, 255, 0.83)',
                                            color: 'white',
                                            textTransform: 'none',
                                            padding: '8px 24px',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 97, 233, 0.83)',
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={UpdateHandler}
                                        style={{
                                            backgroundColor: 'rgba(0, 106, 255, 0.83)',
                                            color: 'white',
                                            textTransform: 'none',
                                            padding: '8px 24px',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 85, 204, 0.83)'
                                            }
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </React.Fragment>
                    </Container>

                </Grid>

                <Grid item xs={3}>
                    <SideNotoficationPanel />
                </Grid>
            </Grid>
            </div>
        </>

    )
}

export default WorkoutPlanPostView
