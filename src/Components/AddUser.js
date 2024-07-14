import API from "../API/APIInterface";
import {Fragment, useEffect, useState} from "react";
import {Box, Button, TextField, Typography} from "@mui/material";

function AddUser( { setUser, toggleNewUser } ) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");

    const handleEmailChange = event => {
        setEmail(event.target.value);
    };

    const handleUsernameChange = event => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = event => {
        setPassword(event.target.value);
    };

    const handleBioChange = event => {
        setBio(event.target.value);
    };

    const handleClickRegisterUser = () => {
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
                console.log(registerUserResponse.data);

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
                const api = new API();

                const usersResponse = await api.allUsers();
                console.log(usersResponse.data)

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
                <Typography variant="h2" fontWeight='fontWeightBold' sx={{
                    mt: 9.3
                }}>
                    <div style={{userSelect: "none"}}>Simple Social</div>
                </Typography>
                <Typography variant="h5">
                    <div style={{userSelect: "none"}}>Welcome to Simple Social!</div>
                </Typography>
                <Typography variant="body" sx={{
                    mt: 5
                }}>
                    <div style={{userSelect: "none"}}>{username.length > 0 ? "Username Available!" : ""}</div>
                </Typography>
                <TextField
                    id="username-field-2"
                    label="Username"
                    placeholder=""
                    value={username}
                    helperText=""
                    onChange={handleUsernameChange}
                    sx={{
                        mt: username.length > 0 ? 2 : 4.3
                    }}
                />
                <TextField
                    id="email-field"
                    label="Email"
                    placeholder=""
                    value={email}
                    helperText=""
                    onChange={handleEmailChange}
                    sx={{
                        mt: 2
                    }}
                />
                <TextField
                    id="password-field-2"
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
                <TextField
                    id="bio-field"
                    multiline
                    label="Bio"
                    placeholder=""
                    value={bio}
                    helperText=""
                    onChange={handleBioChange}
                    sx={{
                        mt: 2
                    }}
                />
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={handleClickRegisterUser}
                    sx={{
                        mt: 2
                    }}
                >Sign Up</Button>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={toggleNewUser}
                    sx={{
                        mt: 2
                    }}
                >Already Have an Account?</Button>
            </Box>
        </Fragment>
    );
}

export default AddUser