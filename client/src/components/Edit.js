import axios from "axios";
import { useState } from "react";
import close from "../img/close.png";

const Edit = ({ apiUrl, setShowEdit, currentPassword, editPassword }) => {
  const [appName, setAppName] = useState(currentPassword.appName);
  const [username, setUsername] = useState(currentPassword.username);
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
      .put(
        `${apiUrl}/password/${currentPassword._id}`,
        {
          appName,
          username,
          password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        editPassword(response.data);
        setShowEdit(false);
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
            setShowEdit(false);
          }}
        >
          <img src={close} alt="Close button" width="50" />
        </div>
        <h1>Edit Password</h1>
        <div className="form-control">
          <h4>App name</h4>
          <input
            type="text"
            value={appName}
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
            value={username}
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
            value={password}
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
            value={confirmPassword}
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

export default Edit;
