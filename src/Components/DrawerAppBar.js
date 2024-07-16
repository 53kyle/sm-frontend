import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import {alpha, styled} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import {Fragment, useEffect, useState} from "react";
import ButtonBase from '@mui/material/ButtonBase';

import Home from "./Home";
import {Autocomplete, CircularProgress, Popover, TextField} from "@mui/material";
import API from "../API/APIInterface";

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

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

function DrawerAppBar( {window, user, logout} ) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [filter, setFilter] = useState(undefined);
    const [filterType, setFilterType] = useState("none");
    const [filterHistory, setFilterHistory] = useState([]);
    const [filterTypeHistory, setFilterTypeHistory] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchOptions, setSearchOptions] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState("");
    const loadingSearch = searchOptions && searchOptions.length === 0 && userSearchTerm !== "";

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleClickLogo = () => {
        setFilter(undefined);
        setFilterType("none");
        setFilterHistory([]);
        setFilterTypeHistory([])
    }

    const handlePushFilterHistory = () => {
        const filterHistoryClone = filterHistory.slice();
        const filterTypeHistoryClone = filterTypeHistory.slice();

        filterHistoryClone.push(filter);
        filterTypeHistoryClone.push(filterType);

        console.log("filter history", filterHistoryClone)
        console.log("filter type history", filterTypeHistoryClone)

        setFilterHistory(filterHistoryClone);
        setFilterTypeHistory(filterTypeHistoryClone);
    }

    const handlePopFilterHistory = () => {
        const filterHistoryClone = filterHistory.slice();
        const filterTypeHistoryClone = filterTypeHistory.slice();

        setFilter(filterHistoryClone.pop());
        setFilterType(filterTypeHistoryClone.pop());

        setFilterHistory(filterHistoryClone);
        setFilterTypeHistory(filterTypeHistoryClone);
    }

    useEffect(() => {
        async function fetchUsers() {
            if (userSearchTerm == "") {
                setSearchOptions([]);
                return;
            }

            try {
                const api = new API();

                const usersResponse = await api.searchForUser(userSearchTerm);

                setSearchOptions(usersResponse.data)

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchUsers()
    }, [userSearchTerm]);

    useEffect(() => {
        if (!searchOpen) {
            setSearchOptions([]);
        }
    }, [searchOpen]);

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                MUI
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

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
                    }}>
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
                            setUserSearchTerm(newInputValue.replace(/\s+/g, ''));
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
                                                    {loadingSearch ?
                                                        <CircularProgress color="inherit" size={20}/> : null}
                                                    {params.InputProps.endAdornment}
                                                </Fragment>
                                            ),
                                        }}
                                    />
                                </div>
                            </Search>
                        )}
                    />
                    <Button variant="contained" startIcon={<LogoutIcon />} onClick={logout} sx={{ ml: 2 }} >
                        Log Out
                    </Button>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
            <Box component="main" sx={{ display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%" }}>
                <Toolbar />
                <Home user={user} logout={logout} filter={filter} filterType={filterType} setFilter={setFilter} setFilterType={setFilterType} filterHistory={filterHistory} handlePushFilterHistory={handlePushFilterHistory} handlePopFilterHistory={handlePopFilterHistory} />
            </Box>
        </Box>
    );
}

DrawerAppBar.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default DrawerAppBar;