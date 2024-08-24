import React from "react";
export default function Timer(props) {
  function formatTimer(number) {
    const lengthOfNumber = number.toString().length;
    if (lengthOfNumber === 1) {
      return "0" + number;
    } else {
      return number;
    }
  }
  const latestTimeArr = JSON.parse(localStorage.getItem("latestTime"));
  let latestTime = "";
  let bestTime = "";
  if (latestTimeArr) {
    latestTime = latestTimeArr[latestTimeArr.length - 1];
    bestTime = localStorage.getItem("bestTime") ?? "00:00";
  } else {
    latestTime = "00:00";
    bestTime = "00:00";
  }

  return (
    <div className="timer-container">
      <table className="time-table">
        <thead>
          <tr>
            <th>latest time</th>
            <th>timer</th>
            <th>best time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{latestTime}</td>
            <td>
              {" "}
              <div className="timer">{`${formatTimer(
                props.minutes
              )}:${formatTimer(props.seconds)}`}</div>
            </td>
            <td>{bestTime}</td>
          </tr>
        </tbody>
      </table>
      <div className="timer-able"></div>
    </div>
  );
}
