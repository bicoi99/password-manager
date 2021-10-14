import axios from "axios";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import Navbar from "../components/Navbar";
import PasswordEntity from "../components/PasswordEntity";
import add from "../img/add.png";

const Home = () => {
  const [username, setUsername] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((response) => {
        setUsername(response.data);
      })
      .catch(() => {
        setRedirect(true);
      });
  }, []);

  const logout = () => {
    axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
  };

  if (redirect) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="home-bg">
      <Navbar username={username} logout={logout} />
      <div className="home-container">
        <div className="add-btn btn">
          <img src={add} alt="add button" width="50" />
        </div>
        <div className="search">
          <i className="fas fa-search"></i>
          <input type="text" />
        </div>
        <PasswordEntity />
        <PasswordEntity />
        <PasswordEntity />
        <PasswordEntity />
        <PasswordEntity />
        <PasswordEntity />
        <PasswordEntity />
      </div>
    </div>
  );
};

export default Home;
