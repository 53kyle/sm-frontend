import {Fragment} from "react";
import Post from "./Post";
import {Box} from "@mui/material";

function PostList( { posts, topLevelRefresh, user } ) {
    return (
        <Fragment>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "start",
                    width: "flex",
                    mt: 12,
                    mr: 2,
                    ml: 2
                }}
            >
                {
                    posts &&
                    posts.map((post, index) => (
                        <Post post={ post } user={user} topLevelRefresh={topLevelRefresh} key={ index }/>
                    ))
                }
            </Box>
        </Fragment>
    );
}

export default PostList