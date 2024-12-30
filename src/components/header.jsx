import React, { Component } from "react";
import { Navigate, redirect } from "react-router-dom";
import Search_field from "./search";
import axios from "axios";
import "./header.css";

class Header extends Component {
  constructor(props) {
    super(props);
  }
  handlerOnLogin() {}
  handlerOnLogout() {}
  render() {
    return (
      <>
        <header className="p-3 bg-dark text-white">
          <div className="container">
            <div className="content-box">
              <a
                href="/"
                className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
              >
                <svg
                  className="bi me-2"
                  width="40"
                  height="32"
                  role="img"
                  aria-label="Bootstrap"
                >
                  <use xlinkHref="#bootstrap"></use>
                </svg>
              </a>
              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <a href="/" className="nav-link px-2 text-secondary">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link px-2 text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link px-2 text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link px-2 text-white">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link px-2 text-white">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div className="search-and-button-box">
              <Search_field />
              <AuthButtons />
            </div>
          </div>
        </header>
      </>
    );
  }
}

class AuthButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      redirectTo: null,
    };
  }

  checkAuth = async () => {
    // Проверяем наличие токена в куках
    try {
      const response = await axios.get("/api/auth/verify", {
        withCredentials: true,
      });
      return response.data.isAuthenticated;
    } catch (error) {
      console.error(error);
    }
  };
  async componentDidMount() {
    const isAuthenticated = await this.checkAuth();
    this.setState({ isAuthenticated }); // Update state after authentication check
  }
  handlerOnLogin = async () => {
    console.log("Login");
    const region = "eu";
    try {
      const response = await axios.get(
        `/api/login/${region}?redirect_url=${window.location.hostname}/auth`,
        {
          withCredentials: true,
        }
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    }
  };
  handlerOnLogout = async () => {
    const response = await axios.get("/api/logout", {
      withCredentials: true,
    });

    await this.componentDidMount();
  };
  handlerProfile = async () => {
    try {
      const response = await axios.get("/api/player", {
        withCredentials: true,
      });
      const link = `/${response.data.region}/player/${response.data.nickname}`;
      this.setState({ redirectTo: link });
    } catch (error) {
      console.error(error);
    }
  };
  handlerReset = () => {
    axios.get("/api/reset", { withCredentials: true });
  };

  render() {
    if (
      this.state.redirectTo &&
      window.location.pathname == this.state.redirectTo
    ) {
      window.location.reload();
    }
    if (this.state.redirectTo) {
      console.log(this.state.redirectTo);
      return <Navigate to={this.state.redirectTo} />;
    }
    return (
      <div className="text-end">
        {this.state.isAuthenticated ? (
          <>
            <button
              type="button"
              className="btn btn-outline-light me-2"
              onClick={this.handlerProfile}
            >
              Profile
            </button>
            <button
              type="button"
              className="btn btn-outline-light me-2"
              onClick={this.handlerOnLogout}
            >
              Logout
            </button>
            <button
              type="button"
              className="btn btn-outline-light me-2"
              onClick={this.handlerReset}
            >
              Reset Session
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-outline-light me-2"
              onClick={this.handlerOnLogin}
            >
              Login
            </button>
          </>
        )}
      </div>
    );
  }
}
export default Header;
