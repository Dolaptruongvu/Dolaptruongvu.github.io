const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { app, sessionMiddleware } = require("./app");
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port : ${port}`);
});
const { Server } = require("socket.io");
const io = new Server(server);
io.engine.use(sessionMiddleware);

dotenv.config({ path: `E:/Nodejs/Natours-Website/config.env` });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("Error");
  });

console.log(process.env);
console.log(app.get("env"));

// io area

const onConnected = (socket) => {
  const roomId = socket.roomId;
  console.log("room ID :", roomId);

  socket.join(roomId);
  const room = io.of("").adapter.rooms.get(roomId).size;

  io.to(roomId).emit("clients-total", room);

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);

    io.to(roomId).emit("clients-total", room);
  });
  socket.on("message", (data) => {
    socket.to(roomId).emit("chat-message", data);
  });
  socket.on("feedback", (data) => {
    socket.to(roomId).emit("feedback", data);
  });
};
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.roomId) {
    socket.roomId = session.roomId;
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

io.on("connection", onConnected);

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!, shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
