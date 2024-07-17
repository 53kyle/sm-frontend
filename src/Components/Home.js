/*
    After SearchAppBar, Home is the outermost user interface element. It consists of a back button for breadcrumb
    navigation, a "New Post" button, and a "Refresh" button.

    Additionally, PostList is contained within Home.
 */

import { useEffect, useState } from "react";
import { Box, CircularProgress, Fab, Modal } from "@mui/material";
import { AddCircle, ArrowBackIosNew, Refresh } from "@mui/icons-material";

import AddPost from "./AddPost";
import PostList from "./PostList";
import API from "../API/APIInterface";

// modalStyle corresponds to the style for the AddPost interface.
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 500,
    width: "flex",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 5
};

const goBackFabStyle = {
    position: 'absolute',
    top: 84,
    left: 16,
};

const newPostFabStyle = {
    position: 'absolute',
    top: 84,
    right: 80,
};

const refreshFabStyle = {
    position: 'absolute',
    top: 84,
    right: 16,
};

function Home( { user, filter, filterType, setFilter, setFilterType, filterHistory, handlePushFilterHistory, handlePopFilterHistory } ) {
    // addPostOpen corresponds to whether the AddPost interface is displayed.
    const [addPostOpen, setAddPostOpen] = useState(false);
    // When refresh is toggled, posts are fetched.
    const [refresh, setRefresh] = useState(false);
    // canRefresh is false when a refresh is currently taking place. This prevents spamming of the backend.
    const [canRefresh, setCanRefresh] = useState(true);
    // posts contains the array of posts to be displayed by PostList, depending on context.
    const [posts, setPosts] = useState([]);
    // replyTo contains the post_id of the post being replied to.
    const [replyTo, setReplyTo] = useState(undefined);
    // parentPost contains the post to which replies are being fetched and displayed.
    const [parentPost, setParentPost] = useState(undefined);
    // feedType corresponds to the feed the user has selected (all posts, or posts by users they follow)
    const [feedType, setFeedType] = useState("all");
    // latestDateTime corresponds to the date and time at which the last displayed post was posted.
    // When the user clicks "Load More Posts..." the next 10 chronological posts are fetched based on latestDateTime.
    const [latestDateTime, setLatestDateTime] = useState("");

    const handleOpenAddPost = () => {
        setAddPostOpen(true);
    }
    const handleCloseAddPost = () => {
        setReplyTo(undefined);
        setAddPostOpen(false);
    }

    const handleClickRefresh = () => {
        if (canRefresh) {
            // When the user clicks on the "refresh" button, if new posts have occurred, latestDateTime will become
            // out of sync, so we reset it altogether.
            setLatestDateTime("");
            setRefresh(!refresh);
        }
    }

    useEffect(() => {
        // If the user is currently making a post, block refreshes. However, when the user finishes making a post,
        // we force a refresh in order to display said post.
        if (addPostOpen) {
            return;
        }

        // If the user has clicked "Load More Posts..." we don't want to force the user to the top of the page by clearing
        // the screen.
        if (latestDateTime === "") {
            setCanRefresh(false);
        }

        async function getParentPost() {
            try {
                const api = new API();

                const postResponse = await api.post(filter);

                setParentPost(postResponse.data[0])

            } catch (error) {
                console.error("Error getting parent post:", error);
            }
        }

        async function fetchPosts() {
            try {
                const api = new API();

                /*
                    The set of posts to get fetched is controlled by 4 things:
                        filterType - filter by user, filter by replies to a post, or no filter at all.
                        filter - which user to filter by, which post to get replies to, or undefined.
                        feedType - if there's no filter, whether posts should be from anyone, or just users followed.
                        latestDateTime - the cutoff date/time for posts to be fetched.
                 */
                if (filterType === "none") {
                    if (feedType === "following") {
                        setParentPost(undefined);

                        if (latestDateTime !== "") {
                            const postsResponse = await api.followingPostsPastDateTime(user['username'], latestDateTime);

                            setPosts([...posts,...postsResponse.data])
                        }
                        else {
                            const postsResponse = await api.followingPosts(user['username']);

                            setPosts(postsResponse.data)
                        }
                    }
                    else if (feedType === "all") {
                        setParentPost(undefined);

                        if (latestDateTime !== "") {
                            const postsResponse = await api.allPostsPastDateTime(latestDateTime);

                            setPosts([...posts,...postsResponse.data])
                        }
                        else {
                            const postsResponse = await api.allPosts();

                            setPosts(postsResponse.data)
                        }
                    }
                }
                else if (filterType === "user") {
                    setParentPost(undefined);

                    if (latestDateTime !== "") {
                        const postsResponse = await api.postsForUserPastDateTime(filter, latestDateTime);

                        setPosts([...posts,...postsResponse.data])
                    }
                    else {
                        const postsResponse = await api.postsForUser(filter);

                        setPosts(postsResponse.data)
                    }
                }
                else if (filterType === "replies") {
                    await getParentPost();

                    if (latestDateTime !== "") {
                        const postsResponse = await api.repliesToPostPastDateTime(filter, latestDateTime);

                        setPosts([...posts,...postsResponse.data])
                    }
                    else {
                        const postsResponse = await api.repliesToPost(filter);

                        setPosts(postsResponse.data)
                    }
                }

            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }

        // After posts have been fetched, display them.
        fetchPosts().then((value) => {
            setCanRefresh(true);
        });
    }, [user, refresh, addPostOpen, filterType, filter, feedType, latestDateTime]);

    // When replyTo is set via clicking on the "reply" button on a post, display the AddPost interface.
    useEffect(() => {
        if (replyTo) {
            setAddPostOpen(true);
        }
    }, [replyTo]);

    // When the user clicks on a post or user, posts displayed will change, so reset setLatestDateTime.
    useEffect(() => {
        setLatestDateTime("");
    }, [filterHistory, feedType])

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%"
        }} >
            <Modal
                open={ addPostOpen }
                onClose={ handleCloseAddPost }
                aria-labelledby="add-post-modal"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <AddPost user={ user } replyTo={ replyTo } handleCloseAddPost={ handleCloseAddPost } />
                </Box>
            </Modal>
            {
                canRefresh ?
                    <PostList
                        topLevelRefresh={ refresh }
                        parentPost={ parentPost }
                        posts={ posts }
                        setReplyTo={ setReplyTo }
                        user={ user }
                        filter={ filter }
                        filterType={ filterType }
                        setFilter={ setFilter }
                        setFilterType={ setFilterType }
                        handlePushFilterHistory={ handlePushFilterHistory }
                        followingOnly={ feedType }
                        setFollowingOnly={ setFeedType }
                        setLatestDateTime={ setLatestDateTime }
                    />
                    : <CircularProgress color="inherit" sx={{
                        mt: 12
                    }} />
            }
            {
                filterHistory.length > 0 &&
                <Fab size="medium" color="primary" onClick={ handlePopFilterHistory } sx={ goBackFabStyle } >
                    <ArrowBackIosNew />
                </Fab>
            }
            <Fab variant="extended" color="primary" onClick={ handleOpenAddPost } sx={ newPostFabStyle } >
                <AddCircle sx={{ mr: 1 }} />
                New Post
            </Fab>
            <Fab size="medium" color="primary" onClick={ handleClickRefresh } sx={ refreshFabStyle } >
                {
                    canRefresh ? <Refresh /> : <CircularProgress color="inherit" />
                }
            </Fab>
        </Box>
    );
}

export default Home