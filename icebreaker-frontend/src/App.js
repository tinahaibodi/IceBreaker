import React, { Component } from 'react';
import './App.css';
import WebcamRecorder from './webcamRecorder';

class App extends Component {
  render() {
    return (
      <div className="App">
          <div className="row">
            <div className="col-md-4">
              Profile Column
            </div>
            <div className="col-md-8">
              Main Column
              <br />
              <WebcamRecorder />
            </div>
          </div>
      </div>
    );
  }
}

export default App;
