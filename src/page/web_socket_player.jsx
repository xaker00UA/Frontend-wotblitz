import React, { Component } from "react";
import TableRow from "../components/tablerow";
import { PlayerGeneral } from "./player";
import { useParams } from "react-router-dom";

class Webhook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: null,
    };
    this.region = props.region;
    this.name = props.name;
  }

  componentDidMount() {
    const socket = new WebSocket(
      `/websocket/${this.region}/player/ws/${this.name}`
    );

    socket.onmessage = (response) => {
      const { data } = response;
      try {
        const parsedData = JSON.parse(data);
        if (parsedData && parsedData.session) {
          const { session } = parsedData;
          const { name } = session;
          this.setState({ player: PlayerGeneral(session.general, name) });
        }
      } catch (error) {
        console.log("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (error) => {
      console.log("WebSocket Error:", error);
    };
  }

  render() {
    const { player } = this.state;
    if (!player) {
      return <div>Loading...</div>;
    }
    return <>{player}</>;
  }
}
const WebhookWrapper = () => {
  const { region, name } = useParams();

  return <Webhook region={region} name={name} />;
};
export default WebhookWrapper;
