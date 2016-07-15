import xml.etree.cElementTree as ET
import urllib2
import json
import os
import time
import shutil

lastLat = ""
lastLng = ""

def getPokemonLocation():
	try:
		response = urllib2.urlopen("http://localhost:8080/position", timeout = 1)
		return json.load(response)
	except urllib2.URLError as e:
		print e.reason

def clickAction():
    os.system("./autoClicker -x 510 -y 820")
    time.sleep(1)
    os.system("./autoClicker -x 510 -y 534")
    print "clicking!!"

def generateXML():
	global lastLat, lastLng
	geo = getPokemonLocation()
	if geo != None:
		if geo["lat"] != lastLat or geo["lng"] != lastLng:
			lastLat = geo["lat"]
			lastLng = geo["lng"]
			gpx = ET.Element("gpx", version="1.1", creator="Xcode")
			wpt = ET.SubElement(gpx, "wpt", lat=str(geo["lat"]), lon=str(geo["lng"]))
			ET.SubElement(wpt, "name").text = "PokemonLocation"
			ET.ElementTree(gpx).write("pokemonLocation_tpm.gpx")
			shutil.copy("pokemonLocation_tpm.gpx", "pokemonLocation.gpx")
			print "Location Updated!", "latitude:", geo["lat"], "longitude:" ,geo["lng"]
			clickAction()

def start():
	while True:
		generateXML()

start()
