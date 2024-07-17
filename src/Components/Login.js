import { Fragment, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";

import API from "../API/APIInterface";

function Login( { setUser, toggleNewUser } ) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

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
        else if (username.indexOf(' ') >= 0) {
            setUsernameError(true);
            setErrorMessage("Username cannot contain spaces.")
            return false;
        }
        else if (password === "") {
            setPasswordError(true);
            setErrorMessage("Password cannot be blank.")
            return false;
        }
        return true;
    }

    const handleClickLogin = () => {
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

        login();
    };

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
                <TextField
                    error={ usernameError }
                    id="username-field"
                    label="Username"
                    placeholder=""
                    value={ username }
                    helperText=""
                    onChange={ handleUsernameChange }
                    sx={{
                        mt: 9.3
                    }}
                />
                <TextField
                    error={ passwordError }
                    id="password-field"
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
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={ handleClickLogin }
                    sx={{
                        mt: 2
                    }}
                >
                    Log In
                </Button>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={ toggleNewUser }
                    sx={{
                        mt: 2
                    }}
                >
                    Sign Up
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

export default Login