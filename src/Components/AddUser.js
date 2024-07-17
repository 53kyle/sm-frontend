import { Fragment, useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";

import API from "../API/APIInterface";

function AddUser( { setUser, toggleNewUser } ) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState("")
    const [usernameMessageColor, setUsernameMessageColor] = useState('green')
    const [errorMessage, setErrorMessage] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [bioError, setBioError] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const handleEmailChange = event => {
        if (emailError) {
            setEmailError(false);
        }
        setEmail(event.target.value);
    };

    const handleUsernameChange = event => {
        if (usernameError) {
            setUsernameError(false);
        }
        setUsername(event.target.value);
    };

    const handlePasswordChange = event => {
        if (passwordError) {
            setPasswordError(false);
        }
        setPassword(event.target.value);
    };

    const handleBioChange = event => {
        if (bioError) {
            setBioError(false);
        }
        setBio(event.target.value);
    };

    const handleCloseErrorDialog = () => {
        setErrorDialogOpen(false);
        setErrorMessage("");
    }

    const validate = () => {
        if (username === "") {
            setUsernameError(true);
            setErrorMessage("Username cannot be blank.")
            return false;
        }
        else if (!validUsername) {
            setUsernameError(true);
            setErrorMessage(`${username} is already in use.`)
            return false;
        }
        else if (username.indexOf(' ') >= 0) {
            setUsernameError(true);
            setErrorMessage("Username cannot contain spaces.")
            return false;
        }
        else if (email === "") {
            setEmailError(true);
            setErrorMessage("Email cannot be blank.")
            return false;
        }
        else if (email.indexOf(' ') >= 0) {
            setEmailError(true);
            setErrorMessage("Email cannot contain spaces.")
            return false;
        }
        else if (bio.length > 140) {
            setBioError(true);
            setErrorMessage("Bio cannot be more than 140 characters.")
            return false;
        }
        else if (password === "") {
            setPasswordError(true);
            setErrorMessage("Password cannot be blank.")
            return false;
        }
        return true;
    }

    const handleClickRegisterUser = () => {
        if (!validate()) {
            setErrorDialogOpen(true);
            return;
        }
        async function login() {
            try {
                const api = new API();

                const params = {
                    "username": username,
                    "password": password
                };

                const loginResponse = await api.login(params);

                setUser(loginResponse.data);

            } catch (error) {
                console.error("Error logging in:", error);
            }
        }

        async function registerUser() {
            try {
                const api = new API();

                const params = {
                    "username": username,
                    "email": email,
                    "bio": bio || "null",
                    "password": password
                };

                const registerUserResponse = await api.registerUser(params);

                if (registerUserResponse.data) {
                    login()
                        .then((value) => {
                            toggleNewUser();
                        });
                }

            } catch (error) {
                console.error("Error registering user:", error);
            }
        }

        registerUser();
    };

    useEffect(() => {
        async function fetchData() {

            try {
                if (username.length > 0) {
                    const api = new API();

                    const userResponse = await api.user(username);

                    if (userResponse.data[0]) {
                        setUsernameMessage("Username is already in use :(");
                        setUsernameMessageColor("red");
                        setValidUsername(false);
                    }
                    else {
                        setUsernameMessage("Username is available :)");
                        setUsernameMessageColor("green");
                        setValidUsername(true)
                    }
                }
                else {
                    setUsernameMessage("")
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    },[username]);

    return (
        <Fragment>
            <Box sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "auto"
            }}>
                <Typography variant="h3" fontWeight='fontWeightBold' sx={{
                    mt: 9.3
                }}>
                    <div style={{userSelect: "none"}}>Simple Social</div>
                </Typography>
                <Typography variant="h6">
                    <div style={{userSelect: "none"}}>Welcome to Simple Social!</div>
                </Typography>
                <Typography variant="body" sx={{
                    mt: usernameMessage.count > 0 ? 2 : 5
                }}>
                    <div style={{userSelect: "none", color: usernameMessageColor}}>{usernameMessage}</div>
                </Typography>
                <TextField
                    error={ usernameError }
                    id="username-field-2"
                    label="Username"
                    placeholder=""
                    value={ username }
                    helperText=""
                    onChange={ handleUsernameChange }
                    sx={{
                        mt: username.length > 0 ? 2 : 4.3
                    }}
                />
                <TextField
                    error={ emailError }
                    id="email-field"
                    label="Email"
                    placeholder=""
                    value={ email }
                    helperText=""
                    onChange={ handleEmailChange }
                    sx={{
                        mt: 2
                    }}
                />
                <TextField
                    error={ passwordError }
                    id="password-field-2"
                    type="password"
                    label="Password"
                    placeholder=""
                    value={ password }
                    helperText=""
                    onChange={ handlePasswordChange }
                    sx={{
                        mt: 2
                    }}
                />
                <TextField
                    error={ bioError }
                    id="bio-field"
                    multiline
                    label="Bio"
                    placeholder=""
                    value={ bio }
                    helperText=""
                    onChange={ handleBioChange }
                    sx={{
                        mt: 2
                    }}
                />
                <Typography variant="body" color={ bio.length <= 140 ? 'black' : 'red' } sx={{
                    mt: 2
                }} >
                    { `${ 140 - bio.length } characters remaining.` }
                </Typography>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={ handleClickRegisterUser }
                    sx={{
                        mt: 2
                    }}
                >
                    Sign Up
                </Button>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={ toggleNewUser }
                    sx={{
                        mt: 2
                    }}
                >
                    Already Have an Account?
                </Button>
            </Box>
            <Dialog
                open={ errorDialogOpen }
                onClose={ handleCloseErrorDialog }
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {
                        "Error"
                    }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {
                            errorMessage
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ handleCloseErrorDialog }>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default AddUser