import API from "../API/APIInterface";
import {Fragment, useEffect, useState} from "react";
import {Box, Button, TextField, Typography} from "@mui/material";

function Login( { setUser, toggleNewUser } ) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = event => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = event => {
        setPassword(event.target.value);
    };

    const handleClickLogin = () => {
        async function login() {
            try {
                const api = new API();

                const params = {
                    "username": username,
                    "password": password
                };

                const loginResponse = await api.login(params);
                console.log(loginResponse.data);

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
                <Typography variant="h2" fontWeight='fontWeightBold' sx={{
                    mt: 9.3
                }}>
                    <div style={{userSelect: "none"}}>Simple Social</div>
                </Typography>
                <Typography variant="h5">
                    <div style={{userSelect: "none"}}>Welcome to Simple Social!</div>
                </Typography>
                <TextField
                    id="username-field"
                    label="Username"
                    placeholder=""
                    value={username}
                    helperText=""
                    onChange={handleUsernameChange}
                    sx={{
                        mt: 9.3
                    }}
                />
                <TextField
                    id="password-field"
                    type="password"
                    label="Password"
                    placeholder=""
                    value={password}
                    helperText=""
                    onChange={handlePasswordChange}
                    sx={{
                        mt: 2
                    }}
                />
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={handleClickLogin}
                    sx={{
                        mt: 2
                    }}
                >Log In</Button>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={toggleNewUser}
                    sx={{
                        mt: 2
                    }}
                >Sign Up</Button>
            </Box>
        </Fragment>
    );
}

export default Login