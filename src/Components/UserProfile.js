/*
    UserProfile displays information about a given user, including their profile pic, username and bio.
 */

import {Fragment, useEffect, useRef, useState} from "react";
import {Box, Button, CircularProgress, Divider, Typography} from "@mui/material";

import API from "../API/APIInterface";

import GenericProfilePic from "../Generic-Profile-1600x1600.png"

function UserProfile({ user, username }) {
    const [userProfile, setUserProfile] = useState(undefined);
    const [following, setFollowing] = useState(false);
    // User has its own 'refresh' state variable so that when the user follows or unfollows another user its following
    // status can be refreshed separately from refreshing posts.
    const [refresh, setRefresh] = useState(false);
    const [profilePic, setProfilePic] = useState(undefined);
    const [refreshingProfilePic, setRefreshingProfilePic] = useState(false);

    const hiddenFileInput = useRef(null);

    const onImageChange = (e) => {
        setRefreshingProfilePic(true);
        async function changeProfilePic() {
            try {
                const api = new API();

                const params = {
                    username: user['username'],
                    image: e.target.files[0]
                }
                await api.changeProfilePic(user['username'], params);

                setRefresh(!refresh);

            } catch (error) {
                console.error("Error setting profile pic:", error);
            }
        }

        changeProfilePic()
    }

    const handleClickChangeChooseFile = () => {
        hiddenFileInput.current.click();
    }

    const handleClickFollow = () => {
        async function followUser() {
            try {
                const api = new API();

                const params = {
                    username: user['username'],
                    other_username: username
                }

                await api.addFollow(user['username'], params);

                setRefresh(!refresh);

            } catch (error) {
                console.error("Error getting parent post:", error);
            }
        }

        followUser()
    }

    useEffect(() => {
        if (!username) {
            return;
        }

        setRefreshingProfilePic(true);

        async function getProfilePic() {
            try {
                const api = new API();

                const profilePicResponse = await api.getProfilePic(username);

                setProfilePic(profilePicResponse.data);
                setRefreshingProfilePic(false);

            } catch (error) {
                console.error("Error getting profile pic:", error);
            }
        }

        async function getUser() {
            try {
                const api = new API();

                const userResponse = await api.user(username);

                // If the user being displayed is the logged-in user, we don't need or want a following status.
                if (user['username'] !== username) {
                    const followingResponse = await api.doesFollow(user['username'], userResponse.data[0]['username'])

                    setFollowing(followingResponse.data.length > 0)
                }

                setUserProfile(userResponse.data[0])
            } catch (error) {
                console.error("Error getting parent post:", error);
            }
        }

        getUser().then((value) => {
            getProfilePic()
        });

    }, [user, username, refresh]);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%"
        }}>
            <Typography variant="h4" sx={{
                ml: 2,
                mr: 2,
                mb: userProfile && userProfile['bio'] != 'null' ? 0 : 3
            }}>
                {username}
            </Typography>
            {
                refreshingProfilePic ?
                    <CircularProgress color="inherit" sx={{
                        mt: 6,
                        mb: 6,
                    }} />
                    :
                    <div>
                        <img
                            alt="not found"
                            width={"120px"}
                            height={"120px"}
                            style={{
                                width: 120,
                                height: 120,
                                marginTop: 10,
                                objectFit: "cover",
                                WebkitMaskImage: "radial-gradient(circle, black 50%, rgba(255, 255, 255, 0.0) 50%)",
                                maskImage: "radial-gradient(circle, black 50%, rgba(255, 255, 255, 0.0) 50%)",
                                maskSize: "160%",
                                maskPosition: "center"
                            }}
                            src={profilePic && profilePic.length > 0 ? profilePic[0]['image'] : GenericProfilePic}
                        />
                    </div>
            }
            {
                user['username'] === username &&
                <Fragment>
                    <Typography variant="body" sx={{
                        ml: 2,
                        mr: 2,
                        mt: 1,
                        mb: 1
                    }}>
                        Change Profile Picture:
                    </Typography>
                    <div>
                        <input type="file" id="fileSelect" accept="image/*" onChange={onImageChange}
                               ref={hiddenFileInput} style={{
                            display: "none"
                        }}/>
                        <Button
                            variant="outlined"
                            size="medium"
                            onClick={handleClickChangeChooseFile}
                        >
                            Choose a File...
                        </Button>
                    </div>
                </Fragment>
            }
            {
                userProfile && userProfile['bio'] != 'null' &&
                <Fragment>
                    <Typography variant="body" sx={{
                        mt: user['username'] === username ? 1 : 0,
                        ml: 2,
                        mr: 2,
                        mb: 3
                    }}>
                        {userProfile['bio']}
                    </Typography>
                </Fragment>
            }
            {
                user['username'] !== username &&
                <Fragment>
                    <Button variant={following ? "contained" : "outlined"} sx={{
                        mt: 3,
                        mb: 3
                    }} onClick={handleClickFollow}>{following ? "Following" : "Follow"}</Button>
                </Fragment>
            }
            <Divider sx={{
                width: "100%",
                mb: 3
            }}>POSTS</Divider>
        </Box>
    );
}

export default UserProfile