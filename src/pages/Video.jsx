import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import Recommendation from "../components/Recommendation";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [currentVideo, setCurrentVideo] = useState({});
  const [subscribedUsers, setSubscribedUsers] = useState([]);
  const [channel, setChannel] = useState({});
  const [like, setLike] = useState();
  const [dislike, setDislike] = useState();
  const [subs, setSubs] = useState();

  const path = useLocation().pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        console.log(videoRes.data);
        setCurrentVideo(videoRes.data);
        const userRes = await axios.get(`/users//find/${videoRes.data.userId}`);
        setCurrentUser(userRes.data);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        setSubscribedUsers(userRes.data.subscribedUsers);
        await axios.put(`/videos/view/${videoRes.data._id}`, {});
      } catch (err) {}
    };
    fetchData();
  }, [path]);

  const handleLike = async () => {
    const updatedVideo = await axios.put(`/users/like/${currentVideo._id}`);

    if (like) {
      // if user is unliking the video, remove their id from likes array
      setCurrentVideo((prev) => ({
        ...prev,
        likes: prev.likes.filter((id) => id !== currentUser._id),
      }));
    } else {
      // if user is liking the video, add their id to likes array
      setDislike(false);

      setCurrentVideo((prev) => ({
        ...prev,
        likes: [...prev.likes, currentUser._id],
        dislikes: prev.likes.filter((id) => id !== currentUser._id),
      }));
    }

    setLike(!like);
  };

  const handleDislike = async () => {
    const updatedVideo = await axios.put(`/users/dislike/${currentVideo._id}`);

    if (dislike) {
      // if user is unliking the video, remove their id from likes array
      setCurrentVideo((prev) => ({
        ...prev,
        dislikes: prev.likes.filter((id) => id !== currentUser._id),
      }));
    } else {
      // if user is liking the video, add their id to likes array
      setLike(false);

      setCurrentVideo((prev) => ({
        ...prev,
        likes: prev.likes.filter((id) => id !== currentUser._id),
        dislikes: [...prev.likes, currentUser._id],
      }));
    }

    setDislike(!dislike);
  };

  const handleSub = async () => {
    const subscribed = subscribedUsers.includes(channel._id);
    if (subscribed) {
      await axios.put(`/users/unsub/${channel._id}`);
      setSubscribedUsers((prev) => prev.filter((sub) => sub !== channel._id));
    } else {
      await axios.put(`/users/sub/${channel._id}`);
      setSubscribedUsers((prev) => [...prev, channel._id]);
    }
    setSubs(subscribed);
  };

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo.videoUrl} controls />
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info>
            {currentVideo.views} views • {format(currentVideo.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser?._id) && like ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo.likes?.length}
              Like
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser?._id) && dislike ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "}
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>{currentVideo.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {currentUser.subscribedUsers?.includes(channel._id) && subs
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id} />
      </Content>
      <Recommendation tags={currentVideo.tags} />
    </Container>
  );
};

export default Video;
