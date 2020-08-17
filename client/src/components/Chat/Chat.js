import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import GameBar from "../GameBar/GameBar";
import "./Chat.css";

let socket;

const TEST_GAMES = [
  {
    name: "Scribble.io",
    vote: 0,
  },
  {
    name: "oneword",
    vote: 0,
  },
  {
    name: "Cards Against Humanity",
    vote: 0,
  },
  {
    name: "Slither.io",
    vote: 0,
  },
];

const games2url = {
  "Scribble.io": "https://skribbl.io/",
  oneword: "https://oneword.games/",
  "Cards Against Humanity": "https://allbad.cards/",
  "Slither.io": "http://slither.io/",
};
const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [games, setGames] = useState(TEST_GAMES);
  const ENDPOINT = "ws://localhost:5000";
  // "https://project-chat-application.herokuapp.com/";
  console.log(ENDPOINT);
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    // ENDPOINT
    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    // game vote update
    socket.on("updateVote", (games) => {
      console.log(games);
      setGames(games);
      let max_game = "scribble.io";
      let max_vote = 0;

      games.forEach(({ name, vote }) => {
        if (max_vote < vote) {
          max_game = name;
          max_vote = vote;
        }
      });
      document.getElementById("gameframe").src = games2url[max_game];
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  const voteChanged = (game) => {
    socket.emit("voteChanged", game, (error) => {
      if (error) {
        alert(error);
      }
    });
  };

  return (
    <div className="outerContainer">
      <div className="title">
        <h1>
          Realtime GameParty
          <span role="img" aria-label="emoji">
            🕹🎉🎊🥳
          </span>
        </h1>
      </div>
      <div className="center">
        <div className="game">
          <iframe
            className="gameIFrame"
            id="gameframe"
            src="https://oneword.games/"
            title="W3Schools Free Online Web Tutorials"
          ></iframe>
        </div>
        <div className="right_children">
          <div className="chat-container">
            <InfoBar room={room} />
            <Messages messages={messages} name={name} />
            <Input
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          </div>
          <TextContainer users={users} />
        </div>
      </div>

      <div className="scoreboard">
        <GameBar games={games} voteChanged={voteChanged} />
      </div>
    </div>
  );
};

export default Chat;
