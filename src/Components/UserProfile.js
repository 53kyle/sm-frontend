import {Typography} from "@mui/material";
import Divider from "@mui/material/Divider";
import {Fragment, useEffect, useState} from "react";
import API from "../API/APIInterface";

function UserProfile({ username }) {
    const [user, setUser] = useState(undefined)

    useEffect(() => {
        if (!username) {
            return;
        }

        async function getUser() {
            try {
                const api = new API();

                const userResponse = await api.user(username);

                setUser(userResponse.data[0])

            } catch (error) {
                console.error("Error getting parent post:", error);
            }
        }

        getUser()

    }, [username]);

    return (
        <Fragment>
            <Typography variant="h4" sx={{
                ml: 2,
                mr: 2,
                mb: user && user['bio'] != 'null' ? 0 : 3
            }}>
                {username}
            </Typography>
            {
                user && user['bio'] != 'null' &&
                <Fragment>
                    <Typography variant="body" sx={{
                        ml: 2,
                        mr: 2,
                        mb: 3
                    }}>
                        {user['bio']}
                    </Typography>
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