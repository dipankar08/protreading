import { Button, notification, Radio, Table } from "antd";
import React, { useState } from "react";
import { DTextArea } from "../components/DInput";
import { DCol } from "../components/DLayout";
import { DTextHeader } from "../components/DTypography";
import { TObject } from "../libs/types";
import { runQuery } from "./network";

export const FilterPageScreen = () => {
  const [result, setResult] = useState<Array<TObject>>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState("IN");
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
  return (
    <DCol>
      <DTextHeader>Trading 50 FIlters</DTextHeader>
      <Radio.Group onChange={(e) => setDomain(e.target.value)} value={domain}>
        <Radio value={"IN"}>INDIA Stocks</Radio>
        <Radio value={"UK"}>UK Stocks</Radio>
        <Radio value={"USA"}>USA Stocks</Radio>
      </Radio.Group>
      <DTextArea onChange={(value) => setQuery(value)}></DTextArea>
      <Button
        type="primary"
        loading={loading}
        onClick={() => {
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
            },
          });
        }}
      >
        Run Query
      </Button>
      <Table dataSource={result} columns={columns} />
    </DCol>
  );
};
