export default function Cell({
  number,
  smallNumber = 0,
  multiply,
}: {
  number: number;
  smallNumber?: number;
  multiply: boolean;
}) {
  return (
    <div className="cell">
      <div className="value">{number != -1 ? number : ""}</div>
      <div className={"smallNumber " + (multiply ? "multiply" : "divide")}>
        {smallNumber != 0 ? smallNumber : ""}
      </div>
    </div>
  );
}
