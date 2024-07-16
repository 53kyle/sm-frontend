import {Fragment, useEffect, useState} from "react";
import {Box, IconButton, Typography} from "@mui/material";
import DateHelper from "../Utils/DateHelper";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ReplyIcon from '@mui/icons-material/Reply';
import Divider from "@mui/material/Divider";
import API from "../API/APIInterface";

function ReadOnlyPost( { post } ) {
    const [backgroundColor, setBackgroundColor] = useState("rgba(255, 255, 255, 1.0)");
    const [parentPost, setParentPost] = useState(undefined);

    const pastels = [
        "rgba(253, 223, 223, 1.0)",
        "rgba(252, 247, 222, 1)",
        "rgba(222, 253, 222, 1.0)",
        "rgba(222, 243, 253, 1.0)",
        "rgba(255, 240, 253, 1.0)"
    ]

    useEffect(() => {
        setBackgroundColor(pastels[Math.floor(Math.random() * pastels.length)])

        if (!post['reply_to']) {
            return;
        }
        async function getParentPost() {
            try {
                const api = new API();

                const postResponse = await api.post(post['reply_to']);

                setParentPost(postResponse.data)

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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "start",
                width: "100%"
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "start",
                    width: "50%"
                }}>
                    <Typography variant="h6" sx={{
                        mt: 2,
                        ml: 2,
                        mr: 2
                    }}>
                        {post['username']}
                    </Typography>
                </Box>
                {
                    parentPost &&
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "end",
                        width: "50%"
                    }}>
                        <ReplyIcon sx={{
                            color: 'gray',
                            mr: -1.5,
                            mb: -1
                        }}/>
                        <Typography variant="h6" sx={{
                            mt: 2,
                            ml: 2,
                            mr: 2,
                            color: 'gray'
                        }}>
                            {
                                parentPost[0]['username']
                            }
                        </Typography>
                    </Box>
                }
            </Box>
            <Typography variant="body" sx={{
                ml: 2,
                mr: 2
            }}>
                {post['content']}
            </Typography>
            <Typography variant="caption" sx={{
                ml: 2,
                mr: 2,
                mb: 2
            }}>
                {`${DateHelper.shortDateFormat(post['datetime_posted'])} at ${DateHelper.friendlyTimeFormat(post['datetime_posted'])}`}
            </Typography>
        </Box>
    );
}

export default ReadOnlyPost