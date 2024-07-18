/*
    ReadOnlyPost is a lightweight version of Post, which doesn't display likes or dislikes, and doesn't allow any interaction
    by the user.
 */

import {useEffect, useState} from "react";
import {Box, CircularProgress, Typography} from "@mui/material";

import ReplyIcon from '@mui/icons-material/Reply';

import API from "../API/APIInterface";
import DateHelper from "../Utils/DateHelper";
import GetPastelFromString from "../Utils/ColorPicker";
import GenericProfilePic from "../Generic-Profile-1600x1600.png";

function ReadOnlyPost({ post }) {
    const [backgroundColor, setBackgroundColor] = useState("rgba(255, 255, 255, 1.0)");
    // parentPost corresponds to the post to which the current post is replying to, if any.
    const [parentPost, setParentPost] = useState(undefined);
    const [profilePic, setProfilePic] = useState(undefined);
    const [refreshingProfilePic, setRefreshingProfilePic] = useState(false);

    useEffect(() => {
        setRefreshingProfilePic(true);

        async function getProfilePic() {
            try {
                const api = new API();

                const profilePicResponse = await api.getProfilePic(post['username']);

                setProfilePic(profilePicResponse.data);
                setRefreshingProfilePic(false);

            } catch (error) {
                console.error("Error getting profile pic:", error);
            }
        }

        getProfilePic()
    }, [post]);

    useEffect(() => {
        setBackgroundColor(GetPastelFromString(post['username']));

        if (!post['reply_to']) {
            setParentPost(undefined)
            return;
        }

        async function getParentPost() {
            try {
                const api = new API();

                const postResponse = await api.post(post['reply_to']);

                setParentPost(postResponse.data[0])

            } catch (error) {
                console.error("Error getting parent post:", error);
            }
        }

        getParentPost()
    }, [post]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "center",
                maxWidth: 600,
                border: 1,
                borderRadius: 5,
                borderColor: 'lightGray',
                backgroundColor: backgroundColor,
                mb: 3
            }}
        >
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "start",
                width: "100%"
            }}>
                {
                    post['reply_to'] && parentPost &&
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "end",
                        width: "100%"
                    }}>
                        <ReplyIcon fontSize="small" sx={{
                            color: "rgba(0, 0, 0, 0.5)",
                            mr: -1.5,
                            mt: 1.5
                        }}/>
                        <Typography variant="body" sx={{
                            mt: 2,
                            ml: 2,
                            mr: 2,
                            color: "rgba(0, 0, 0, 0.5)"
                        }} >
                            {
                                parentPost['username']
                            }
                        </Typography>
                    </Box>
                }
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "start",
                    width: "100%",
                    ml: 1.5,
                    mr: 1.5
                }}>
                    {
                        refreshingProfilePic ?
                            <CircularProgress color="inherit" sx={{
                                mt: 1.5,
                                ml: 0.5,
                                mr: 0.5,
                                mb: 1.5
                            }}/>
                            :
                            <div>
                                <img
                                    alt="not found"
                                    width={"50px"}
                                    height={"50px"}
                                    style={{
                                        width: 50,
                                        height: 50,
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
                    <Typography variant="h6" sx={{
                        mt: 0.75,
                        ml: 1,
                        wordWrap: "break-word"
                    }} >
                        {
                            post['username']
                        }
                    </Typography>
                </Box>
            </Box>
            <Typography variant="body" sx={{
                ml: 2,
                mr: 2
            }}>
                {
                    post['content']
                }
            </Typography>
            <Typography variant="caption" sx={{
                ml: 2,
                mr: 2,
                mb: 2
            }}>
                {
                    `${DateHelper.shortDateFormat(post['datetime_posted'])} at ${DateHelper.friendlyTimeFormat(post['datetime_posted'])}`
                }
            </Typography>
        </Box>
    );
}

export default ReadOnlyPost