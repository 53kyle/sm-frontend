import './App.css';
import {Fragment, useEffect, useState} from "react";

import AddUser from "./Components/AddUser";
import Login from "./Components/Login";
import DrawerAppBar from "./Components/DrawerAppBar";
import API from "./API/APIInterface";

function App() {
    const [user, setUser] = useState(undefined);
    const [newUser, setNewUser] = useState(false);

    async function APILogout() {
        try {
            const api = new API();
            const userResponse = await api.logout();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const logout = () => {
        APILogout().then((value) => {
            setUser(undefined);
        });
    }

    const toggleNewUser = () => {
        setNewUser(!newUser);
    }

    return (
        <Fragment>
            {
                user ? <DrawerAppBar user={user} logout={logout} /> : newUser ? <AddUser setUser={setUser} toggleNewUser={toggleNewUser} /> : <Login setUser={setUser} toggleNewUser={toggleNewUser} />
            }
        </Fragment>
    );
}

export default App;
