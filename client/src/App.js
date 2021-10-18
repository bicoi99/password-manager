import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  const apiUrl = "http://localhost:5000";

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
