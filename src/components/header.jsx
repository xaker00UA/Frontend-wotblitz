import React from "react";
import { useNavigate } from "react-router";
import Search_field from "./search";
import "./header.css";
import { useAuth, AuthProvider } from "../hooks/useAuth";
import { reset } from "../services/api/authService";
import { Button } from "antd";

const Header = () => {
  return (
    <>
      <AuthProvider>
        <header className="p-3 bg-dark text-white">
          <div className="container">
            <div className="content-box">
              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <a href="/" className="nav-link px-2 text-secondary">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link px-2 text-white">
                    Players
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link px-2 text-white">
                    Clans
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
              <ButtonsHeader />
            </div>
          </div>
        </header>
      </AuthProvider>
    </>
  );
};

const ButtonsHeader = () => {
  const { user, isAuthenticated, login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const handlerProfile = () => {
    if (user) {
      const { nickname: user_name, region } = user;
      const link = `/${region}/player/${user_name}`;
      navigate(link, { replace: true });
    }
  };

  return (
    <div className="text-end">
      {isAuthenticated ? (
        <>
          <Button
            type="primary"
            className="btn btn-outline-light me-2"
            onClick={handlerProfile}
          >
            Profile
          </Button>
          <Button
            type="primary"
            className="btn btn-outline-light me-2"
            onClick={logout}
          >
            Logout
          </Button>
          <Button
            type="primary"
            className="btn btn-outline-light me-2"
            onClick={reset}
          >
            Reset Session
          </Button>
        </>
      ) : (
        <>
          <Button
            type="primary"
            className="btn btn-outline-light me-2"
            onClick={login}
          >
            Login
          </Button>
        </>
      )}
    </div>
  );
};

export default Header;
