import axios from "axios";
import { useState } from "react";
import close from "../img/close.png";
import generatePassword from "../utils/generatePassword";

const Edit = ({ apiUrl, setShowEdit, currentPassword, editPassword }) => {
  const [appName, setAppName] = useState(currentPassword.appName);
  const [username, setUsername] = useState(currentPassword.username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleNewPassword = () => {
    const generatedPassword = generatePassword();
    setPassword(generatedPassword);
    setCopied(false);
  };

  const handleCopied = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
          <div className="password-form-item">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {showPassword && (
              <div className={`copy-password${copied ? " active" : ""}`} onClick={handleCopied}>
                <i className="far fa-copy"></i>
              </div>
            )}
            <div className="new-password" onClick={handleNewPassword}>
              <i className="fas fa-sync"></i>
            </div>
          </div>
        </div>
        <div className="form-control">
          <h4>Confirm password</h4>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            required
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <span className="incorrect-creds">{passwordError}</span>
          <div className="show-password-checkbox">
            <input
              type="checkbox"
              name="showPassword"
              onClick={() => {
                setShowPassword(!showPassword);
                navigator.clipboard.writeText("");
              }}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
        </div>
        <button className="form-btn">SUBMIT</button>
      </form>
    </div>
  );
};

export default Edit;
