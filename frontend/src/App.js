import { BrowserRouter as Router, Route } from "react-router-dom";
import GameScreen from "./screens/GameScreen";
import HomeScreen from "./screens/HomeScreen";

const App = () => {
  <Router>
    <Route path="/game" exactscomponent={GameScreen} />
    <Route path="/" exact component={HomeScreen} />
  </Router>;
};

export default App;
