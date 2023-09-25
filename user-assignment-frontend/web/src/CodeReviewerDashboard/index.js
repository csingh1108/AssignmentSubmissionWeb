import React, {useEffect, useState} from 'react';
import backendcaller from "../Services/fetchService";
import { Button, Card, Col, Container, Row} from "react-bootstrap";
import jwtDecode from "jwt-decode";
import StatusBadge from "../StatusBadge";
import {useNavigate} from "react-router-dom";
import {useJwt} from "../GlobalState";

const CodeReviewerDashboard = () => {
//Calls use custom useLocalState method to set and retrieve JWT
    const { jwt, setJwt }= useJwt();
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

    function claimAssignment(assignment) {
        const decoded = jwtDecode(jwt)
        const user ={
            username:decoded.sub,
        }
        assignment.codeReviewer = user;
        //Todo dont hardcode this
        assignment.status = "In Review";
        backendcaller(`api/assignments/${assignment.id}`, "PUT", jwt, assignment)
            .then(
                (updatedAssignment) => {
                    const assignCopy = [...assignments];
                    const i =assignCopy.findIndex(a => a.id === assignment.id);
                    assignCopy[i] = updatedAssignment;
                    setAssignments(assignCopy);
                }
            )
    }

    function editReview(assignment) {
        navigate(`/assignments/${assignment.id}`)
    }

    return (
        <Container>
            <Row>
                <Col>
                    <div className="d-flex justify-content-end"
                         style={{ cursor: "pointer"}}
                         onClick={  () => {
                             setJwt(null);
                             navigate(`/login`)
                         }}> Logout </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1>Code Review Dashboard</h1>
                </Col>
            </Row>

            <div className="assignment-wrapper in-review">

                <div
                    className="h3 px-2 assignment-wrapper-title"

                >In Review
                </div>
                {assignments && assignments.filter( (assignment) => assignment.status === 'In Review').length > 0? (
                    <div
                        className="d-grid gap-5"
                        style={{ gridTemplateColumns: "repeat(auto-fill, 18rem)"}}>
                        {assignments
                            .filter( (assignment) => assignment.status === "In Review")
                            .map((assignment) => (
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
                                                editReview(assignment)}>
                                            Edit Review
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                    </div>
                ) : (
                    <>No Assignments found</>
                )}

            </div>
            <div className="assignment-wrapper  submitted">
                <div
                    className="h3 px-2 assignment-wrapper-title"

                >Awaiting Review
                </div>
                {assignments && assignments.filter( (assignment) =>
                    assignment.status === 'Submitted' ||
                    assignment.status === 'Resubmitted'
                ).length > 0? (
                    <div
                        className="d-grid gap-5"
                        style={{ gridTemplateColumns: "repeat(auto-fill, 18rem)"}}>
                        {assignments
                            .filter( (assignment) => assignment.status === "Submitted" ||
                            assignment.status === 'Resubmitted')
                            .sort( (a, b) => {
                                if(a.status === "Resubmitted")
                                    return -1;
                                else return 1;})
                            .map((assignment) => (
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
                                            claimAssignment(assignment)}>
                                        Claim
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <>No Assignments found</>
                )}
            </div>


            <div className="assignment-wrapper needs-update">
                <div
                    className="h3 px-2 assignment-wrapper-title"
                >Needs Update
                </div>
                {assignments && assignments.filter( (assignment) => assignment.status === 'Needs Update').length > 0 ? (
                    <div
                        className="d-grid gap-5"
                        style={{ gridTemplateColumns: "repeat(auto-fill, 18rem)"}}>
                        {assignments
                            .filter( (assignment) => assignment.status === "Needs Update")
                            .map((assignment) => (
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
                                                editReview(assignment)}>
                                            View
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                    </div>
                ) : (
                    <> No Assignments found</>
                )}

            </div>


        </Container>
    );
};

export default CodeReviewerDashboard;