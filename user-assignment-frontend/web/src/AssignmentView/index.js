import React, {useEffect, useState} from 'react';
import backendcaller from "../Services/fetchService";
import {Button, Col, Container, DropdownButton, Form, Row, Dropdown, ButtonGroup} from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import {useNavigate, useParams} from "react-router-dom";
import {useJwt} from "../GlobalState";
import Comment from "../Comment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {useInterval} from "../util/useInterval";
import CommentContainer from "../CommentContainer";

const AssignmentView = () => {
    const {jwt} = useJwt();
    const {assignmentId} = useParams();
    const [ assignment, setAssignment] = useState({
        githubUrl: "",
        branch: "",
        number:null,
        status:null,
        codeReviewUrl: null
        });
    const [ assignmentEnums, setAssignmentEnums ] = useState([])
    const [ assignmentStatus, setAssignmentStatuses ] = useState([])
    const emptyComment = {
        id: null,
        text:"",
        assignmentId:assignmentId != null ? parseInt(assignmentId) : null,
        user: jwt,
    }

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
        }}

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
                    <Form.Group as={Row} className="my-3" controlId="assignmentName">
                        <Form.Label column sm="3" md="2" className="fs-5">
                            Assignment Number:
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <DropdownButton
                                as={ButtonGroup}
                                key={assignment.id}
                                variant={'info'}
                                title= {assignment.number  ?  `Assignment ${assignment.number}` : 'Select an Assignment'}
                                onSelect={(selectedElement) => {
                                updateAssignment("number", selectedElement)
                                }}>
                                {assignmentEnums.map((assignmentEnum) =>(
                                    <Dropdown.Item
                                        key={assignmentEnum.assignmentNum}
                                        eventKey={assignmentEnum.assignmentNum}>
                                        {assignmentEnum.assignmentNum}
                                    </Dropdown.Item>

                            ))}
                            </DropdownButton>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="my-3" controlId="githubURL">
                        <Form.Label column sm="3" md="2" className="fs-5">
                            Github URL :
                        </Form.Label>
                        <Col sm="9" md="8" lg="6">
                            <Form.Control
                            type="url"
                            onChange={ (e) => updateAssignment("githubUrl", e.target.value)}
                            value = {assignment.githubUrl}
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
                                onChange={ (e) => updateAssignment("branch", e.target.value)}
                                value = {assignment.branch}
                                placeholder="example_branch_name" />
                        </Col>
                    </Form.Group>

                    {assignment.status === "Completed"? (
                        <>
                            <div>
                                <Form.Group as={Row}
                                            className="mb-3 d-flex  align-items-center"
                                            controlId="branch">
                                    <Form.Label column sm="3" md="2" className="fs-5">
                                        Code Review Video Url:
                                    </Form.Label>
                                    <Col sm="9" md="8" lg="6">
                                        <a href={assignment.codeReviewUrl}
                                            style={{fontWeight:"bold"}}
                                        >{assignment.codeReviewUrl}</a>
                                    </Col>
                                </Form.Group>
                            </div>
                            <div className="d-flex justify-content-between col-lg-8 col-md-10">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    onClick={() => navigate('/dashboard')}>
                                    Back
                                </Button>
                            </div>
                        </>
                    ) : ( assignment.status === "Pending Submission" ? (
                        <div className="d-flex justify-content-between col-lg-8 col-md-10">
                            <Button
                                size="lg"
                                onClick={() => save(assignmentStatus[1].status)}>
                                Submit Assignment
                            </Button>
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() => navigate('/dashboard')}>
                                Back
                            </Button>
                        </div>
                        ): (
                            <div className="d-flex justify-content-between col-lg-8 col-md-10">
                                <Button
                                    size="lg"
                                    onClick={() => save(assignmentStatus[5].status)}>
                                    Re-Submit Assignment
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline-primary"
                                    onClick={() => navigate('/dashboard')}>
                                    Back
                                </Button>
                            </div>
                        )
                    )}
                    <CommentContainer assignmentId={assignmentId}/>
                </>
                ) : (
                <>
                </>
                )}
        </Container>
    );
};

export default AssignmentView;