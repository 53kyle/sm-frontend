/*
    ReadOnlyPost is a lightweight version of Post, which doesn't display likes or dislikes, and doesn't allow any interaction
    by the user.
 */

import {useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";

import ReplyIcon from '@mui/icons-material/Reply';

import API from "../API/APIInterface";
import DateHelper from "../Utils/DateHelper";
import GetPastelFromString from "../Utils/ColorPicker";

function ReadOnlyPost({ post }) {
    const [backgroundColor, setBackgroundColor] = useState("rgba(255, 255, 255, 1.0)");
    // parentPost corresponds to the post to which the current post is replying to, if any.
    const [parentPost, setParentPost] = useState(undefined);

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
                <Typography variant="h6" sx={{
                    mt: post['reply_to'] ? 0 : 2,
                    ml: 2,
                    mr: 2
                }} >
                    {
                        post['username']
                    }
                </Typography>
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