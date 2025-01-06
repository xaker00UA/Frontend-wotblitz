import React, { useEffect, useState } from "react";
import { PlayerGeneral } from "./player";
import { useParams } from "react-router";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import "./player.css";

const Webhook = () => {
  const { region, name } = useParams();
  const [nickname, setNickname] = useState(null);
  const [data, setData] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0); // Храним количество попыток переподключения
  const maxReconnectAttempts = 5; // Максимальное количество попыток переподключения

  useEffect(() => {
    let socket;
    let reconnectInterval;

    // Функция для подключения WebSocket
    const connectWebSocket = () => {
      socket = new WebSocket(`/websocket/${region}/player/ws/${name}`);

      socket.onmessage = (response) => {
        const { data } = response;
        try {
          const parsedData = JSON.parse(data);
          setNickname(parsedData.name);
          const { session } = parsedData.general;
          setData(session.all);
        } catch (error) {
          console.log("Error parsing WebSocket data:", error);
        }
      };

      socket.onerror = (error) => {
        console.log("WebSocket Error:", error);
      };

      socket.onclose = (event) => {
        console.log("WebSocket connection closed", event);
        if (event.code === 1006 || !event.wasClean) {
          console.log(
            "Connection closed unexpectedly. Attempting to reconnect..."
          );
          // Увеличиваем количество попыток переподключения
          if (reconnectAttempts < maxReconnectAttempts) {
            setReconnectAttempts((prev) => prev + 1);
            const delay = (reconnectAttempts + 1) * 5000; // Увеличиваем задержку на 5 секунд с каждым разом
            reconnectInterval = setInterval(() => {
              console.log("Reconnecting...");
              connectWebSocket(); // Попытка переподключения
            }, delay);
          } else {
            console.log("Maximum reconnect attempts reached.");
          }
        }
      };
    };

    connectWebSocket();

    // Закрываем соединение и очищаем интервал при размонтировании
    return () => {
      if (socket) socket.close();
      if (reconnectInterval) clearInterval(reconnectInterval);
    };
  }, [region, name, reconnectAttempts]); // Добавляем reconnectAttempts в зависимость

  return (
    <div className="main-flexbox-content" style={{ width: "400px" }}>
      {data ? (
        <PlayerGeneral name={nickname} account={data} />
      ) : (
        <Spin indicator={<Loading3QuartersOutlined spin />} />
      )}
    </div>
  );
};

export default Webhook;
