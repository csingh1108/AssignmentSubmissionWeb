import React, {useState} from 'react';
import {Navigate} from "react-router-dom";
import backendcaller from "../Services/fetchService";
import {useJwt} from "../GlobalState";

const PrivateRoute = ( {children} ) => {
    const {jwt} = useJwt()
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(null);

    if (jwt) {
        backendcaller(`/api/auth/validate?token=${jwt}`, "GET", jwt).then(isValid => {
            setIsValid(isValid);
            setIsLoading(false);
            return isValid === true ? children : <Navigate to="/login"/>
        })
    }else{
        return <Navigate to="/login"/>
    }

    return isLoading ? (
        <div>Loading...</div>
    ) : isValid === true ? (
        children) : (
            <Navigate to="/login"/>
    );
};

export default PrivateRoute;