import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "../css/PasswordEntity.css";

const PasswordEntity = ({ apiUrl, _id, appName, username, setShowEdit, setShowDelete, setCurrentPassword }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const popupRef = useRef();

  useEffect(() => {
    const checkClickOutside = (e) => {
      if (showPopup && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", checkClickOutside);
    return () => {
      document.removeEventListener("mousedown", checkClickOutside);
    };
  }, [showPopup]);

  const hideShowPassword = () => {
    if (showPassword) {
      axios
        .get(`${apiUrl}/password/${_id}`, { withCredentials: true })
        .then((response) => {
          setPassword(response.data);
          navigator.clipboard.writeText(response.data);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setPassword("");
      setCopied(false);
      navigator.clipboard.writeText("");
    }
    // Invert showPassword
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-entity">
      {showPopup && (
        <div className="popup" ref={popupRef}>
          <div
            className="popup-item"
            onClick={() => {
              setShowPopup(false);
              setShowEdit(true);
              setShowPassword(true);
              setCurrentPassword({ _id, appName, username });
            }}
          >
            Edit
          </div>
          <div
            className="popup-item"
            onClick={() => {
              setShowPopup(false);
              setShowDelete(true);
              setShowPassword(true);
              setCurrentPassword({ _id, appName, username });
            }}
          >
            Delete
          </div>
        </div>
      )}
      <div className="info">
        <h1>{appName}</h1>
        <h3>{username}</h3>
        <h3>{showPassword ? String.fromCharCode(8226).repeat(20) : password}</h3>
      </div>
      <div className="password-btns">
        <i
          className="fas fa-ellipsis-h fa-lg btn"
          onClick={() => {
            setShowPopup(true);
          }}
        ></i>
        <div className={`eye${copied ? " active" : ""}`} onClick={hideShowPassword}>
          {showPassword ? <i className="fas fa-lg fa-eye btn"></i> : <i className="fas fa-lg fa-eye-slash btn"></i>}
        </div>
      </div>
    </div>
  );
};

export default PasswordEntity;
