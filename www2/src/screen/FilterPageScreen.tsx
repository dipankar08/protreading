import { Button, Form, Input, List, Modal, notification, Radio, Table } from "antd";
import Search from "antd/lib/input/Search";
import React, { useEffect, useState } from "react";
import { getRequest } from "../libs/network";
import { fromNow } from "../libs/time";
import { TObject } from "../libs/types";
import { runQuery, saveFilter, searchHistoryFilter } from "./network";

export const FilterPageScreen = () => {
  const [result, setResult] = useState<Array<TObject>>([]);
  const [filterHistory, setFilterHistory] = useState<Array<TObject>>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [columns, setColumn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  const [saveInitialValue, setSaveInitialValue] = useState<TObject>({});

  const [domain, setDomain] = useState("IN");
  const [selectedItem, setSelectedItem] = useState<TObject | null>(null);
  const [timestamp, setTimestamp] = useState("We don't know when this data is updated. Please check latest data by clicking above button.");
  const display_columns = [
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
    {
      title: "Action",
      key: "operation",
      //fixed: "right",
      width: 100,
      render: (item: any, data: any) => (
        <a
          onClick={(item) => {
            setSelectedItem(item);
            setIsModalVisible(true);
          }}
        >
          action
        </a>
      ),
    },
  ];

  useEffect(() => {
    setSaveInitialValue({ filter: query, columns: columns });
  }, [query, columns]);

  async function reloadData() {
    await getRequest(`https://dev.api.grodok.com:5000/indicator?domain=${domain}&candle_type=1d&reload=1`);
    await getRequest(`https://dev.api.grodok.com:5000/indicator?domain=${domain}&candle_type=5m&reload=1`);
    notification.info({ message: "scheduled task for update data in backend. Please try after 1 min" });
  }

  async function searchHistory(query: string) {
    searchHistoryFilter(query, {
      onBefore: () => setHistoryLoading(true),
      onComplete: () => setHistoryLoading(false),
      onSuccess: (res: TObject) => setFilterHistory(res.out as Array<TObject>),
      onError: () => {
        notification.error({ message: "Not able to get any history" });
      },
    });
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
    runQuery(`https://dev.api.grodok.com:5000/screen?filter=${query}&domain=${domain}&columns=${columns}`, {
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
    <div className="d_layout_col filter_screen d_fullscreen">
      <div className="d_layout_row header">
        <p className="">Trading 50 Advance Screener</p>
      </div>
      <div className="d_layout_row d_layout_fill">
        <div className="d_layout_col browse d_p10">
          <p className="d_mb10"> Browser Filter</p>
          <Search placeholder="input search text" onSearch={(data) => searchHistory(data)} />
          <List
            bordered
            dataSource={filterHistory}
            renderItem={(item: TObject) => (
              <div className="d_layout_col d_p10">
                <p> {item.title}</p>
                <p>{item.description}</p>
                <p>{item.filter}</p>
                <Button
                  onClick={() => {
                    setQuery(item.filter);
                    setColumn(item.columns || "");
                  }}
                >
                  Run this
                </Button>
              </div>
            )}
          />
        </div>
        <div className="d_layout_col d_p10 d_layout_fill">
          <div className="d_layout_col">
            <p className="d_mt20">Write your filter expression (e.g indicator:1d:close == 100) </p>
            <textarea className="d_textarea" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="white your query here"></textarea>
            <p className="d_mt20">Write your projection expression (e.g. indicator:1d:0:close,indicator:1d:-1:close, ):</p>
            <textarea
              className="d_textarea"
              value={columns}
              onChange={(e) => setColumn(e.target.value || "")}
              placeholder="write indicator columns"
            ></textarea>
            <div className="d_layout_row d_mv10">
              <Radio.Group className="d_mv4" onChange={(e) => setDomain(e.target.value)} value={domain}>
                <Radio value={"IN"}>INDIA Stocks</Radio>
                <Radio value={"UK"}>UK Stocks</Radio>
                <Radio value={"USA"}>USA Stocks</Radio>
              </Radio.Group>
              <view className="d_layout_fill" />
              <Button className="" type="primary" loading={loading} onClick={perfromScan}>
                Run Query
              </Button>
              <Button className="d_ml5" type="primary" onClick={reloadData}>
                Update Data
              </Button>
              <Button className="d_ml5" type="primary" onClick={checkTimeStamp}>
                Check latest Data
              </Button>
              <Button className="d_ml5" type="primary" onClick={() => setIsSaveModalVisible(true)} size="middle">
                Save Filter
              </Button>
            </div>
          </div>

          <Table className="d_mt20" dataSource={result} columns={display_columns} />

          <Modal
            title={`Chart for ${selectedItem?.symbol}`}
            visible={isModalVisible}
            onOk={() => {
              setIsModalVisible(false);
            }}
            onCancel={() => setIsModalVisible(false)}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>

          <Modal
            title={`Save this filter`}
            footer={null}
            visible={isSaveModalVisible}
            onOk={() => {
              setIsSaveModalVisible(false);
            }}
            onCancel={() => setIsSaveModalVisible(false)}
          >
            <Form
              name="basic"
              onFinish={(data) => {
                saveFilter(
                  { title: data.title, description: data.description, filter: query, columns: columns },
                  {
                    onBefore: () => setSaveLoading(true),
                    onComplete: () => setSaveLoading(false),
                    onSuccess: () => {
                      setIsSaveModalVisible(false);
                      notification.success({ message: "Saved" });
                    },
                    onError: (err) => {
                      notification.error({ message: "Not able to save", description: err });
                    },
                  }
                );
                console.log(data);
              }}
              onFinishFailed={() => {}}
              initialValues={saveInitialValue}
              layout="vertical"
            >
              <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please enter title!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please input your password!" }]}>
                <Input />
              </Form.Item>
              <p>
                <b>Query:</b>
              </p>
              <p>{query}</p>
              <p className="d_mv20">
                <b>Columns</b>
              </p>
              <p>{columns}</p>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <div className="d_layout_row footer">
        <p className="">(Note: {timestamp})</p>
      </div>
    </div>
  );
};
