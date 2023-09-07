import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import pencilBackground from './assets/images/pencils.png';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
// import logo from './assets/images/teacher.png'
import Swal from "sweetalert2";

const Register = () => {
    // const navigate = useNavigate();
    const [name, setName] =useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [values, setValues] = useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    const onChangeName = (event) =>{
        setName(event.target.value);
    }
    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const resetInputs = () => {
        setName("");
        setEmail("");
        setPassword("");
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const CheckInputs = () => {
        if (name == "") {
            Swal.fire({
                icon: 'warning',
                text: 'Please Enter Name'
            })
            return false
        }
        else if (email == "") {
            Swal.fire({
                icon: 'warning',
                text: 'Please Enter Email'
            })
            return false
        }
        else if (password == "") {
            Swal.fire({
                icon: 'warning',
                text: 'Please Enter Password'
            })
            return false
        }
        else {
            return true
        }
    }
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = async (event) => {

        event.preventDefault();

        if (CheckInputs()) {
                const newUser={
                    name: name,
                    email: email,
                    password: password,
                }
                Swal.fire({
                    title: "Please Wait",
                    text: "Regetering",
                    backdrop: "true",
                    position: "center",
                    allowOutsideClick: false,
                })
                Swal.showLoading()
                const registerResponse = await axios.post("http://localhost:4000/register",newUser)
                    .then(res => {
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'User Added Successfully'
                        })
                        // ClearForm()
                        navigate('/') //going to login page
                    })
                    .catch(err => {
                        console.log(err)
                        Swal.fire({
                            icon: 'error',
                            title: err.response.data.message
                        })
                    })

            }

    };


    return (
        <Grid style={{

            width: '100%',
            height: '830px',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            
        }}>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Grid align='center' >

                <Box
                    sx={{
                        width: 500,
                        height: 310,
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        overflow: 'hidden',
                        borderRadius: '15px',
                        boxShadow: 15,
                        fontWeight: 'bold',
                        backgroundImage: {pencilBackground}
                    }}
                >
                    <Box
                        sx={{
                            width: 500,
                            height: 225,
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            bgcolor: 'background.paper',
                            overflow: 'hidden',
                            borderRadius: '8px',
                            boxShadow: 3,
                            fontWeight: 'bold',
                        }}
                    >
                        <br></br>
                        <div align="center">
                            <TextField sx={{ m: 1, width: '40ch' }}
                                id="input-with-icon-textfield"
                                label="Name"
                                size='small'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                value={name}
                                onChange={(event) => { setName(event.target.value) }}
                            />
                        </div>

                        <div align="center">
                            <TextField sx={{ m: 1, width: '40ch' }}
                                id="input-with-icon-textfield"
                                label="Email"
                                size='small'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailOutlineIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                value={email}
                                onChange={(event) => { setEmail(event.target.value) }}
                            />
                        </div>

                        <div align="center">
                            <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) => { setPassword(event.target.value) }}
                                    size="small"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                        </div>
                    </Box>
                    <br></br>
                    <Box
                        sx={{
                            width: 430,
                            height: 50,
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            bgcolor: '#7fd982',
                            overflow: 'hidden',
                            borderRadius: '25px',
                            boxShadow: 1,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#7fd982',
                                // opacity: [0.9, 0.8, 0.7],
                                boxShadow: 5,
                            },
                        }}
                        onClick={onSubmit}
                    >
                        <p>
                            <font color="white">
                                Register
                            </font>
                        </p>
                    </Box>
                </Box>
            </Grid>
        </Grid >
    );
};

export default Register;
