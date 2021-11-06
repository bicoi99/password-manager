import axios from "axios";
import { useState } from "react";
import "../css/PasswordEntity.css";

const PasswordEntity = ({ apiUrl, _id, appName, username, setShowEdit, setShowDelete, setCurrentPassword }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("password");
  const [copied, setCopied] = useState(false);

  const hideShowPassword = () => {
    if (showPassword) {
      axios
        .get(`${apiUrl}/password/${_id}`, { withCredentials: true })
        .then((response) => {
          setPassword(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setPassword("password");
    }
    // Invert showPassword
    setShowPassword(!showPassword);
  };

  const handleCopied = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="password-entity">
      <div className="info">
        <h1>{appName}</h1>
        <h3>{username}</h3>
        <h3>{showPassword ? String.fromCharCode(8226).repeat(20) : password}</h3>
      </div>
      <div className="password-btns">
        <div className="edit-delete">
          <i
            className="fas fa-lg fa-edit btn"
            onClick={() => {
              setShowEdit(true);
              setShowPassword(true);
              setCurrentPassword({ _id, appName, username });
            }}
          ></i>
          <i
            className="fas fa-lg fa-trash btn"
            onClick={() => {
              setShowDelete(true);
              setShowPassword(true);
              setCurrentPassword({ _id, appName, username });
            }}
          ></i>
        </div>
        <div className="show-copy">
          <div className="eye" onClick={hideShowPassword}>
            {showPassword ? <i className="fas fa-lg fa-eye btn"></i> : <i className="fas fa-lg fa-eye-slash btn"></i>}
          </div>
          {!showPassword && (
            <div className={`copy-password${copied && " active"}`} onClick={handleCopied}>
              <i className="fas fa-copy fa-lg btn"></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordEntity;
