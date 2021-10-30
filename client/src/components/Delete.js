import axios from "axios";
import "../css/Delete.css";

const Delete = ({ apiUrl, setShowDelete, _id, deletePassword }) => {
  const deleteFromApi = () => {
    axios
      .delete(`${apiUrl}/password/${_id}`, { withCredentials: true })
      .then(() => {
        deletePassword(_id);
        setShowDelete(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="modal-bg">
      <div className="delete-modal">
        <h3>Are you sure you want to delete?</h3>
        <div className="delete-btns">
          <button
            className="cancel-btn"
            onClick={() => {
              setShowDelete(false);
            }}
          >
            Cancel
          </button>
          <button className="confirm-btn" onClick={deleteFromApi}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
