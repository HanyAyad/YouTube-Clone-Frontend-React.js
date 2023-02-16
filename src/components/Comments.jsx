import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Comments = ({ videoId }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (err) {}
    };
    fetchComments();

    // Get current user
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, [videoId]);

  const handleNewComment = async (event) => {
    event.preventDefault();

    if (newCommentText.trim() !== "") {
      try {
        const res = await axios.post("/comments", {
          videoId: videoId,
          author: currentUser.username,
          text: newCommentText,
        });
        setComments((prevComments) => [...prevComments, res.data]);
        setNewCommentText("");
      } catch (err) {}
    }
  };

  return (
    <Container>
      <form onSubmit={handleNewComment}>
        <NewComment>
          <Avatar src={currentUser?.img} />
          <Input
            placeholder="Add a comment..."
            value={newCommentText}
            onChange={(event) => setNewCommentText(event.target.value)}
          />
        </NewComment>
      </form>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
};

export default Comments;
