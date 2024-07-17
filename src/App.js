import './App.css';
import { Fragment, useState } from "react";

import API from "./API/APIInterface";
import AddUser from "./Components/AddUser";
import SearchAppBar from "./Components/SearchAppBar";
import Login from "./Components/Login";

function App() {
    // user contains the SM_User object for the logged-in user. This is passed down to most components in the app.
    const [user, setUser] = useState(undefined);
    const [newUser, setNewUser] = useState(false);

    async function APILogout() {
        try {
            const api = new API();
            await api.logout();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const logout = () => {
        APILogout().then((value) => {
            setUser(undefined);
        });
    }

    // When the user clicks on "Sign Up", switch to AddUser.
    // When the user clicks on "Already Have an Account?", switch to Login.
    const toggleNewUser = () => {
        setNewUser(!newUser);
    }

    return (
        <Fragment>
            {
                user ?
                    <SearchAppBar user={ user } logout={ logout } /> :
                    newUser ? <AddUser setUser={ setUser } toggleNewUser={ toggleNewUser } /> :
                        <Login setUser={ setUser } toggleNewUser={ toggleNewUser } />
            }
        </Fragment>
    );
}

export default App;
