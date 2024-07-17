/*
    Post is a reusable component, which displays the poster's username, the contents of the post, the date at which it
    was posted, the username of the post the poster was replying to (if any), and the difference of likes and dislikes
    it received.

    Additionally, a Post has buttons at the bottom for liking or disliking the post, or replying to it.
 */

import { useEffect, useState } from "react";
import { Box, ButtonBase, Divider, IconButton, Typography } from "@mui/material";

import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ReplyIcon from '@mui/icons-material/Reply';

import API from "../API/APIInterface";
import DateHelper from "../Utils/DateHelper";
import GetPastelFromString from "../Utils/ColorPicker";


function Post({ post, topLevelRefresh, setReplyTo, user, setFilter, setFilterType, handlePushFilterHistory }) {
    const [liked, setLiked] = useState(false);
    const [numLiked, setNumLiked] = useState(0);
    const [disliked, setDisliked] = useState(false);
    const [numDisliked, setNumDisliked] = useState(0);
    // Post has its own 'refresh' state variable so that when the user likes or dislikes a post, its like/dislike counts
    // can be refreshed separately from other posts.
    const [refresh, setRefresh] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("rgba(255, 255, 255, 1.0)");
    // parentPost corresponds to the post to which the current post is replying to, if any.
    const [parentPost, setParentPost] = useState(undefined);

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
    }, [user, refresh, topLevelRefresh, post]);

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

    const handleClickLike = () => {
        async function addLike() {
            try {
                const api = new API();

                const params = {
                    "parent_post_id": post['post_id'],
                    "username": user['username']
                };

                await api.addPostLike(post['post_id'], params);

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

                await api.addPostDislike(post['post_id'], params);

            } catch (error) {
                console.error("Error adding dislike:", error);
            }
        }

        addDislike().then((value) => {
            setRefresh(!refresh)
        });
    }

    // Setting replyTo indicates to Home that AddUser interface should be displayed.
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
                        {
                            post['username']
                        }
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
                    {
                        post['content']
                    }
                </Typography>
            </ButtonBase>
            <Typography variant="caption" sx={{
                ml: 2,
                mr: 2
            }}>
                {
                    `${DateHelper.shortDateFormat(post['datetime_posted'])} at ${DateHelper.friendlyTimeFormat(post['datetime_posted'])}`
                }
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
                        {
                            numLiked - numDisliked
                        }
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