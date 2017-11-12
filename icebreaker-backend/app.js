var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var io = require('socket.io')();
var fs = require('fs');


makeblob = function (dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

function processImage(emotionFolder, ts, imageData) {
    // console.log(imageData);
    console.log(imageData instanceof Buffer);
    // imageData = makeblob(imageData);
    // imageData = binEncode(imageData);

    var subscriptionKey = "a46cc4b89d1448678cd8769c804ad73f";
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "true",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    };
    var sourceImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg'

    var options = {
    	url: uriBase,
    	headers: {
    		"Content-Type": "application/octet-stream",
    		"Ocp-Apim-Subscription-Key": subscriptionKey
    	},
    	body: imageData,
    	qs: params,
    	method: 'POST',
      processData: false
   	}

    request(options, function(err, res, body){
    	if(err){
    		console.log("Microsoft Cognitive services error");
    	}
    	console.log("response: "+body);
    	fs.writeFileSync(emotionFolder+ts+'.dat', JSON.stringify(body), 'utf8', function (err) {
		    if (err) {
		        return console.log(err);
		    }
		});
    });
};



io.on('connection', function(client){
	console.log("Connected: "+client);
	client.on('videoData', function(data){
		console.log("videoData: "+data.id+" "+data.ts);
		var base64DataTrunc = data.imageData.replace(/^data:image\/png;base64,/, "");
	    var streamFolder = '../data/'+data.id+'/';
	    var streamFolderPictures = '../data/'+data.id+'/pictures/';
	    var streamFolderEmotions = '../data/'+data.id+'/emotions/';
	    if (!fs.existsSync(streamFolder)){
	      fs.mkdirSync(streamFolder);
	      fs.mkdirSync(streamFolderPictures);
	      fs.mkdirSync(streamFolderEmotions);
	    }
	    var imagePath = streamFolderPictures+data.ts+".png";

	    fs.writeFileSync(imagePath, base64DataTrunc, 'base64');
		
      var base64Reloaded = new Buffer(fs.readFileSync(imagePath, 'binary'), 'binary');
		  processImage(streamFolderEmotions, data.ts, base64Reloaded);

	});
});

io.listen(3002);

module.exports = app;

