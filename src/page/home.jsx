import { Component } from "react";
import React from "react";
import Header from "../components/header";

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header />
        <h1>HOME PAGE</h1>
      </div>
    )
  }
}
