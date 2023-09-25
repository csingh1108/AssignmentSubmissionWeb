import React, {useEffect, useState} from 'react';
import backendcaller from "../Services/fetchService";
import { Button, Col, Container, Form, Row} from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import {useNavigate} from "react-router-dom";
import {useJwt} from "../GlobalState";
import CommentContainer from "../CommentContainer";

const CodeReviewerAssignmentView = () => {
    const { jwt }= useJwt();
    const assignmentId = window.location.href.split("/assignments/")[1];
    const [ assignment, setAssignment] = useState({
        githubUrl: "",
        branch: "",
        number:null,
        status:null,
        codeReviewUrl:""
    });
    const [ assignmentEnums, setAssignmentEnums ] = useState([])
    const [ assignmentStatus, setAssignmentStatuses ] = useState([])

    let navigate = useNavigate();

    function updateAssignment(prop, value){
        const newAssignment = { ...assignment};
        newAssignment[prop] = value;
        setAssignment(newAssignment);
    }

    function save(status) {
        // If status is new, update
        if(status && assignment.status !== status){
            updateAssignment("status", status);

            // Use the updated assignment from the state inside the callback
            setAssignment((prevAssignment) => {
                backendcaller(`/api/assignments/${assignmentId}`, "PUT", jwt, prevAssignment)
                    .then(assignmentsData => {
                        setAssignment(assignmentsData);
                    });
                return prevAssignment; // Return the previous assignment value for immediate UI update
            });
        } else {
            // If not the new status, simply make the API call
            backendcaller(`/api/assignments/${assignmentId}`, "PUT", jwt, assignment)
                .then(assignmentsData => {
                    setAssignment(assignmentsData);
                });
        }
    }


    useEffect(() => {
        backendcaller(`/api/assignments/${assignmentId}`, "GET", jwt).then(
            (assignmentsResponse) => {
                let assignmentsData = assignmentsResponse.assignment;
                setAssignment(assignmentsData);
                setAssignmentEnums(assignmentsResponse.assignmentEnums);
                setAssignmentStatuses(assignmentsResponse.statusEnums)
            })
    }, []);


    return (
        <Container className="mt-5">
            <Row className="d-flex align-items-center">
                <Col >
                    {assignment.number  ? <h1>Assignment {assignment.number}</h1> : <h1>Select Assignment</h1>}
                </Col>
                <Col className="d-flex justify-content-around col-sm-3 col-md-6 col-lg-9">
                    <StatusBadge
                        text={assignment.status}>
                    </StatusBadge>
                </Col>
            </Row>
            {assignment ? (
                <>
                    <Form.Group as={Row} className="my-3" controlId="githubURL">
                        <Form.Label column sm="3" md="2" className="fs-5">
                            Github URL :
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <Form.Control
                                type="url"
                                readOnly
                                onChange={ (e) => updateAssignment("githubUrl", e.target.value)}
                                value  = {assignment.githubUrl}
                                placeholder="https://github.com/repo-name" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="branch">
                        <Form.Label column sm="3" md="2" className="fs-5">
                            Branch :
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <Form.Control
                                type="text"
                                readOnly
                                onChange={ (e) => updateAssignment("branch", e.target.value)}
                                value = {assignment.branch}
                                placeholder="example_branch_name" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="codeReviewUrl">
                        <Form.Label column sm="3" md="2" className="fs-5">
                            Video Review Url :
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <Form.Control
                                type="text"
                                onChange={ (e) => updateAssignment("codeReviewVideoUrl", e.target.value)}
                                value={assignment.codeReviewUrl}
                                placeholder="example_video_name" />
                        </Col>
                    </Form.Group>
                    <div className="d-flex justify-content-between col-lg-8 col-md-10">

                        {assignment.status === "Completed" ? (
                            <Button
                                size="lg"
                                variant="outline-info"
                                onClick={() => save(assignmentStatus[2].status)}>
                                Re-Claim
                            </Button>
                        ):(
                            <Button
                            size="lg"
                            onClick={() => save(assignmentStatus[4].status)}>
                        Complete Review
                    </Button>
                        )}

                        {assignment.status === "Needs Update" ? (
                            <Button
                                size="lg"
                                variant="outline-info"
                                onClick={() => save(assignmentStatus[2].status)}>
                                Re-Claim
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                variant="danger"
                                onClick={() => save(assignmentStatus[3].status)}>
                                Reject Assignment
                            </Button>
                        )}
                        <Button
                            size="lg"
                            variant="outline-primary"
                            onClick={() => navigate(`/dashboard`)}>
                            Back
                        </Button>
                    </div>
                    <CommentContainer assignmentId={assignmentId}/>
                </>

            ) : (
                <>
                </>
            )}
        </Container>
    );
};

export default CodeReviewerAssignmentView;