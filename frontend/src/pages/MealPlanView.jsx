import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import MealPlanViewPageStyle from '../styles/MealPlanViewPageStyle.module.css';
import Box from '@mui/joy/Box';
//import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import IconButton from '@mui/joy/IconButton';
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from 'react-bootstrap/Button';
import { Link as CustomLink } from 'react-router-dom';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';

//transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const MealPlanView = () => {
  //comment box
  const [italic, setItalic] = useState(false);
  const [fontWeight, setFontWeight] = useState('normal');
  const [anchorEl, setAnchorEl] = useState(null);

  //dialog box in deletePost
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');
  const [name, setName] = useState('');

  const { mealplanId } = useParams();
  const [mealPlanData, setmealPlanData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);
  const navigate = useNavigate();

  //like
  const [userLiked, setUserLiked] = useState(false);
  const [isLike, setIsLike] = useState();
  const [openLike, setOpenLike] = useState(false);

  //add a comment
  const [commentString, setComment] = useState('');
  const [sendComment, setsendComment] = useState(false);

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

  console.log(mealplanId.id);

  const deleteHandler = () => {
    axios
      .delete(`http://localhost:8080/api/user/mealplan/${mealplanId}`)
      .then((response) => {
        console.log('MealPlan deleted successfully!' + response);
        navigate('/myprofile');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const addCommentHandler = async () => {
    console.log(commentString);
    const commentOb = {
      userId: storedUserInfo.id,
      name: storedUserInfo.userName,
      comment: commentString,
    };
    console.log(commentOb);
    await axios
      .put(
        `http://localhost:8080/api/user/mealplan/comments/${mealplanId}`,
        commentOb
      )
      .then((response) => {
        setsendComment(true);
        console.log('Comment updated successfully!' + response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const likeHandler = async () => {
    const likeOb = {
      userId: storedUserInfo.id,
      name: storedUserInfo.userName,
    };

    console.log(likeOb);
    await axios
      .put(`http://localhost:8080/api/user/mealplan/like/${mealplanId}`, likeOb)
      .then((response) => {
        console.log('liked successfully!' + response);
        setIsLike(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const UnLikeHandler = async () => {
    const unlikeOb = {
      userId: storedUserInfo.id,
      name: storedUserInfo.userName,
    };

    console.log(unlikeOb);
    await axios
      .put(
        `http://localhost:8080/api/user/mealplan/unlike/${mealplanId}`,
        unlikeOb
      )
      .then((response) => {
        console.log('UnLiked successfully!' + response);
        setIsLike(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  //useEffect
  useEffect(() => {
    const fetchDataAndCheckLike = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/user/mealplan/${mealplanId}`
        );

        setmealPlanData(response.data);

        const isLikedByUser = response.data.likes.some(
          (like) => like.userId === storedUserInfo.id
        );
        setUserLiked(isLikedByUser);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchDataAndCheckLike();
  }, [isLike, sendComment]);

  return (

    <div style={{
      // background: 'linear-gradient(135deg, #E0F7FA, #80DEEA, #4FC3F7, #29B6F6, #039BE5)',
      background: 'rgba(111, 204, 250, 0.6)',
      minHeight: '100vh',
      marginTop: '50px'
    }}>
      <NavBar />

      <div className={MealPlanViewPageStyle.bodyDivPostView}>
        <Row>
          {/* Left Side */}
          <Col xs={5}>
            <Card
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                marginTop: '20px',
                marginLeft: '20px',
                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                backgroundColor: '#fafafa',
              }}
            >
              <div style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                <Row className="mb-3">
                  <Col>
                    <div
                      style={{
                        backgroundImage: `url(${mealPlanData.mealsPicURL})`,
                        backgroundColor: '#e6e4d2',
                        height: '250px',
                        width: '100%',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h2 style={{ fontWeight: '600', fontSize: '1.6rem' }}>
                      {mealPlanData.title}
                    </h2>
                    <p style={{ color: '#666', fontSize: '1rem' }}>
                      Category: {mealPlanData.category}
                    </p>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col className="text-end">
                    {mealPlanData.userId === storedUserInfo.id && (
                      <>
                        <CustomLink to={`/mealplan/read/update/${mealPlanData.id}`}>
                          <Button style={{ marginRight: '10px', background: "white", color: "blue" }}>
                            Edit
                          </Button>
                        </CustomLink>
                        <Button style={{ background: "white", color: "red", border: "1px solid red" }} onClick={handleClickOpen}>
                          Delete
                        </Button>
                      </>
                    )}
                    <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>Do you really want to delete the Meal Plan?</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          <span style={{ color: 'red' }}>
                            This action cannot be undone.
                          </span>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button onClick={deleteHandler} color="error">
                          Agree
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Col>
                </Row>

                <Row className="mt-4 align-items-center">
                  <Col xs={1}>
                    <IconButton onClick={userLiked ? UnLikeHandler : likeHandler}>
                      {userLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                    </IconButton>
                  </Col>
                  <Col>
                    <Button
                      variant="text"
                      onClick={handleLikeClickOpen}
                      style={{ fontSize: '1rem', color: '#333' }}
                    >
                      ({mealPlanData.likes?.length}) likes
                    </Button>

                    <Dialog
                      open={openLike}
                      onClose={handleLikeClickClose}
                      fullWidth
                      maxWidth="xs"
                    >
                      <DialogTitle style={{ textAlign: 'center' }}>Likes</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          {mealPlanData.likes?.map((row, i) => (
                            <Row
                              key={i}
                              style={{
                                background: '#f4f4f4',
                                margin: '10px 0',
                                padding: '8px 12px',
                                borderRadius: '8px',
                              }}
                            >
                              <Col>{row.name}</Col>
                            </Row>
                          ))}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleLikeClickClose}>OK</Button>
                      </DialogActions>
                    </Dialog>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          {/* Right Side */}
          <Col>
            <Card
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                marginTop: '20px',
                marginRight: '20px',
                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ padding: '24px' }}>
                <Row className="mb-3">
                  <Col>
                    <h4 style={{ fontWeight: '600' }}>Meals</h4>
                  </Col>
                </Row>

                {mealPlanData.meals?.map((row, index) => (
                  <Card
                    key={index}
                    style={{
                      marginBottom: '16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6"><b>Name:</b> {row.name}</Typography>
                      <Typography><b>Ingredients:</b> {row.ingredients.join(', ')}</Typography>
                      <Typography><b>Instructions:</b> {row.instructions}</Typography>
                      <Typography><b>Size:</b> {row.size}</Typography>
                      <Typography><b>Nutritious:</b> {row.nutritious.join(', ')}</Typography>
                    </CardContent>
                  </Card>
                ))}

                <div
                  style={{
                    borderTop: '1px solid #e0e0e0',
                    marginTop: '20px',
                    paddingTop: '20px',
                  }}
                >
                  <h4>Comments ({mealPlanData.comments?.length})...</h4>
                  <FormControl fullWidth>
                    <Textarea
                      placeholder="Type something here…"
                      minRows={3}
                      value={commentString}
                      onChange={(e) => setComment(e.target.value)}
                      endDecorator={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            borderTop: '1px solid #ccc',
                            pt: 2,
                          }}
                        >
                          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <FormatBold />
                            <KeyboardArrowDown fontSize="md" />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                          >
                            {['200', 'normal', 'bold'].map((weight) => (
                              <MenuItem
                                key={weight}
                                selected={fontWeight === weight}
                                onClick={() => {
                                  setFontWeight(weight);
                                  setAnchorEl(null);
                                }}
                              >
                                {weight === '200' ? 'Lighter' : weight}
                              </MenuItem>
                            ))}
                          </Menu>
                          <IconButton
                            color={italic ? 'primary' : 'default'}
                            onClick={() => setItalic((bool) => !bool)}
                          >
                            <FormatItalic />
                          </IconButton>
                          <Button variant="contained" onClick={addCommentHandler}>
                            Send
                          </Button>
                        </Box>
                      }
                      sx={{
                        fontWeight,
                        fontStyle: italic ? 'italic' : 'normal',
                      }}
                    />
                  </FormControl>

                  {mealPlanData.comments?.map((row, i) => (
                    <Row
                      key={i}
                      style={{
                        padding: '16px',
                        margin: '16px 0',
                        borderRadius: '12px',
                        background: '#f9f9f9',
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
                      }}
                    >
                      <Col xs={8}>
                        <p style={{ color: '#6200ea', fontWeight: 600 }}>{row.name}</p>
                        <p>{row.comment}</p>
                      </Col>
                      <Col className="text-end">
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>



    </div>
  );
};

export default MealPlanView;
