import axios from "axios";
import { useState } from "react";
import close from "../img/close.png";

const Add = ({ apiUrl, setShowAdd, addPassword }) => {
  const [appName, setAppName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    // Verify password match
    if (password !== confirmPassword) {
      return setPasswordError("Passwords must match");
    }

    axios
      .post(
        apiUrl + "/password",
        {
          appName,
          username,
          password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        addPassword(response.data);
        setShowAdd(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="modal-bg">
      <form className="modal" onSubmit={submit}>
        <div
          className="modal-close btn"
          onClick={() => {
            setShowAdd(false);
          }}
        >
          <img src={close} alt="Close button" width="50" />
        </div>
        <h1>Add Password</h1>
        <div className="form-control">
          <h4>App name</h4>
          <input
            type="text"
            required
            onChange={(e) => {
              setAppName(e.target.value);
            }}
          />
        </div>
        <div className="form-control">
          <h4>Username</h4>
          <input
            type="text"
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
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
        </div>
        <div className="form-control">
          <h4>Confirm password</h4>
          <input
            type="password"
            required
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <span className="incorrect-creds">{passwordError}</span>
        </div>
        <button className="form-btn">ADD</button>
      </form>
    </div>
  );
};

export default Add;
