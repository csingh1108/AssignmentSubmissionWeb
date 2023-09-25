import React, {useEffect, useState} from 'react';
import {useJwt} from "../GlobalState";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'

const Comment = (props) => {
    const {jwt} = useJwt();
    const decoded = jwtDecode(jwt);
    const {  id, createdDate, createdBy, content} = props.commentData
    const {
        emitDeleteComment,
        emitEditComment
    } = props;
    const [commentTime, setCommentTime] = useState("");

    useEffect(() => {
        updateCommentTime();
    }, [createdDate]);

    function updateCommentTime(){
        if (createdDate) {
            dayjs.extend(relativeTime);
            if(typeof createdDate === 'string'){
                setCommentTime(dayjs(createdDate).fromNow());
            }else setCommentTime(createdDate.fromNow())
        }
    }

    return (
        <>
            <div className="comment-bubble">
                <div className="d-flex justify-content-between" style={{fontWeight: "bold"}}>
                    <div>{`${createdBy.name}`} </div>
                    <div className="d-flex gap-3">
                        {
                            decoded.sub === createdBy.username ? (
                                <>
                                    <div
                                        onClick={() => emitEditComment(id)}
                                        style={{cursor:"pointer", color: 'blue'}}>
                                        edit</div>
                                    <div
                                        onClick={() => emitDeleteComment(id)}
                                        style={{cursor:"pointer", color: 'red'}}>
                                        delete
                                    </div>
                                </>
                            ) : (
                                <></>
                            )
                        }

                    </div>
                </div>
                <div>
                    {content}
                </div>
            </div>
            <div style={{ marginTop: '-1.25em', marginLeft: "1.4em", fontSize:"12px"}}>
                {commentTime ? `Posted: ${commentTime}` : "Posted:"}
            </div>
        </>
    );
};

export default Comment;