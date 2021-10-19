import axios from "axios";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import Add from "../components/Add";
import Edit from "../components/Edit";
import Navbar from "../components/Navbar";
import PasswordEntity from "../components/PasswordEntity";
import add from "../img/add.png";

const Home = ({ apiUrl }) => {
  // States
  const [username, setUsername] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPassword, setCurrentPassword] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Run at component render
  useEffect(() => {
    axios
      .get(apiUrl + "/auth/user", { withCredentials: true })
      .then((response) => {
        setUsername(response.data);
        // Make passwords request
        axios
          .get(apiUrl + "/password", { withCredentials: true })
          .then((response) => {
            setPasswords(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch(() => {
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
    if (window.confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${apiUrl}/password/${_id}`, { withCredentials: true })
        .then((res) => {
          console.log(res);
          setPasswords([...passwords].filter((password) => password._id !== _id));
        })
        .catch((err) => {
          console.log(err);
        });
    }
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

  return (
    <div className="home-bg">
      {showAdd && <Add apiUrl={apiUrl} setShowAdd={setShowAdd} addPassword={addPassword} />}
      {showEdit && (
        <Edit apiUrl={apiUrl} setShowEdit={setShowEdit} currentPassword={currentPassword} editPassword={editPassword} />
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
          </div>
          {sortAndFilterPasswords(passwords).map(({ _id, appName, username }) => {
            return (
              <PasswordEntity
                key={_id}
                apiUrl={apiUrl}
                _id={_id}
                appName={appName}
                username={username}
                deletePassword={deletePassword}
                setShowEdit={setShowEdit}
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
