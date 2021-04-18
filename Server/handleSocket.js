const matColours = require("./colours.json");
const moment = require("moment");
///arrays for each user and rooms
let users = ["admin"];
let rooms = ["main"];

const previousrooms = (socket) => {
  socket.emit("previousroom", { preroom: rooms });
};
//add a user
const handleJoin = (socket, client) => {
  socket.name = client.chatName;
  socket.room = client.roomName;
  if (users.some((e) => e.chatName === client.chatName)) {
    socket.emit("nameexists", {
      text: `${client.chatName} already exsit. try a different name`,
    });
  } else {
    if (!rooms.includes(client.roomName)) {
      rooms.push(client.roomName);
    }
  }
  if (!users.some((e) => e.chatName === client.chatName)) {
    let coloridx = Math.floor(Math.random() * matColours.colours.length) + 1;
    while (matColours.colours[coloridx] == "#0d47a1")
      coloridx = Math.floor(Math.random() * matColours.colours.length) + 1;
    users.push({
      chatName: client.chatName,
      chatRoom: client.roomName,
      colour: matColours.colours[coloridx],
    });
    socket.join(client.roomName);
    socket.emit("welcome", {
      from: "Admin",
      text: `Welcome ${client.chatName}`,
      roomName: client.roomName,
      colour: "#0d47a1",
      time: moment().utc().subtract(4, "hours").format("h:mm:ss a"),
    });
    socket.to(client.roomName).emit("someonejoined", {
      from: "Admin",
      text: `${client.chatName} has joined ${client.roomName} room!`,
      roomName: client.roomName,
      colour: "#0d47a1",
      time: moment().utc().subtract(4, "hours").format("h:mm:ss a"),
    });
    currentUsers = users.filter((e) => e.chatRoom === client.roomName);
    socket.emit("roomusers", { roomUsers: currentUsers });
    socket.to(client.roomName).emit("roomusers", { roomUsers: currentUsers });
  }
};
//disconnect user
const handleDisconnect = (socket) => {
  if (socket.name !== undefined) {
    socket.to(socket.room).emit("someoneleft", {
      from: "Admin",
      text: `${socket.name} has left room ${socket.room}`,
      roomName: socket.room,
      colour: "#0d47a1",
      time: moment().utc().subtract(4, "hours").format("h:mm:ss a"),
    });
    //remove user
    // remove user from array
    users.splice(
      users.indexOf(users.find((x) => x.chatName == socket.name)),
      1
    );
    let currentUsers = users.filter((e) => e.chatRoom === socket.room);
    socket.emit("roomusers", { roomUsers: currentUsers });
    socket.to(socket.room).emit("roomusers", { roomUsers: currentUsers });
  }
};
///handl typing
const handleTyping = (socket, clientData) => {
  socket.to(clientData.roomName).emit("someoneistyping", {
    text: `${clientData.chatName} is typing`,
    from: clientData.from,
  });
};
//handle messsage
const handleMessage = (io,clientData) => {
  var user = users.find((e) => e.chatName === clientData.from);
  io.emit("newmessage", {  
    text: clientData.text,
    from: clientData.from,
    colour: user.colour,
    time: moment().utc().subtract(4, "hours").format("h:mm:ss a"),
    roomName: clientData.roomName,
  });  
};

module.exports = {
  handleJoin,
  handleDisconnect,
  handleTyping,
  handleMessage,
  previousrooms,
};
