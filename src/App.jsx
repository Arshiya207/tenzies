import Die from "./components/Die";
import React from "react";
import Confetti from "react-confetti";
import SnowFall from "react-snowfall";
import Timer from "./components/Timer";
export default function App() {
  // states
  const [dice, setDice] = React.useState(intializeArray);
  const [isGameStarted, setIsGameStarted] = React.useState(true);
  const [seconds, setSeconds] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);

  // event listeners
  function roll() {
    setDice((prevDice) =>
      prevDice.map((die) => {
        return die.selected
          ? die
          : {
              ...die,
              num: Math.floor(Math.random() * 6) + 1,
            };
      })
    );
  }
  function flipDie(dieId) {
    if (!isGameStarted) return;
    setDice((prevDice) =>
      prevDice.map((die) => {
        return die.id === dieId ? { ...die, selected: !die.selected } : die;
      })
    );
  }
  function reset() {
    const diceInitialArray = [];

    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      diceInitialArray.push({
        id: i + 1,
        num: randomNumber,
        selected: false,
      });
    }
    const latestTime =
      localStorage.getItem("latestTime") ??
      localStorage.setItem("latestTime", "[]");
    const bestTime =
      localStorage.getItem("bestTime") ?? localStorage.setItem("bestTime", "");

    if (latestTime) {
      let latestTimeArray = JSON.parse(localStorage.getItem("latestTime"));

      if (bestTime) {
        const bestMin = bestTime.split(":")[0];
        const bestSec = bestTime.split(":")[1];
        if (minutes < bestMin || seconds < bestSec) {
          localStorage.setItem("bestTime", `${minutes}:${seconds}`);
        } else {
          latestTimeArray.push(`${minutes}:${seconds}`);
          localStorage.setItem("latestTime", JSON.stringify(latestTimeArray));
        }
        // removes unneccessery times that has been saved to local storage
        localStorage.setItem("latestTime","[]")
        latestTimeArray=[]
        latestTimeArray.push(`${minutes}:${seconds}`);
        localStorage.setItem("latestTime", JSON.stringify(latestTimeArray));

       
      } else {
        const isBestTime = latestTimeArray.every((time) => {
          const latMin = time.split(":")[0];
          const latSec = time.split(":")[1];
          return minutes < latMin || seconds < latSec;
        });
        if (isBestTime) {
          localStorage.setItem("bestTime", `${minutes}:${seconds}`);
        } else {
          latestTimeArray.push(`${minutes}:${seconds}`);
          localStorage.setItem("latestTime", JSON.stringify(latestTimeArray));
        }
      }
    } else {
      const latestTimeArray = JSON.parse(localStorage.getItem("latestTime"));
      latestTimeArray.push(`${minutes}:${seconds}`);
      localStorage.setItem("latestTime", JSON.stringify(latestTimeArray));
    }
    setSeconds(0);
    setMinutes(0);
    setIsGameStarted(true);
    setDice(diceInitialArray);
  }
  // useEffects
  React.useEffect(() => {
    if (seconds === 59) {
      setMinutes((prevSeconds) => prevSeconds + 1);
      setSeconds(0);
    }
  }, [seconds]);
  React.useEffect(() => {
    if (!isGameStarted) return;
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [isGameStarted]);
  React.useEffect(() => {
    if (checkForWin()) {
      setIsGameStarted(false);
    }
  }, [dice]);
  // logic functions
  function intializeArray() {
    const diceInitialArray = [];

    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      diceInitialArray.push({
        id: i + 1,
        num: randomNumber,
        selected: false,
      });
    }
    return diceInitialArray;
  }
  function checkForWin() {
    if (dice.length === 0) return;
    const winResult = dice.every((die) => {
      return die.num === dice[0].num && die.selected === true;
    });
    return winResult;
  }
  // rendering variables
  const dieElements = dice.map((die) => {
    return <Die key={die.id} items={die} flipDie={flipDie} />;
  });
  return (
    <div className="container">
      {isGameStarted && <SnowFall snowflakeCount={100} />}
      {!isGameStarted && <Confetti height={window.innerHeight} />}
      <h1 className="game-title">tenzies</h1>
      <p className="game-description">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>

      <Timer seconds={seconds} minutes={minutes} />
      <div className="die-container">{dieElements}</div>
      {isGameStarted ? (
        <button className="roll-btn" onClick={roll}>
          Roll
        </button>
      ) : (
        <button className="roll-btn" onClick={reset}>
          reset
        </button>
      )}
    </div>
  );
}
