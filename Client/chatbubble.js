import React from "react";
import "../App.css";
const ChatBubble = (props) => {
  let msg = props.msg;
  return (
    <div
      style={{
        backgroundColor: msg.colour,
        fontFamily: "Arial, Helvetica, sans-serif",
        position: "relative",
        padding: "11px",
        width: "65%",
        marginBottom: "-0.6em",
        borderRadius: "13px",
        left: props.client === props.msg.from ? "30%" : "-1%",
        color: "white",
      }}
    >
      <span style={{ fontSize: "smaller" }}>{msg.from} says:</span>
      <span style={{ float: "right" }}>Room:{msg.roomName}</span>
      <br />
      <span style={{ float: "right" }}>@:{msg.time}</span>
      <br />
      <p></p>
      <span>{msg.text}</span>
    </div>
  );
};
export default ChatBubble;
