import logo from './logo.svg';
import './App.css';
import HomePage from './components/HomePage';
import Login from './components/Login';
import { Switch, Route } from 'react-router-dom';


const App = () => (
  <div className="app-routes">
    <Switch>
      <Route path="/home" component={HomePage} />
      <Route path="/" component={Login} />
    </Switch>
  </div>
);

export default App;
