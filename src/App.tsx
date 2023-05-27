import { useState } from "react";
import "./App.css";

enum symbols {
  "multiply" = "×",
  "divide" = "÷",
  "nothing" = "",
}

function App() {
  const [initialValue, setValue] = useState(23);
  const [sliderValue, setSlider] = useState(6);

  const zapfenCells: JSX.Element[] = [];

  let currentIndex = 0;
  let lastValue = initialValue;

  const numbers: number[][] = [];
  const smallNumbers: number[][] = [];

  for (let i = 1; i < sliderValue; i++) {
    let onlyLeft = 0;
    const tempNumbers = [];
    const tempSmallNumbers = [];

    const lastVString = lastValue.toLocaleString("fullwide", {
      useGrouping: false,
    });

    for (let j = lastVString.length - 1; j >= 0; j--) {
      const currentDigit = parseInt(lastVString[j]);

      const multiply = currentDigit * i + onlyLeft;
      const singles = multiply % 10;

      const resultString = multiply.toString();

      if (resultString.length > 1)
        onlyLeft = parseInt(resultString.slice(0, -1));
      else onlyLeft = 0;

      tempNumbers.push(singles);
      tempSmallNumbers.push(onlyLeft);
    }

    if (onlyLeft != 0) {
      Array.from(onlyLeft.toString())
        .reverse()
        .forEach((digit) => {
          tempNumbers.push(digit);
          tempSmallNumbers.push(0);
        });
    }

    tempNumbers.reverse();
    tempSmallNumbers.reverse();

    numbers.push(tempNumbers);
    smallNumbers.push(tempSmallNumbers);
    lastValue = lastValue * i;
  }

  numbers.forEach((list, i) => {
    zapfenCells.push(
      <Line
        key={currentIndex++}
        index={i + 2}
        numbers={list}
        smallNumbers={smallNumbers[i]}
        symbol={symbols.multiply}
      />
    );
  });

  // for (let i = 2; i < sliderValue; i++) {
  //   zapfenCells.push(
  //     <Line
  //       key={currentIndex++}
  //       index={i}
  //       value={lastValue}
  //       symbol={symbols.divide}
  //     />
  //   );
  //   lastValue = lastValue / i;
  // }

  // zapfenCells.push(
  //   <Line
  //     key={currentIndex++}
  //     index={0}
  //     value={lastValue}
  //     symbol={symbols.nothing}
  //   />
  // );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const numberString = event.target.value;

    if (numberString === "") {
      setValue(0);
      return;
    }

    if (isNaN(parseInt(numberString))) setValue(0);
    else setValue(parseInt(numberString));
  };

  const handleSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const numberString = event.target.value;

    if (!isNaN(parseInt(numberString))) setSlider(parseInt(numberString));
    else setValue(2);
  };

  return (
    <div className="zapfen">
      <div className="input">
        <input
          className="number"
          type="number"
          value={initialValue}
          onChange={handleInputChange}
        />
        <div className="slider">
          <input
            type="range"
            min="5"
            max="30"
            value={sliderValue}
            onChange={handleSliderChange}
          />
          <div>{sliderValue}</div>
        </div>
      </div>

      <ul>{zapfenCells}</ul>
    </div>
  );
}

function Line({
  index,
  numbers,
  smallNumbers,
  symbol,
}: {
  index: number;
  numbers: number[];
  smallNumbers: number[];
  symbol: symbols;
}) {
  const cellList = Array.from(numbers).map((digits, i) => {
    return (
      <Cell
        number={digits.toString()}
        smallNumber={smallNumbers[i].toString()}
      />
    );
  });

  return (
    <li key={index} data-index={index}>
      {cellList}
      <div className="symbol">{symbol}</div>
      <div className="index">{index != 0 ? index : ""}</div>
    </li>
  );
}

function Cell({
  number,
  smallNumber = "0",
}: {
  number: string;
  smallNumber?: string;
}) {
  return (
    <div className="cell">
      <div className="value">{number}</div>
      <div className="smallNumber">{smallNumber != "0" ? smallNumber : ""}</div>
    </div>
  );
}

export default App;
