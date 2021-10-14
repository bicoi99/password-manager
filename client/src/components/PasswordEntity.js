const PasswordEntity = () => {
  return (
    <div className="password-entity">
      <div className="info">
        <h1>app_name</h1>
        <h3>username</h3>
        <h3>
          &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
        </h3>
      </div>
      <div className="hide-show">
        <i className="fas fa-lg fa-eye btn"></i>
        {/* <i className="fas fa-lg fa-eye-slash btn"></i> */}
      </div>
      <div className="password-buttons">
        <i className="fas fa-lg fa-edit btn"></i>
        <i className="fas fa-lg fa-trash btn"></i>
      </div>
    </div>
  );
};

export default PasswordEntity;
