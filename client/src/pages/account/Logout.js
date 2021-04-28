/* /src/components/auth/logout.jsx */

import * as React from "react";
import { AuthConsumer } from "./AuthProvider";
import AuthService from "./AuthService";

export const Logout = () => {


    React.useEffect(() => {
        new AuthService().logout();
    }, [])

    return <div>Logout</div>
};