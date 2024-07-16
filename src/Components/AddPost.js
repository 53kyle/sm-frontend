import {Fragment, useState} from "react";
import {Box, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";

import API from "../API/APIInterface";
import DateHelper from "../Utils/DateHelper";
import ReadOnlyPost from "./ReadOnlyPost";

function AddPost( {user, handleCloseAddPost, replyTo} ) {
    const [post, setPost] = useState("");
    const [canPost, setCanPost] = useState(false);

    const handlePostChange = event => {
        if (event.target.value.length === 0 || event.target.value.length > 140) {
            setCanPost(false);
        }
        else {
            setCanPost(true);
        }
        setPost(event.target.value);
    };

    const handleClickPost = () => {
        async function addPost() {
            try {
                const api = new API();
                const UUID = crypto.randomUUID();
                const currentDate = new Date();

                const params = replyTo ? {
                    "post_id": UUID,
                    "username": user['username'],
                    "content": post,
                    "reply_to": replyTo['post_id']
                } : {
                    "post_id": UUID,
                    "username": user['username'],
                    "content": post,
                    "reply_to": null
                };

                const addPostResponse = await api.addPost(params);

            } catch (error) {
                console.error("Error adding post:", error);
            }
        }

        addPost().then((value) => {
            handleCloseAddPost()
        });
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            m: 1
        }}>
            <Typography variant="h4" sx={{
                mb: 3
            }}>
                {
                    replyTo ? `Reply` : "New Post"
                }
            </Typography>
            {
                replyTo &&
                <ReadOnlyPost user={user} post={replyTo} />
            }
            <TextField
                id="post-field"
                multiline
                label={replyTo ? "Reply" : "Post"}
                placeholder=""
                value={post}
                helperText=""
                onChange={handlePostChange}
                sx={{
                    mt: 2,
                    width: "100%"
                }}
            />
            <Typography variant="body" color={post.length <= 140 ? 'black' : 'red'} sx={{
                mt: 2
            }}>
                {`${140 - post.length} characters remaining.`}
            </Typography>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                m: 2,
            }}>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={handleCloseAddPost}
                    sx={{
                        mr: 1
                    }}
                >Cancel</Button>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={handleClickPost}
                    disabled={!canPost}
                    sx={{
                        ml: 1
                    }}
                >Post</Button>
            </Box>
        </Box>
    );
}

export default AddPost