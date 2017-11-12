import React, { Component } from 'react';
import { captureUserMedia, guid, getTimeStamp} from './utils';
import RecordRTC from 'recordrtc';
import io from 'socket.io-client';
import Recorder from 'recorder-js';

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);

const audioContext =  new (window.AudioContext || window.webkitAudioContext)();

const recorder = new Recorder(audioContext);
navigator.mediaDevices.getUserMedia({audio: true})
  .then(stream => recorder.init(stream))
  .catch(err => console.log('Uh oh... unable to get stream...', err));

const socket = io('http://localhost:3002');

class WebcamRecorder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordVideo: null,
      src: null,
      id: guid()
    };

    console.log(this.state.id);

    this.requestUserMedia = this.requestUserMedia.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.snapshot = this.snapshot.bind(this);
    this.snapshotSound = this.snapshotSound.bind(this);
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
    		<video autoPlay muted src={this.state.src} />
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

  snapshot() {
    console.log("snap");

    var canvas = window.canvas = document.querySelector('canvas');
    var video = document.querySelector('video');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL('image/png');
    socket.emit('videoData', { id: this.state.id, imageData: data, ts: getTimeStamp() });
  }

  snapshotSound() {
    console.log("snapshotSound");
    recorder.stop().then(({blob, buffer}) => {
      console.log("blob: "+ blob);
      socket.emit('soundData', { id: this.state.id, soundData: blob, ts: getTimeStamp()});
    });
    // recorder.clear()
    recorder.start()
  }

  startRecord() {
    if(this.snapshotRecorder == null){
      
      console.log("Start recording");
      captureUserMedia((stream) => {
        this.setState({
          recordVideo: RecordRTC(stream, { type: 'video' })
        });
        this.state.recordVideo.startRecording();
      });

      this.snapshotRecorder = setInterval(
        this.snapshot.bind(this)
      , 1000);

      this.snapshotSoundRecorder = setInterval(
        this.snapshotSound.bind(this)
      , 6000);

      recorder.start();
    }

  }

  stopRecord() {
    if(this.snapshotRecorder != null){
      console.log("Stop recording");
      
      clearInterval(this.snapshotRecorder);
   
      this.state.recordVideo.stopRecording(() => {
        let params = {
          type: 'video/webm',
          data: this.state.recordVideo.blob,
          id: Math.floor(Math.random()*90000) + 10000
        }
      });
      this.snapshotSound()
      clearInterval(this.snapshotSoundRecorder);

    }
  }

}

export default WebcamRecorder;
