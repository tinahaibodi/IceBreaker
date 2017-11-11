import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          <div className="row">
            <div className="col-md-4">
            a
            </div>
            <div className="col-md-4">
              <canvas id="canvas"  width = {360}  height={240} />
            </div>
            <div className="col-md-4">
            c
            </div>
          </div>
      </div>
    );
  }
}

export default App;
