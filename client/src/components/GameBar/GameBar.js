import React from "react";
import "./GameBar.css";
const GameTile = ({ game, voteChanged }) => (
  <div
    className="GameTile"
    onClick={(e) => {
      voteChanged(game.name);
    }}
  >
    <div className="GTileName">{game.name}</div>
    <div className="GTileVote">{game.vote}</div>
  </div>
);

// game [{name:"name",vote:1}]
const GameBar = ({ games, voteChanged }) => (
  <div className="GameBar">
    {games.map((game, i) => (
      <GameTile key={i} game={game} voteChanged={voteChanged} />
    ))}
  </div>
);
export default GameBar;
