/*
    SearchAppBar is the outermost user interface element, consisting of the top bar with logo and search bar.

    Since SearchAppBar must persist at the top of the screen, Home is contained within SearchAppBar.
 */

import { Fragment, useEffect, useState } from "react";
import { AppBar, Autocomplete, Box, Button, ButtonBase, CircularProgress, CssBaseline, InputBase, Toolbar, Typography } from "@mui/material"
import { alpha, styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";

import API from "../API/APIInterface";
import Home from "./Home";

// Search, SearchIconWrapper, and StyledInputBase are from the MUI documentation.
// I couldn't imagine a better search bar implementation.
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function SearchAppBar({ user, logout } ) {
    const [filter, setFilter] = useState(undefined);
    const [filterType, setFilterType] = useState("none");
    const [filterHistory, setFilterHistory] = useState([]);
    const [filterTypeHistory, setFilterTypeHistory] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchOptions, setSearchOptions] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState("");

    const loadingSearch = searchOptions && searchOptions.length === 0 && userSearchTerm !== "";

    // Clicking on the logo takes the user to the home page and clears browsing history
    const handleClickLogo = () => {
        setFilter(undefined);
        setFilterType("none");
        setFilterHistory([]);
        setFilterTypeHistory([])
    }

    // When the user clicks on a user, post, or reply indicator, the current page they're on is saved for breadcrumb
    // navigation purposes
    const handlePushFilterHistory = () => {
        const filterHistoryClone = filterHistory.slice();
        const filterTypeHistoryClone = filterTypeHistory.slice();

        filterHistoryClone.push(filter);
        filterTypeHistoryClone.push(filterType);

        setFilterHistory(filterHistoryClone);
        setFilterTypeHistory(filterTypeHistoryClone);
    }

    // When the user clicks on the "back" button, the previous page they were on is retrieved.
    const handlePopFilterHistory = () => {
        const filterHistoryClone = filterHistory.slice();
        const filterTypeHistoryClone = filterTypeHistory.slice();

        setFilter(filterHistoryClone.pop());
        setFilterType(filterTypeHistoryClone.pop());

        setFilterHistory(filterHistoryClone);
        setFilterTypeHistory(filterTypeHistoryClone);
    }

    // When the user makes any input in the search bar, retrieve search results from the backend.
    useEffect(() => {
        async function fetchUsers() {
            // If search bar input is empty, there clearly won't be any matching users, so don't ping the backend.
            if (userSearchTerm === "") {
                setSearchOptions([]);
                return;
            }

            try {
                const api = new API();

                const usersResponse = await api.searchForUser(userSearchTerm);

                setSearchOptions(usersResponse.data)

            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUsers()
    }, [userSearchTerm]);

    // When the user un-focuses the search bar, close the search dropdown.
    useEffect(() => {
        if (!searchOpen) {
            setSearchOptions([]);
        }
    }, [searchOpen]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav">
                <Toolbar>
                    <Box sx={{
                        display: { xs: 'none', sm: 'block' },
                        flexGrow: 1,
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "center",
                    }} >
                        <ButtonBase disableRipple onClick={handleClickLogo}>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                            >
                                Simple Social
                            </Typography>
                        </ButtonBase>
                    </Box>
                    <Autocomplete
                        id="search-autocomplete"
                        sx={{ width: 300 }}
                        open={searchOpen}
                        onOpen={() => {
                            setSearchOpen(true);
                        }}
                        onClose={() => {
                            setSearchOpen(false);
                        }}
                        isOptionEqualToValue={(option, value) => option.username === value.username}
                        getOptionLabel={(option) => option.username}
                        options={searchOptions}
                        loading={loadingSearch}
                        filterOptions={(x) => x}
                        onInputChange={(event, newInputValue) => {
                            setUserSearchTerm(newInputValue);
                        }}
                        onChange={(event, newValue) => {
                            if (newValue) {
                                handlePushFilterHistory();
                                setFilter(newValue['username']);
                                setFilterType("user")
                            }
                        }}
                        noOptionsText="No Users Found"
                        renderInput={(params) => (
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon/>
                                </SearchIconWrapper>
                                <div ref={params.InputProps.ref}>
                                    <StyledInputBase
                                        {...params}
                                        label="Search Users"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <Fragment>
                                                    {
                                                        loadingSearch ?
                                                        <CircularProgress color="inherit" size={20}/>
                                                            : null
                                                    }
                                                    { params.InputProps.endAdornment }
                                                </Fragment>
                                            ),
                                        }}
                                    />
                                </div>
                            </Search>
                        )}
                    />
                    <Button variant="contained" startIcon={ <LogoutIcon /> } onClick={ logout } sx={{ ml: 2 }} >
                        Log Out
                    </Button>
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{ display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%" }}>
                <Toolbar />
                <Home
                    user={ user }
                    filter={ filter }
                    filterType={ filterType }
                    setFilter={ setFilter }
                    setFilterType={ setFilterType }
                    filterHistory={ filterHistory }
                    handlePushFilterHistory={ handlePushFilterHistory }
                    handlePopFilterHistory={ handlePopFilterHistory }
                />
            </Box>
        </Box>
    );
}

export default SearchAppBar;