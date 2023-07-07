// Node Server which will handle socket io connections
const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

const users = {};

io.on("connection", (socket) => {
  // if any new user joins, let other users connected to the server know
  socket.on("new-user-joined", (name) => {
    console.log("New User", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  // if someone sends a message, broadcast it to other people
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  // if someone leaves the chat, let others know
  socket.on("disconnect", (user) => {
    socket.broadcast.emit("leave", users[socket.id]);
    delete users[socket.id];
  });
});
