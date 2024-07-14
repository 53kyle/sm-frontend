import {Fragment} from "react";
import SearchAppBar from "./SearchAppBar";

function Home( { user, logout } ) {

    return (
        <Fragment>
            <SearchAppBar user={user} logout={logout} />
        </Fragment>
    );
}

export default Home