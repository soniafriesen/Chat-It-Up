import React, { useEffect, useRef } from "react";
import { ListItem } from "@material-ui/core";
import ChatBubble from "./chatbubble";
import Triangle from "./triangle";

const MessageBubble = (props) => {
  const messageRef = useRef(null);
  useEffect(() => {
    messageRef.current.scrollIntoView(true);
  }, []);
  return (
    <div>
      <ListItem
        ref={messageRef}
        style={{ textAlign: "left", marginBottom: "10px" }}
      >
        <ChatBubble msg={props.message} client={props.client} />
        <Triangle msg={props.message} client={props.client} />
      </ListItem>
    </div>
  );
};
export default MessageBubble;
