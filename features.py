import json
f = open('1510473753805.dat', 'r')

line = json.loads(f.readline())
face = line

def feedback (line):
    result = []

    badEmo = 0.1

    if (line[0]['faceAttributes']['emotion']['anger'] >= badEmo or
        line[0]['faceAttributes']['emotion']['contempt'] >= badEmo or
        line[0]['faceAttributes']['emotion']['disgust'] >= badEmo or
        line[0]['faceAttributes']['emotion']['fear'] >= badEmo or
        line[0]['faceAttributes']['emotion']['sadness'] >= badEmo):
        result.append("Cheer up! Have a smile on your face :)")

    headT = 0.1
    if (abs(line[0]['faceAttributes']['headPose']['pitch']) >= headT or
        abs(line[0]['faceAttributes']['headPose']['roll']) >= headT or
        abs(line[0]['faceAttributes']['headPose']['yaw']) >= headT):
        result.append("Keep your head straight and make eye contact!")

    if (line[0]['faceAttributes']['occlusion']['eyeOccluded'] == True):
        result.append("Be sure to have full eye contact with your date!")

    return result

print (feedback(line))