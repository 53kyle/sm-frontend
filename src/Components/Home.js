import {Fragment, useEffect, useState} from "react";
import {Box, Fab, Modal, Typography, CircularProgress} from "@mui/material";
import {AddCircle, Refresh} from "@mui/icons-material";

import AddPost from "./AddPost";
import PostList from "./PostList";
import API from "../API/APIInterface";

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

function Home( { user, logout, filter, filterType, setFilter, setFilterType } ) {
    const [addPostOpen, setAddPostOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [canRefresh, setCanRefresh] = useState(true);
    const [posts, setPosts] = useState(undefined);
    const [replyTo, setReplyTo] = useState(undefined);
    const [parentPost, setParentPost] = useState(undefined);

    const handleOpenAddPost = () => {
        setAddPostOpen(true);
    }
    const handleCloseAddPost = () => {
        setReplyTo(undefined);
        setAddPostOpen(false);
    }

    const handleClickRefresh = () => {
        if (canRefresh) {
            setRefresh(!refresh);
        }
    }

    useEffect(() => {
        if (addPostOpen) {
            return;
        }

        setCanRefresh(false);

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

                if (filterType == "none") {
                    setParentPost(undefined);
                    const postsResponse = await api.allPosts();

                    setPosts(postsResponse.data.toReversed())
                }
                else if (filterType == "user") {
                    setParentPost(undefined);
                    const postsResponse = await api.postsForUser(filter);

                    setPosts(postsResponse.data.toReversed())
                }
                else if (filterType == "replies") {
                    getParentPost().then(async (value) => {
                        const postsResponse = await api.repliesToPost(filter);

                        setPosts(postsResponse.data.toReversed())
                    });
                }
                else {
                    return;
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchPosts().then((value) => {
            setCanRefresh(true);
        });
    }, [refresh, addPostOpen, filterType, filter]);

    useEffect(() => {
        if (replyTo) {
            setAddPostOpen(true);
        }
    }, [replyTo]);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%"
        }}>
            <Modal
                open={addPostOpen}
                onClose={handleCloseAddPost}
                aria-labelledby="add-post-modal"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <AddPost user={user} replyTo={replyTo} handleCloseAddPost={handleCloseAddPost} />
                </Box>
            </Modal>
            <PostList topLevelRefresh={refresh} parentPost={parentPost} posts={posts} setReplyTo={setReplyTo} user={user} filter={filter} filterType={filterType} setFilter={setFilter} setFilterType={setFilterType} />
            <Fab variant="extended" color="primary" onClick={handleOpenAddPost} sx={newPostFabStyle} >
                <AddCircle sx={{ mr: 1 }} />
                New Post
            </Fab>
            <Fab size="medium" color="primary" onClick={handleClickRefresh} sx={refreshFabStyle} >
                {
                    canRefresh ? <Refresh /> : <CircularProgress color="inherit" />
                }
            </Fab>
        </Box>
    );
}

export default Home