import React, {useState} from 'react';
import {useLocalState} from "../util/userLocalStorage";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import * as PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {useJwt} from "../GlobalState";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    const { setJwt }= useJwt();
    function sendLoginRequest() {

        const reqBody = {
            username: username,
            password: password,
        };

        fetch('api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
            .then(response => {
                if (response.status === 200){
                    // Get the 'Authorization' header from the response
                    setJwt(response.headers.get('Authorization'));
                    navigate(`/dashboard`);
                    // Parse and log the JSON response body
                    return response.json();
                }else {
                    return Promise.reject("Invalid login attempt")
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Form.Group className="mt-4" >
                            <Form.Label htmlFor='username' className="fs-4 ">Username</Form.Label>
                            <Form.Control
                                type="email"
                                id="username"
                                placeholder="John@example.com"
                                value={username}
                                onChange={ (event) => setUsername(event.target.value)}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Form.Group className="mb-3">
                                    <Form.Label htmlFor='password' className="fs-4">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        id="password"
                                        placeholder="Type in password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md="8" lg="6"
                        className="mt-2 d-flex flex-column gap-4 flex-md-row justify-content-md-between">
                        <Button
                            id="submit"
                            type="button"
                            size="lg"
                            onClick={ () => sendLoginRequest()}>
                            Login
                        </Button>
                        <Button
                            variant="secondary"
                            type="button"
                            size="lg"
                            onClick={ () => {
                                navigate(`/`);
                            }}>
                            Exit
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Login;