const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// room -> user -> games vote
// games total votes at the end
const room_vote_data = {};
app.use(cors());
app.use(router);

io.on("connect", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    socket.join(user.room);
    room_vote_data[user.room] = {};
    room_vote_data[user.room][user.name] = null;

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, Welcome to room ${user.room}.`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("voteChanged", (game, callback) => {
    const user = getUser(socket.id);
    room_vote_data[user.room][user.name] = game;
    console.log(game);
    votes = {
      "Scribble.io": 0,
      oneword: 0,
      "Cards Against Humanity": 0,
      "Slither.io": 0,
    };
    Object.values(room_vote_data[user.room]).forEach((game_name) => {
      if (game_name) {
        votes[game_name] += 1;
      }
    });

    const games = Object.entries(votes).map(([name, vote], i) => {
      return { name: name, vote: vote };
    });
    console.log(
      `room: ${user.room} data: ${room_vote_data[user.room][user.name]}`
    );
    io.to(user.room).emit("updateVote", games);
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
      // deleted user votes
      // delete room_vote_data[user.room][user.name];
      votes = {
        "Code Name": 0,
        "Scribble.io": 0,
        "Agar.io": 0,
        "Cards Against Humanity": 0,
        "Slither.io": 0,
      };
      Object.values(room_vote_data[user.room]).forEach((game_name) => {
        votes[game_name] += 1;
      });

      const games = Object.entries(votes).map(([name, vote], i) => {
        return { name: name, vote: vote };
      });
      console.log(
        `room:${user.room} data:${room_vote_data[user.room][user.name]}`
      );
      io.to(user.room).emit("updateVote", games);
    }
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
