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
        "rgba(255, 240, 253, 1.0)",
        "rgba(255, 179, 186, 1.0)",
        "rgba(255, 223, 186, 1.0)",
        "rgba(255, 255, 186, 1.0)",
        "rgba(186, 255, 201, 1.0)",
        "rgba(186, 255, 255, 1.0)",
        "rgba(168, 230, 207, 1.0)",
        "rgba(220, 237, 193, 1.0)",
        "rgba(255, 211, 182, 1.0)",
        "rgba(255, 170, 165, 1.0)",
        "rgba(255, 139, 148, 1.0)",
        "rgba(255, 312, 229, 1.0)",
        "rgba(212, 255, 234, 1.0)",
        "rgba(238, 203, 255, 1.0)",
        "rgba(254, 255, 163, 1.0)",
        "rgba(219, 220, 255, 1.0)",
    ]

    useEffect(() => {
        let username = post['username']
        let hash = 0;
        for (let i = 0, len = username.length; i < len; i++) {
            let chr = username.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        setBackgroundColor(pastels[Math.abs(hash) % 20]);

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
                    {post['username']}
                </Typography>
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