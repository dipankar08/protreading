import { CSSProperties } from "@material-ui/styles";
import { useEffect, useState } from "react";
import { TObject, TProps } from "../libs/types";

export const DSimpleTable = ({ objArray }: TProps) => {
  let rowLost = [];
  let keys = objArray && objArray?.length > 0 ? Object.keys(objArray[0]) : [];

  const [data, setData] = useState<Array<TObject>>();
  useEffect(() => {
    setData(objArray);
  }, [objArray]);

  console.log(keys);
  return (
    <>
      {objArray && objArray?.length > 0 ? (
        <table style={tableStyle}>
          <tr>
            {keys.map((key, index) => (
              <td key={index} style={tableStyle}>
                {key}
              </td>
            ))}
          </tr>
          {[{ close: 10 }, { close: 10 }, { close: 10 }].map((item, index) => {
            <tr key={index}>
              <td>{item}</td>
              {keys.map((key, index) => (
                <td key={index} style={tableStyle}>
                  {item.toString()}
                </td>
              ))}
            </tr>;
          })}
          {objArray.map((x) => {
            <tr>
              <td>1</td>
            </tr>;
          })}
        </table>
      ) : (
        <p>No data found ( Did you do the right thing?)</p>
      )}
      <p>{JSON.stringify(objArray)}</p>
      <p>{new Date().toISOString()}</p>
      {data?.map((x) => {
        <p>{x}</p>;
      })}
    </>
  );
};

let tableStyle: CSSProperties = {
  border: "solid 1px black",
  borderCollapse: "collapse",
};
