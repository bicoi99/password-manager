import axios from "axios";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import Add from "../components/Add";
import Delete from "../components/Delete";
import Edit from "../components/Edit";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import PasswordEntity from "../components/PasswordEntity";
import add from "../img/add.png";
import "../css/Home.css";

const Home = ({ apiUrl }) => {
  // States
  const [username, setUsername] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPassword, setCurrentPassword] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  // Run at component render
  useEffect(() => {
    setLoading(true);
    axios
      .get(apiUrl + "/auth/user", { withCredentials: true })
      .then((userResponse) => {
        setUsername(userResponse.data);
        // Make passwords request
        return axios.get(apiUrl + "/password", { withCredentials: true });
      })
      .then((passwordResponse) => {
        setPasswords(passwordResponse.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data.message);
        }
        setLoading(false);
        setRedirect(true);
      });
  }, [apiUrl]);

  // Auth functions
  const logout = () => {
    axios.post(apiUrl + "/auth/logout", {}, { withCredentials: true });
  };

  // Password functions
  const addPassword = (newPassword) => {
    setPasswords([...passwords, newPassword]);
  };

  const deletePassword = (_id) => {
    setPasswords([...passwords].filter((password) => password._id !== _id));
  };

  const editPassword = (newPassword) => {
    setPasswords(
      [...passwords].map((password) => {
        return newPassword._id === password._id ? newPassword : password;
      })
    );
  };

  // Utility functions
  const sortAndFilterPasswords = (passwords) => {
    return [...passwords]
      .sort((a, b) =>
        a.appName.toUpperCase() > b.appName.toUpperCase()
          ? 1
          : b.appName.toUpperCase() > a.appName.toUpperCase()
          ? -1
          : 0
      )
      .filter((password) => password.appName.toUpperCase().includes(search.toUpperCase()));
  };

  // Redirect if unauthenticated
  if (redirect) {
    return <Redirect to="/login" />;
  }

  return loading ? (
    <Loader />
  ) : (
    <div className="home-bg">
      {showAdd && <Add apiUrl={apiUrl} setShowAdd={setShowAdd} addPassword={addPassword} />}
      {showEdit && (
        <Edit apiUrl={apiUrl} setShowEdit={setShowEdit} currentPassword={currentPassword} editPassword={editPassword} />
      )}
      {showDelete && (
        <Delete
          apiUrl={apiUrl}
          setShowDelete={setShowDelete}
          _id={currentPassword._id}
          deletePassword={deletePassword}
        />
      )}
      <Navbar username={username} logout={logout} />
      <div className="home-container">
        <div className="flex-container">
          <div
            className="add-btn btn"
            onClick={() => {
              setShowAdd(true);
            }}
          >
            <img src={add} alt="add button" width="50" />
          </div>
          <div className="search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search app name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <div
              className="cancel-search"
              onClick={() => {
                setSearch("");
              }}
            >
              <i className="fas fa-times"></i>
            </div>
          </div>
          {sortAndFilterPasswords(passwords).map(({ _id, appName, username }) => {
            return (
              <PasswordEntity
                key={_id}
                apiUrl={apiUrl}
                _id={_id}
                appName={appName}
                username={username}
                setShowEdit={setShowEdit}
                setShowDelete={setShowDelete}
                setCurrentPassword={setCurrentPassword}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
