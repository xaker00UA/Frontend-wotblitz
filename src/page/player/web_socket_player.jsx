import React, { useEffect, useState } from "react";
import { PlayerGeneral } from "./player";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { Loading3QuartersOutlined, LoadingOutlined } from "@ant-design/icons";
import "./player.css";
const Webhook = () => {
  const { region, name } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    const socket = new WebSocket(`/websocket/${region}/player/ws/${name}`);

    socket.onmessage = (response) => {
      const { data } = response;
      try {
        const parsedData = JSON.parse(data);
        if (parsedData && parsedData.session) {
          const { session } = parsedData;
          setData(session.general);
        }
      } catch (error) {
        console.log("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (error) => {
      console.log("WebSocket Error:", error);
    };

    // Закрываем веб-сокет при размонтировании
    return () => {
      socket.close();
    };
  }, [region, name]);
  return (
    <>
      <div className="main-flexbox-content" style={{ width: "400px" }}>
        {data ? (
          <PlayerGeneral name={name} account={data} />
        ) : (
          <Spin indicator={<Loading3QuartersOutlined spin />}></Spin>
        )}
      </div>
    </>
  );
};
export default Webhook;
