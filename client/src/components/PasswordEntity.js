import axios from "axios";
import { useState } from "react";

const PasswordEntity = ({ apiUrl, _id, appName, username, deletePassword, setShowEdit, setCurrentPassword }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("password");

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

  return (
    <div className="password-entity">
      <div className="info">
        <h1>{appName}</h1>
        <h3>{username}</h3>
        <h3>{showPassword ? String.fromCharCode(8226).repeat(20) : password}</h3>
      </div>
      <div className="hide-show" onClick={hideShowPassword}>
        {showPassword ? <i className="fas fa-lg fa-eye btn"></i> : <i className="fas fa-lg fa-eye-slash btn"></i>}
      </div>
      <div className="password-buttons">
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
            deletePassword(_id);
          }}
        ></i>
      </div>
    </div>
  );
};

export default PasswordEntity;
