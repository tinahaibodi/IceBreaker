import React, { Component } from 'react';
import { captureUserMedia } from './utils';
import RecordRTC from 'recordrtc';

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);

class WebcamRecorder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordVideo: null,
      src: null
    };

    this.requestUserMedia = this.requestUserMedia.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);

  }

  componentDidMount() {  
    if(!hasGetUserMedia) {
      alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
      return;
    }
    this.requestUserMedia();
  }

  render() {
  	return(
      <div>
    		<video autoPlay src={this.state.src} />
        <input type="button" value="Start" onClick={this.startRecord} />
        <input type="button" value="Stop" onClick={this.stopRecord} />
        <input type="button" value="Snapshot" onClick={this.snapshot} />
        <canvas />
      </div>
  	);
  }

  requestUserMedia() {
    console.log('requestUserMedia')
    captureUserMedia((stream) => {
      this.setState({ src: window.URL.createObjectURL(stream) });
      console.log('setting state', this.state)
    });
  }

  startRecord() {
    console.log("Start recording");
    captureUserMedia((stream) => {
      this.setState({
        recordVideo: RecordRTC(stream, { type: 'video' })
      });
      this.state.recordVideo.startRecording();
    });
  }

  stopRecord() {
    console.log("Stop recording");
    this.state.recordVideo.stopRecording(() => {
      let params = {
        type: 'video/webm',
        data: this.state.recordVideo.blob,
        id: Math.floor(Math.random()*90000) + 10000
      }
    });
  }

  snapshot() {
    var canvas = window.canvas = document.querySelector('canvas');
    var video = document.querySelector('video');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  }

}

export default WebcamRecorder;
