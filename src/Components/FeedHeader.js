import {Tab, Tabs, Typography} from "@mui/material";
import Divider from "@mui/material/Divider";
import {Fragment, useEffect, useState} from "react";
import API from "../API/APIInterface";
import Button from "@mui/material/Button";

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
            }}>
                Home
            </Typography>
            <Tabs
                value={followingOnly}
                onChange={handleChangeFollowingOnly}
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