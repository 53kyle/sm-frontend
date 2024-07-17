/*
    PostList contains three things:
        1) A header, based on filterType:
            "none" - FeedHeader, which allows the user to change from "all posts" to "following"
            "user" - The user's profile, which consists of username and bio
            "replies" - The post to which all other posts are replying to.
        2) Posts, dependent on filterType, filter, followingOnly, and latestDateTime
        3) A "Load More Posts..." button.
 */

import {Fragment} from "react";
import {Box, Button, Divider} from "@mui/material";

import UserProfile from "./UserProfile";
import FeedHeader from "./FeedHeader";
import Post from "./Post";

function PostList({ posts, parentPost, topLevelRefresh, setReplyTo, user, filter, filterType, setFilter, setFilterType, handlePushFilterHistory, followingOnly, setFollowingOnly, setLatestDateTime }) {
    const handleClickNextPage = () => {
        setLatestDateTime(posts[posts.length-1]["datetime_posted"]);
    }

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
                    filterType === "none" &&
                    <FeedHeader followingOnly={followingOnly} setFollowingOnly={setFollowingOnly} />
                }
                {
                    filterType === "user" &&
                    <UserProfile user={user} username={filter} />
                }
                {
                    parentPost &&
                    <Fragment>
                        <Post post={parentPost} user={user} topLevelRefresh={topLevelRefresh} setReplyTo={setReplyTo} setFilter={setFilter} setFilterType={setFilterType} handlePushFilterHistory={handlePushFilterHistory} key={0}/>
                        <Divider sx={{
                            width: "100%",
                            mb: 3
                        }} >
                            REPLIES
                        </Divider>
                    </Fragment>
                }
                {
                    posts &&
                    posts.map((post, index) => (
                        <Post post={post} user={user} topLevelRefresh={topLevelRefresh} setReplyTo={setReplyTo} setFilter={setFilter} setFilterType={setFilterType} handlePushFilterHistory={handlePushFilterHistory} key={ index + 1 }/>
                    ))
                }
                <Button
                    variant="text"
                    size="medium"
                    onClick={handleClickNextPage}
                    sx={{
                        mt: 2,
                        mb: 5
                    }}
                >Load More Posts...</Button>
            </Box>
        </Fragment>
    );
}

export default PostList