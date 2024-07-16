import {Fragment} from "react";
import Post from "./Post";
import {Box, Typography} from "@mui/material";
import Divider from "@mui/material/Divider";
import UserProfile from "./UserProfile";

function PostList( { posts, parentPost, topLevelRefresh, setReplyTo, user, filter, filterType, setFilter, setFilterType, handlePushFilterHistory } ) {
    return (
        <Fragment>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "start",
                    width: "100%",
                    mt: 12,
                    mr: 2,
                    ml: 2
                }}
            >
                {
                    filterType == "user" &&
                    <UserProfile username={filter} />
                }
                {
                    parentPost &&
                    <Fragment>
                        <Post post={parentPost} user={user} topLevelRefresh={topLevelRefresh} setReplyTo={setReplyTo} setFilter={setFilter} setFilterType={setFilterType} handlePushFilterHistory={handlePushFilterHistory} key={0}/>
                        <Divider sx={{
                            width: "100%",
                            mb: 3
                        }} >REPLIES</Divider>
                    </Fragment>
                }
                {
                    posts &&
                    posts.map((post, index) => (
                        <Post post={post} user={user} topLevelRefresh={topLevelRefresh} setReplyTo={setReplyTo} setFilter={setFilter} setFilterType={setFilterType} handlePushFilterHistory={handlePushFilterHistory} key={ index + 1 }/>
                    ))
                }
            </Box>
        </Fragment>
    );
}

export default PostList