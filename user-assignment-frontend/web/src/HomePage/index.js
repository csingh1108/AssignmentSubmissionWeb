import React from 'react';
import NavBar from "../Navbar";
import {Container} from "react-bootstrap";

const Homepage = () => {
    return (
        <>
            <NavBar/>
            <Container className="mt-5">
                <h1>Welcome!</h1>
            </Container>
        </>

    );
};

export default Homepage;