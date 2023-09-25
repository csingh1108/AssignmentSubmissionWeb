import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useJwt} from "../GlobalState";
import jwtDecode from "jwt-decode";
import {Button} from "react-bootstrap";

const NavBar = () => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {jwt, setJwt} = useJwt();
    const [authorities, setAuthorities] = useState(null);

    useEffect(() => {
        if (jwt){
            const decoded = jwtDecode(jwt);
            setAuthorities(decoded.authorities);
        }
    }, [jwt]);

    return (
        <div className="NavBar nav d-flex justify-content-around justify-content-lg-between">
            <div>
                {jwt ? (
                    <span
                        className="link"
                        onClick={() => {
                            fetch("/api/auth/logout").then((response) => {
                                if (response.status === 200) {
                                    setJwt(null);
                                    navigate("/");
                                }
                            });
                        }}
                    >
            Logout
          </span>
                ) : pathname !== "/login" ? (
                    <Button
                        variant="primary"
                        className="me-5"
                        onClick={() => {
                            navigate("/login");
                        }}
                    >
                        Login
                    </Button>
                ) : (
                    <></>
                )}

                {jwt ? (
                    <Button
                        className="ms-5 ms-md-5 me-md-5"
                        onClick={ () => {
                        navigate("/dashboard");
                        }}
                    >
                        Dashboard
                    </Button>
                    ):(
                        <></>
                    )}
            </div>

        </div>
    );
};

export default NavBar;