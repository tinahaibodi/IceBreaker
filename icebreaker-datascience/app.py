from flask import Flask, request
import json
import pprint
import os

app = Flask(__name__)

import http.client, urllib.request, urllib.parse, urllib.error, base64, requests, json

def getMostRecent(path):
	print("path: "+path)
	images = os.listdir(path)
	last = images[-1]
	
	return last

@app.route("/")
def getQuestion():
	return "Hello World!"

@app.route("/getPhotoFeedback", methods=['GET'])
def getPhotoFeedback():
	streamId = request.args.get('streamId')
	dataFolder = "/Users/stanleysu/Desktop/icebreaker/data/"
	path = dataFolder+str(streamId)+"/emotions/"

	image = getMostRecent(path)


	f = open(path+image, 'r')
	data = json.loads(f.readline())
	data = json.loads(data)

	result = []

	badEmo = 0.1

	if (data[0]['faceAttributes']['emotion']['anger'] >= badEmo or
		data[0]['faceAttributes']['emotion']['contempt'] >= badEmo or
		data[0]['faceAttributes']['emotion']['disgust'] >= badEmo or
		data[0]['faceAttributes']['emotion']['fear'] >= badEmo or
		data[0]['faceAttributes']['emotion']['sadness'] >= badEmo):
		result.append("Cheer up! Have a smile on your face :)")

	headT = 0.1
	if (abs(data[0]['faceAttributes']['headPose']['pitch']) >= headT or
		abs(data[0]['faceAttributes']['headPose']['roll']) >= headT or
		abs(data[0]['faceAttributes']['headPose']['yaw']) >= headT):
		result.append("Keep your head straight and make eye contact!")

	if (data[0]['faceAttributes']['occlusion']['eyeOccluded'] == True):
		result.append("Be sure to have full eye contact with your date!")

	return json.dumps(result)

if __name__ == "__main__":
	app.run()
