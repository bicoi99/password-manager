import { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";

const Login = ({ apiUrl }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState({
    username: "",
    password: "",
  });

  const submit = (e) => {
    e.preventDefault();

    axios
      .post(
        apiUrl + "/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        setRedirect(true);
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data);
        }
      });
  };

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login-bg">
      <form className="login-box" onSubmit={submit}>
        <h1>Password Manager</h1>
        <div className="form-control">
          <h4>Username</h4>
          <input
            type="text"
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <span className="incorrect-creds">{error.username}</span>
        </div>
        <div className="form-control">
          <h4>Password</h4>
          <input
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <span className="incorrect-creds">{error.password}</span>
        </div>
        <button className="form-btn">LOGIN</button>
      </form>
    </div>
  );
};
export default Login;
