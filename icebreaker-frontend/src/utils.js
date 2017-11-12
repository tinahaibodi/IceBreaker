export function captureUserMedia(callback) {  
  var params = { audio: true, video: true };
  navigator.getUserMedia(params, callback, (error) => {
    alert(JSON.stringify(error));
  });
};

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

export function getTimeStamp(){
	var date = new Date();
	return date.getTime();
}

