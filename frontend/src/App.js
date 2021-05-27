import { BrowserRouter as Router, Route } from "react-router-dom";
import GameScreen from "./screens/GameScreen";
import HomeScreen from "./screens/HomeScreen";

const App = () => (
  <Router>
    <Route path="/" exact component={HomeScreen} />
    <Route path="/game" component={GameScreen} />
  </Router>
);

export default App;
