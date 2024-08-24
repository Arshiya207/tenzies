import { nanoid } from "nanoid";
import React from "react";

export default function Die(props) {
  function createDots() {
    const dots = [];
    for (let i = 1; i <= props.items.num; i++) {
      dots.push(<div key={nanoid()} className="dot"></div>);
    }
    return dots;
  }

  return (
    <button
      className={`die ${props.items.selected ? "selected-die" : ""}`}
      onClick={() => props.flipDie(props.items.id)}
    >
      <div className="dots-container">{createDots()}</div>
    </button>
  );
}
