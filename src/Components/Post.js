import {Fragment, useEffect, useState} from "react";
import {Box, IconButton, Typography, ButtonBase} from "@mui/material";
import DateHelper from "../Utils/DateHelper";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ReplyIcon from '@mui/icons-material/Reply';
import Divider from "@mui/material/Divider";
import API from "../API/APIInterface";

function Post( { post, topLevelRefresh, setReplyTo, user, setFilter, setFilterType, handlePushFilterHistory } ) {
    const [liked, setLiked] = useState(false);
    const [numLiked, setNumLiked] = useState(0);
    const [disliked, setDisliked] = useState(false);
    const [numDisliked, setNumDisliked] = useState(0);
    const [refresh, setRefresh] = useState(false);
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
        async function getLikeStatus() {
            try {
                const api = new API();

                const didLikeResponse = await api.didLikePost(post['post_id'], user['username']);

                setLiked(!!didLikeResponse.data[0])

                const didDislikeResponse = await api.didDislikePost(post['post_id'], user['username']);

                setDisliked(!!didDislikeResponse.data[0])

                const likesResponse = await api.postLikes(post['post_id']);

                setNumLiked(likesResponse.data);

                const dislikesResponse = await api.postDislikes(post['post_id']);

                setNumDisliked(dislikesResponse.data);

            } catch (error) {
                console.error("Error adding like:", error);
            }
        }

        getLikeStatus()
    }, [refresh, topLevelRefresh, post]);

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

    const handleClickLike = () => {
        async function addLike() {
            try {
                const api = new API();

                const params = {
                    "parent_post_id": post['post_id'],
                    "username": user['username']
                };

                const addLikeResponse = await api.addPostLike(post['post_id'], params);

            } catch (error) {
                console.error("Error adding like:", error);
            }
        }

        addLike().then((value) => {
            setRefresh(!refresh)
        });
    }

    const handleClickDislike = () => {
        async function addDislike() {
            try {
                const api = new API();

                const params = {
                    "parent_post_id": post['post_id'],
                    "username": user['username']
                };

                const addDislikeResponse = await api.addPostDislike(post['post_id'], params);

            } catch (error) {
                console.error("Error adding dislike:", error);
            }
        }

        addDislike().then((value) => {
            setRefresh(!refresh)
        });
    }

    const handleClickReply = () => {
        setReplyTo(post);
    }

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
                ml: 3,
                mr: 3,
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
                        <ButtonBase disableRipple onClick={() => {
                            handlePushFilterHistory()
                            setFilter(post['reply_to']);
                            setFilterType("replies")
                        }} >
                            <Typography variant="body1" sx={{
                                mt: 2,
                                ml: 2,
                                mr: 2,
                                color: "rgba(0, 0, 0, 0.5)",
                                wordWrap: "break-word"
                            }} >
                                {
                                    parentPost['username']
                                }
                            </Typography>
                        </ButtonBase>
                    </Box>
                }
                <ButtonBase disableRipple onClick={() => {
                    handlePushFilterHistory()
                    setFilter(post['username']);
                    setFilterType("user")
                }} >
                    <Typography variant="h6" sx={{
                        mt: post['reply_to'] ? 0 : 2,
                        ml: 2,
                        mr: 2,
                        wordWrap: "break-word"
                    }} >
                        {post['username']}
                    </Typography>
                </ButtonBase>
            </Box>
            <ButtonBase disableRipple onClick={() => {
                handlePushFilterHistory();
                setFilter(post['post_id']);
                setFilterType("replies")
            }} >
                <Typography variant="body1" textAlign="start" sx={{
                    ml: 2,
                    mr: 2
                }} >
                    {post['content']}
                </Typography>
            </ButtonBase>
            <Typography variant="caption" sx={{
                ml: 2,
                mr: 2
            }}>
                {`${DateHelper.shortDateFormat(post['datetime_posted'])} at ${DateHelper.friendlyTimeFormat(post['datetime_posted'])}`}
            </Typography>
            <Divider sx={{
                width: "100%",
                mt: 2,
                mb: 2
            }} />
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                mb: 2
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "start",
                    width: "50%",
                    ml: 2
                }}>
                    <IconButton aria-label="like" size="small" onClick={handleClickLike}>
                        {
                            liked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />
                        }
                    </IconButton>
                    <Typography variant="body" sx={{
                        ml: 2,
                        mr: 2
                    }}>
                        {numLiked - numDisliked}
                    </Typography>
                    <IconButton aria-label="dislike" size="small" onClick={handleClickDislike} sx={{
                        mr: 2
                    }}>
                        {
                            disliked ? <ThumbDownAltIcon fontSize="small" /> : <ThumbDownOffAltIcon fontSize="small" />
                        }
                    </IconButton>
                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "end",
                    width: "50%",
                    mr: 2
                }}>
                    <IconButton aria-label="reply" size="small" onClick={handleClickReply} sx={{
                        ml: 2
                    }}>
                        <ReplyIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}

export default Post