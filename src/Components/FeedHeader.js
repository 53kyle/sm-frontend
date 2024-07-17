/*
    FeedHeader has the sole function of allowing the user to change between the "All Posts" feed and the "Following" feed.
 */

import { Fragment } from "react";
import { Tab, Tabs, Typography } from "@mui/material";

function FeedHeader({ followingOnly, setFollowingOnly }) {
    const handleChangeFollowingOnly = (event, newValue) => {
        setFollowingOnly(newValue);
    }

    return (
        <Fragment>
            <Typography variant="h4" sx={{
                ml: 2,
                mr: 2,
                mb: 3
            }} >
                Home
            </Typography>
            <Tabs
                value={ followingOnly }
                onChange={ handleChangeFollowingOnly }
                textColor="primary"
                indicatorColor="primary"
                aria-label="feed mode selector"
                sx={{
                    mb: 3
                }}
            >
                <Tab value="all" label="All Posts" />
                <Tab value="following" label="Following" />
            </Tabs>
        </Fragment>
    );
}

export default FeedHeader