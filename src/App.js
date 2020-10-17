import React from 'react';
import './App.css';
// import Footer from './components/footer';
import { BrowserRouter as Router} from 'react-router-dom';
import AppRouting from "./components/app_routing";

const App = () => (
  <div
    className="App"
  >
    <div style={{margin: '0 auto'}}>
      <Router>
        <AppRouting />
      </Router>
    </div>
  </div>
);

export default App;
