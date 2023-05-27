/* global BigInt */

import React, { useState } from "react";
import Line from "./Line";
import "./Zapfen.css";

export enum SYMBOLS {
  "multiply" = "×",
  "divide" = "÷",
  "nothing" = "",
}

function getLineMultiply(currentValue: string, currentDepth: number) {
  const numberPairs: number[][] = [];
  let carryDigits = 0;

  for (let i = currentValue.length - 1; i >= 0; i--) {
    const currentDigit = parseInt(currentValue[i]);

    const multiply = currentDigit * currentDepth + carryDigits;
    const digitRightSide = multiply % 10;

    const resultString = multiply.toString();

    if (resultString.length > 1)
      carryDigits = parseInt(resultString.slice(0, -1));
    else carryDigits = 0;

    numberPairs.push([digitRightSide, carryDigits]);
  }

  if (carryDigits != 0) {
    Array.from(carryDigits.toString())
      .reverse()
      .forEach((digit) => {
        numberPairs.push([parseInt(digit), 0]);
      });
  }

  return numberPairs.reverse();
}

function getLineDivide(currentValue: string, currentDepth: number) {
  const numberPairs: number[][] = [];
  let carryDigit = 0;

  let hasDigitBeenNonZero = false;

  for (let i = 0; i < currentValue.length; i++) {
    const currentDigit = parseInt(currentValue[i]);
    const newDigit = parseInt(`${carryDigit}${currentDigit}`);

    if (carryDigit != 0) carryDigit = 0;

    if (Math.floor(newDigit / currentDepth) > 0) {
      const divide = Math.floor(newDigit / currentDepth);
      const remainder = newDigit % currentDepth;

      carryDigit = remainder;

      numberPairs.push([divide, remainder]);

      hasDigitBeenNonZero = true;
    } else {
      carryDigit = newDigit;

      if (hasDigitBeenNonZero) {
        numberPairs.push([0, carryDigit]);
      } else {
        numberPairs.push([-1, carryDigit]);
      }
    }
  }

  return numberPairs;
}

export default function Zapfen() {
  const [zapfenValue, setZapfenValue] = useState<string>("5");
  const [zapfenDepth, setZapfenDepth] = useState(6);

  const zapfenCells: JSX.Element[] = [];

  let currentIndex = 0;
  let lastValue: string = zapfenValue;

  for (let i = 1; i < zapfenDepth; i++) {
    const numberPairs = getLineMultiply(lastValue, i);

    zapfenCells.push(
      <Line
        key={currentIndex++}
        index={currentIndex}
        operationIndex={i + 1}
        numberPairs={numberPairs}
        symbol={SYMBOLS.multiply}
        multiply={true}
      />
    );

    const stringArr = numberPairs.map((pair) => pair[0].toString());

    lastValue = stringArr.join("");
  }

  const numberPairs = getLineMultiply(lastValue, zapfenDepth);

  zapfenCells.push(
    <Line
      key={currentIndex++}
      index={currentIndex}
      operationIndex={2}
      numberPairs={numberPairs}
      symbol={SYMBOLS.divide}
      multiply={true}
    />
  );

  lastValue = numberPairs.map((pair) => pair[0].toString()).join("");

  for (let i = 2; i < zapfenDepth; i++) {
    const numberPairs = getLineDivide(lastValue, i);

    zapfenCells.push(
      <Line
        key={currentIndex++}
        index={currentIndex}
        operationIndex={i + 1}
        numberPairs={numberPairs}
        symbol={SYMBOLS.divide}
        multiply={false}
      />
    );

    const stringArr = numberPairs.map((pair) => pair[0].toString());

    lastValue = stringArr.join("");
    lastValue = lastValue.replaceAll("-1", "");
  }

  const lastLine = getLineDivide(lastValue, zapfenDepth);

  zapfenCells.push(
    <Line
      key={currentIndex++}
      index={currentIndex}
      operationIndex={0}
      numberPairs={lastLine}
      symbol={SYMBOLS.nothing}
      multiply={false}
    />
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const numberString = event.target.value;

    if (numberString === "") {
      setZapfenValue("0");
      return;
    }

    const trimmedNumberString = numberString.replace(/^0+/, "");

    if (isNaN(parseInt(trimmedNumberString))) setZapfenValue("5");
    else setZapfenValue(trimmedNumberString);
  };

  const handleSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const numberString = event.target.value;

    if (!isNaN(parseInt(numberString))) setZapfenDepth(parseInt(numberString));
    else setZapfenDepth(0);
  };

  return (
    <>
      <h1>Zapfenrechner</h1>
      <div className="zapfen">
        <div className="input">
          <input
            className="number"
            type="number"
            value={zapfenValue.toString()}
            onChange={handleInputChange}
          />
          <div className="slider">
            <input
              className="slider-bar"
              type="range"
              min="5"
              max="50"
              value={zapfenDepth}
              onChange={handleSliderChange}
            />
            <input
              className="slider-number"
              type="number"
              min="0"
              max="999"
              value={zapfenDepth}
              onChange={handleSliderChange}
            />
          </div>
        </div>

        <div className="scroll">
          <ul>{zapfenCells}</ul>
        </div>
      </div>
    </>
  );
}
