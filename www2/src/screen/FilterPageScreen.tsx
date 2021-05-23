import { Button, notification, Radio, Table } from "antd";
import React, { useState } from "react";
import { getRequest } from "../libs/network";
import { fromNow } from "../libs/time";
import { TObject } from "../libs/types";
import { runQuery } from "./network";

export const FilterPageScreen = () => {
  const [result, setResult] = useState<Array<TObject>>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState("IN");
  const [timestamp, setTimestamp] = useState("We don't know when this data is updated. Please check latest data by clicking above button.");
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => (a.name[0] > b.name[0] ? 1 : -1),
    },
    {
      title: "symbol",
      dataIndex: "symbol",
      key: "symbol",
      sorter: (a: any, b: any) => (a.symbol[0] > b.symbol[0] ? 1 : -1),
    },
    {
      title: "close",
      dataIndex: "close",
      key: "close",
      sorter: (a: any, b: any) => a.close - b.close,
    },
    {
      title: "change",
      dataIndex: "change",
      key: "change",
      sorter: (a: any, b: any) => a.change - b.change,
    },
  ];

  async function reloadData() {
    await getRequest(`https://dev.api.grodok.com:5000/indicator?domain=${domain}&candle_type=1d&reload=1`);
    await getRequest(`https://dev.api.grodok.com:5000/indicator?domain=${domain}&candle_type=5m&reload=1`);
    notification.info({ message: "scheduled task for update data in backend. Please try after 1 min" });
  }

  async function checkTimeStamp() {
    try {
      setTimestamp("loading...");
      let data = (await getRequest(`https://dev.api.grodok.com:5000/timestamp?domain=${domain}`)) as TObject;
      setTimestamp(
        Object.keys(data.out.timestamp)
          .map((x) => {
            if (data.out.timestamp[x] != "Data not found") {
              return `${x} updated on **${fromNow(data.out.timestamp[x])}**, `;
            }
          })
          .join("")
      );
    } catch (err) {
      setTimestamp("not able to update");
    }
  }

  function perfromScan() {
    runQuery(`https://dev.api.grodok.com:5000/screen?filter=${query}&domain=${domain}`, {
      onBefore: () => {
        setLoading(true);
        setError("");
      },
      onComplete: () => setLoading(false),
      onError: (err) => {
        notification.error({
          message: "Not able to scan",
          description: err,
        });
        setResult([]);
      },
      onSuccess: (result) => {
        console.log(result);
        let data = result as TObject;
        setResult(data.out.result as Array<TObject>);
        notification.success({
          message: `We found ${data.out.result.length} result`,
        });
        setTimestamp(
          Object.keys(data.out.timestamp)
            .map((x) => {
              if (data.out.timestamp[x] != "Data not found") {
                return `${x} updated on ${fromNow(data.out.timestamp[x])}. `;
              }
            })
            .join("")
        );
      },
    });
  }
  return (
    <div className="d_layout_col d_p10">
      <p className="d_text_header">Trading 50 Advance Screener</p>
      <Radio.Group className="d_mv4" onChange={(e) => setDomain(e.target.value)} value={domain}>
        <Radio value={"IN"}>INDIA Stocks</Radio>
        <Radio value={"UK"}>UK Stocks</Radio>
        <Radio value={"USA"}>USA Stocks</Radio>
      </Radio.Group>
      <textarea className="d_textarea d_mv10" onChange={(e) => setQuery(e.target.value)} placeholder="white your query here"></textarea>
      <div className="d_layout_row d_mv10">
        <Button className="" type="primary" loading={loading} onClick={perfromScan}>
          Run Query
        </Button>
        <Button className="d_ml20" type="primary" onClick={reloadData}>
          Update Data
        </Button>
        <Button className="d_ml20" type="primary" onClick={checkTimeStamp}>
          Check latest Data
        </Button>
      </div>
      <Table className="" dataSource={result} columns={columns} />
      <p className="d_layout_caption d_mt20">(Note: {timestamp})</p>
    </div>
  );
};
