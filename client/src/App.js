import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./routes/Home"
import Login from "./routes/Login"
import Register from "./routes/Register"
import User from "./routes/User"
import Search from "./routes/Search"

import axios from "./utils/axios"

function App() {

  axios.defaults.headers.common['authorization'] = localStorage.getItem("jwt")
  axios.defaults.headers.common["x-functions-key"] = "SCUssx8OwT/2ju4aRqIzp6lSAS1uUQDWeSXw0DWk54DIZQgEXldzkA=="
  
  return (
    <Router>
        <Switch>
          <Route path="/users/:username" component={User} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/search" component={Search} />
          <Route path="/" component={Home} />
        </Switch>
    </Router>
  );
}

export default App;
