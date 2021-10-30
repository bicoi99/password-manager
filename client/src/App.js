import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./css/App.css";

const App = () => {
  const apiUrl = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://api.huynhatduong.com";

  return (
    <Router>
      <Route exact path="/">
        <Home apiUrl={apiUrl} />
      </Route>
      <Route path="/login">
        <Login apiUrl={apiUrl} />
      </Route>
    </Router>
  );
};

export default App;
