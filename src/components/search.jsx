import React, { useState, Component } from "react";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function withNavigate(Component) {
  return function WrapperComponent(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.timeout = null;
    this.value = undefined;
    this.state = {
      data: [],
      currentValue: undefined,
      savedValue: undefined,
    };
  }

  handleSearch = (newValue) => {
    this.setState(
      {
        data: [{ label: newValue, value: newValue }],
      },
      () => {
        this.fetch_request(newValue);
      }
    );
  };

  handleChange = (newValue) => {
    const region = "eu";
    console.log(newValue);
    this.setState({ data: [] });
    this.props.navigate(`/${region}/player/${newValue}`);
  };

  async fetch_request(name) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    this.timeout = setTimeout(async () => {
      try {
        const response = await axios.get(`/api/search?player_name=${name}`);

        if (response.data.susses !== "ok") {
          return;
        } else {
          const options = response.data.users.map((user, index) => ({
            value: user.name,
            label: user.name,
            key: index,
          }));
          this.setState((prevState) => ({
            data: [...prevState.data, ...options],
          }));
        }
      } catch (error) {
        console.error("Ошибка на сервере:", error);
        this.setState({ data: [] });
      }
    }, 300);
  }

  render() {
    const { data } = this.state;
    return (
      <Select
        showSearch
        value={this.state.currentValue}
        autoClearSearchValue={true}
        placeholder={this.props.placeholder || "Введите текст"}
        style={this.props.style || { width: 200 }}
        defaultActiveFirstOption={true}
        filterOption={true}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent="Нет данных"
        options={this.state.data}
        allowClear={false}
        loading={false}
      />
    );
  }

  static select() {
    return (
      <Search
        style={{
          width: 500,
        }}
      />
    );
  }
}
const Search_field = withNavigate(Search);
export default Search_field;
