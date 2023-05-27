import { SYMBOLS } from "./Zapfen.tsx";
import Cell from "./Cell.tsx";

export default function Line({
  index,
  operationIndex,
  numberPairs,
  symbol,
  multiply,
}: {
  index: number;
  operationIndex: number;
  numberPairs: number[][];
  symbol: SYMBOLS;
  multiply: boolean;
}) {
  const cellList = numberPairs.map((pair) => {
    return <Cell number={pair[0]} smallNumber={pair[1]} multiply={multiply} />;
  });

  const delay = `${(0.02 * index).toString()}s`;

  const style = {
    animationDelay: delay,
  };

  return (
    <li key={Math.random()} style={style}>
      {cellList}
      <div className="symbol">{symbol}</div>
      <div className="index">{operationIndex != 0 ? operationIndex : ""}</div>
    </li>
  );
}
