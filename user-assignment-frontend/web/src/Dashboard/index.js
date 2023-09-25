import React, {useEffect, useState} from 'react';
import backendcaller from "../Services/fetchService";
import { Button, Card, Col, Row} from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import {useNavigate} from "react-router-dom";
import {useJwt} from "../GlobalState";

const Dashboard = () => {
//Calls use custom useLocalState method to set and retrieve JWT
    const { jwt , setJwt} = useJwt()
    const [assignments, setAssignments] = useState(null);

    let navigate = useNavigate();

    useEffect(() => {
        backendcaller("api/assignments", "GET", jwt)
        .then(assignmentsData => {
            setAssignments(assignmentsData);
        })
    }, [jwt]);
    function createAssignment() {
        backendcaller("api/assignments", "POST", jwt)
        .then( (assignment) => {
            navigate(`/assignments/${assignment.id}`);
        })
    }

        return (
            <div style={{margin:  "2em"}}>
                <Row>
                    <Col>
                        <div className="d-flex justify-content-end"
                             style={{ cursor: "pointer"}}
                             onClick={  () => {
                                 setJwt(null);
                                 navigate(`/login`);
                             }}> Logout </div>
                    </Col>
                </Row>
                <div className="mb-4 ">
                <Button size="lg" onClick={ () => createAssignment()}>Submit New Assignment</Button>
                </div>

                {assignments ? (
                        <div
                        className="d-grid gap-5"
                        style={{ gridTemplateColumns: "repeat(auto-fill, 18rem)"}}>
                            {assignments.map((assignment) => (
                                <Card key={assignment.id} style={{ width: '18rem', height: `18rem` }}>
                                    <Card.Body className="d-flex flex-column justify-content-around">
                                        <Card.Title>Assignment #{assignment.number}</Card.Title>
                                        <div style={{ display:"inline-block"}}>
                                            <StatusBadge
                                                text={assignment.status}>
                                            </StatusBadge>
                                        </div>
                                        <Card.Text style={{ marginTop: "1em"}}>
                                            <p>
                                                <b> Github URL </b>
                                                : {assignment.githubUrl}
                                            </p>
                                            <p>
                                                <b> Branch</b>
                                                : {assignment.branch}
                                            </p>
                                        </Card.Text>
                                            <Button
                                                variant="outline-primary"
                                                onClick={() =>
                                                    navigate(`/assignments/${assignment.id}`)}>
                                                Edit
                                            </Button>
                                    </Card.Body>
                                </Card>
                    ))}
                    </div>
                ) : (
                        <></>
                    )}

        </div>
    );
};

export default Dashboard;