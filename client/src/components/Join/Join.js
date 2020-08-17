import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";

export default function SignIn() {
  let random_room_id =
    Math.random().toString(36).substring(2, 3) +
    Math.random().toString(36).substring(2, 6);
  const [name, setName] = useState("");
  const [room, setRoom] = useState(random_room_id);

  function handleClick(e) {
    console.log("hit");
    if (!name) {
      e.preventDefault();
      alert("Please provide a Name");
    } else if (!room) {
      // doesn't work? why
      setRoom(random_room_id);
    }
  }
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join A Room</h1>
        <div>
          <input
            placeholder="Name"
            className="joinInput"
            type="text"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Room"
            className="joinInput mt-20"
            type="text"
            onChange={(event) => setRoom(event.target.value)}
          />
        </div>
        <Link onClick={handleClick} to={`/chat?name=${name}&room=${room}`}>
          <button className={"button mt-20"} type="submit">
            Sign In
          </button>
        </Link>
        <div className="room-info">
          If you don't have room you. You can leave the room empty
        </div>
      </div>
    </div>
  );
}
