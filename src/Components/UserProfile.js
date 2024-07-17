/*
    UserProfile displays information about a given user, including their username and bio.

    This would be expanded with further development to include things like profile pictures.
 */

import { Fragment, useEffect, useState } from "react";
import { Button, Divider, Typography } from "@mui/material";

import API from "../API/APIInterface";

function UserProfile({ user, username }) {
    const [userProfile, setUserProfile] = useState(undefined);
    const [following, setFollowing] = useState(false);
    // User has its own 'refresh' state variable so that when the user follows or unfollows another user its following
    // status can be refreshed separately from refreshing posts.
    const [refresh, setRefresh] = useState(false);

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

        getUser()

    }, [user, username, refresh]);

    return (
        <Fragment>
            <Typography variant="h4" sx={{
                ml: 2,
                mr: 2,
                mb: userProfile && userProfile['bio'] != 'null' ? 0 : 3
            }}>
                {username}
            </Typography>
            {
                userProfile && userProfile['bio'] != 'null' &&
                <Fragment>
                    <Typography variant="body" sx={{
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
                    <Button variant={ following ? "contained" : "outlined" } sx={{
                        mb: 3
                    }} onClick={ handleClickFollow }>{ following ? "Following" : "Follow" }</Button>
                </Fragment>
            }
            <Divider sx={{
                width: "100%",
                mb: 3
            }} >POSTS</Divider>
        </Fragment>
    );
}

export default UserProfile