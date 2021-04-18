import { useReducer, useEffect, Fragment } from "react";
import io from "socket.io-client";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import theme from "../theme";
import MessageBubbleList from "./messagebubblelist";
import TopBar from "./topbar";
import SignIn from "./signin";
import "../App.css";
const HomePage = () => {
  const initialState = {
    messages: [],
    status: " enter a chat name",
    roomStatus: "enter a room name",
    showjoinfields: true,
    alreadyexists: false,
    chatName: "",
    roomName: "",
    typingMsg: "",
    isTyping: false,
    message: "",
    openDialog: false,
    preRoom: ["main"],
    roomSelected: "",
    roomUsers: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
    serverConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const serverConnect = () => {
    // connect to server
    //const socket = io.connect("localhost:5000", { forceNew: true });
    const socket = io();
    socket.on("nameexists", onExists);
    socket.on("welcome", addMessage);
    socket.on("someonejoined", addMessage);
    socket.on("someoneleft", addMessage);
    socket.on("someoneistyping", onTyping);
    socket.on("newmessage", onNewMessage);
    socket.on("previousroom", onPreroom);
    socket.on("roomusers", onRoomUsers);
    setState({ socket: socket });
  };
  const onExists = (dataFromServer) => {
    setState({ status: dataFromServer.text });
  };
  const onRoomUsers = (dataFromServer) => {
    setState({ roomUsers: dataFromServer.roomUsers });
  };
  const onPreroom = (dataFromServer) => {
    setState({ preRoom: dataFromServer.preroom });
  };
  // generic handler for all other messages:
  const addMessage = (dataFromServer) => {
    let messages = state.messages;
    messages.push(dataFromServer);
    setState({
      messages: messages,
      users: dataFromServer.users,
      showjoinfields: false,
      alreadyexists: false,
    });
  };
  // keypress handler for message TextField
  const onMessageChange = (e) => {
    setState({ message: e.target.value });
    if (state.isTyping === false) {
      state.socket.emit(
        "typing",
        {
          from: state.chatName,
          chatName: state.chatName,
          roomName: state.roomName,
        },
        (err) => {}
      );
      setState({ isTyping: true }); // flag first byte only
    }
  };
  // handler for join button click
  const handleJoin = () => {
    state.socket.emit("join", {
      chatName: state.chatName,
      roomName: state.roomName,
    });
  };
  //typing handler
  const onTyping = (dataFromServer) => {
    if (dataFromServer.from !== state.chatName) {
      setState({
        typingMsg: dataFromServer.text,
      });
    }
  };

  //message handler
  const onNewMessage = (dataFromServer) => {
    addMessage(dataFromServer);
    setState({ typingMsg: "", message: "" });
  };
  //enter handler
  // enter key handler to send message
  const handleSendMessage = (e) => {
    if (state.message !== "") {
      state.socket.emit(
        "message",
        { roomName: state.roomName, from: state.chatName, text: state.message },
        (err) => {}
      );
      setState({ isTyping: false });
    }
  };
  // handler for name TextField entry
  const onNameChange = (e) => {
    setState({ chatName: e.target.value, status: "" });
  };
  // handler for room TextField entry
  const onRoomChange = (e) => {
    setState({ roomName: e.target.value });
  };
  const handleOpenDialog = () => setState({ openDialog: true });
  const handleCloseDialog = () => setState({ openDialog: false });
  const handleRoomChange = (event) =>
    setState({ roomName: event.target.value, roomStatus: "" });
  return (
    <MuiThemeProvider theme={theme}>
      <TopBar viewDialog={handleOpenDialog} isJoin={!state.showjoinfields} />
      <Dialog
        open={state.openDialog}
        onClose={handleCloseDialog}
        style={{ margin: 20 }}
      >
        <DialogTitle style={{ textAlign: "center" }}>Who's On?</DialogTitle>
        {state.roomUsers.map((users, index) => (
          <DialogContent
            key={index}
          >{`${users.chatName} is in room ${users.chatRoom}`}</DialogContent>
        ))}
      </Dialog>
      <Card>
        <CardContent>
          {state.showjoinfields && <SignIn />}
          {state.showjoinfields && (
            <Fragment>
              <div
                style={{
                  border: "1px solid black",
                  padding: "15px",
                }}
              >
                <TextField
                  onChange={onNameChange}
                  placeholder="Chat Name"
                  autoFocus={true}
                  required
                  value={state.chatName}
                  error={state.status !== ""}
                  helperText={state.status}
                />
              </div>
              <p></p>
            </Fragment>
          )}
          {state.showjoinfields && (
            <div
              style={{
                border: "1px solid black",
                padding: "15px",
              }}
            >
              <Typography color="inherit">
                Join Existing or Enter Room Name
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  onChange={handleRoomChange}
                >
                  {state.preRoom.map((room, index) => (
                    <FormControlLabel
                      value={room}
                      control={<Radio />}
                      label={room}
                      key={index}
                    />
                  ))}
                  <TextField
                    onChange={onRoomChange}
                    placeholder="Room Name"
                    autoFocus={true}
                    required
                    error={state.roomStatus !== "" && state.roomName === ""}
                    value={state.roomName}
                    helperText={state.roomStatus}
                    onKeyPress={(e) =>
                      e.key === "Enter" ? onRoomChange() : null
                    }
                  />
                </RadioGroup>
              </FormControl>
            </div>
          )}
          <p></p>
          {state.showjoinfields && (
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "3%" }}
              onClick={() => handleJoin()}
              disabled={state.chatName === "" || state.roomName === ""}
            >
              Join
            </Button>
          )}
          {!state.showjoinfields && (
            <div className="messageList">
              <MessageBubbleList
                messages={state.messages}
                client={state.chatName}
              ></MessageBubbleList>
            </div>
          )}
          {!state.showjoinfields && (
            <TextField
              onChange={onMessageChange}
              placeholder="type something here"
              autoFocus={true}
              value={state.message}
              onKeyPress={(e) =>
                e.key === "Enter" ? handleSendMessage() : null
              }
            />
          )}
          <div>
            <Typography color="primary">{state.typingMsg}</Typography>
          </div>
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};
export default HomePage;
