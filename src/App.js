import './App.css';
import {Button, TextField, Typography} from "@mui/material";
import API from "./API/APIInterface";
import {Fragment, useEffect, useState} from "react";
import AddUser from "./Components/AddUser";
import Login from "./Components/Login";
import Home from "./Components/Home";

function App() {
    const [user, setUser] = useState(undefined);
    const [newUser, setNewUser] = useState(false);

    const logout = () => {
        setUser(undefined);
    }

    const toggleNewUser = () => {
        setNewUser(!newUser);
    }

    return (
        <Fragment>
            {
                user ? <Home user={user} logout={logout} /> : newUser ? <AddUser setUser={setUser} toggleNewUser={toggleNewUser} /> : <Login setUser={setUser} toggleNewUser={toggleNewUser} />
            }
        </Fragment>
    );
}

export default App;
