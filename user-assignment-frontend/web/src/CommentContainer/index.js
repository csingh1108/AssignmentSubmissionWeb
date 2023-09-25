import React, {useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import Comment from "../Comment";
import backendcaller from "../Services/fetchService";
import {useJwt} from "../GlobalState";
import {useInterval} from "../util/useInterval";
import dayjs from "dayjs";

const CommentContainer = (props) => {
    const{ assignmentId }= props;
    const {jwt} = useJwt();

    const emptyComment = {
        id: null,
        text:"",
        assignmentId:assignmentId != null ? parseInt(assignmentId) : null,
        user: jwt,
        createdDate: null
    }

    const [ comment, setComment ] = useState(emptyComment);
    const [ comments, setComments ] = useState([]);

    useEffect(() => {
        backendcaller(`/api/comments?assignmentId=${assignmentId}`, "GET", jwt, null )
            .then( (commentData) => {
                setComments(commentData);
            })
    }, []);

    function submitComment() {
        if(comment.id) {
            backendcaller(`/api/comments/${comment.id}`, "PUT", jwt, comment).then(
                (d) => {
                    const commentsCopy = [...comments];
                    const i =comments.findIndex(comment => comment.id === d.id);
                    commentsCopy[i]=d;
                    setComments(commentsCopy);
                    setComment(emptyComment);
                })
        }else{
            backendcaller('/api/comments', "POST", jwt, comment).then( (d) => {
                const commentsCopy = [...comments];
                commentsCopy.push(d);
                setComments(commentsCopy);
                setComment(emptyComment);
            })
        }
    }

    function handleDeleteComment(commentId) {

        backendcaller(`/api/comments/${commentId}`, "delete", jwt).then((msg) => {
            const commentsCopy = [...comments];
            const i = commentsCopy.findIndex((comment) => comment.id === commentId);
            commentsCopy.splice(i, 1);
            setComments(commentsCopy);
        });
    }

    function handleEditComment (commentId){
        const i = comments.findIndex((comment) => comment.id === commentId);
        const editedComment = comments[i];

        const commentCopy = {
            id: editedComment.id,
            text: editedComment.content,
            assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
            user: jwt,
            createdDate: editedComment.createdDate,
        };
        setComment(commentCopy);
    }

    useInterval( () => {
        updateCommentTimeDisplay();
    }, 1000 * 60);
    function updateCommentTimeDisplay() {
        const commentsCopy = [...comments];
        commentsCopy.forEach(comment => comment.createdDate = dayjs(comment.createdDate))
        setComments(commentsCopy)
    }

    function updateComment(value) {
        const commentCopy={... comment};
        commentCopy.text = value;
        setComment(commentCopy);
    }

    return (
        <>
            <div className="col-lg-8 col-md-10 mt-3">
                <div className="row">
                    <div className="col-md-12">
                                <textarea
                                    style={{ width: '100%', borderRadius: '0.25em'}}
                                    onChange={ (e) => updateComment(e.target.value)}
                                    value={comment.text}></textarea>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-12">
                        <Button onClick={ () => submitComment()}>Post Comment</Button>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                {comments.map((comment) =>  (
                    <Comment
                        key={comment.id}
                        commentData={comment}
                        emitDeleteComment={handleDeleteComment}
                        emitEditComment={handleEditComment}
                    />
                ))}
            </div>
        </>
    );
};

export default CommentContainer;