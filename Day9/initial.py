
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore



cred = credentials.Certificate('./serviceAccount.json')


firebase_admin.initialize_app(cred)


db = firestore.client()

from hashlib import sha1
import hmac
from wsgiref.handlers import format_date_time
from datetime import datetime
from time import mktime
import base64
from requests import request
from pprint import pprint
import json

app_id = ''
app_key = ''

class Auth():

    def __init__(self, app_id, app_key):
        self.app_id = app_id
        self.app_key = app_key

    def get_auth_header(self):
        xdate = format_date_time(mktime(datetime.now().timetuple()))
        hashed = hmac.new(self.app_key.encode('utf8'), ('x-date: ' + xdate).encode('utf8'), sha1)
        signature = base64.b64encode(hashed.digest()).decode()

        authorization = 'hmac username="' + self.app_id + '", ' + \
                        'algorithm="hmac-sha1", ' + \
                        'headers="x-date", ' + \
                        'signature="' + signature + '"'
        return {
            'Authorization': authorization,
            'x-date': format_date_time(mktime(datetime.now().timetuple())),
            'Accept - Encoding': 'gzip'
        }
        


import os
import time
from apscheduler.schedulers.blocking import BlockingScheduler
def tick():
    global str1
    a = Auth(app_id, app_key)
    response = request('get', "https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/InterCity/9018?$filter=Direction%20eq%20'0'&$top=150&$format=JSON", headers= a.get_auth_header())

    str1 = str(response.content,'utf-8')

    jsonValue = json.loads(str1)


    for item in jsonValue:
        #PlateNumb
        print('GPSTime:'+item['GPSTime'])
        print(item['BusPosition']['PositionLat'])
        print('經度:',item['BusPosition']['PositionLon'])
        print('Speed',item['Speed'])
        doc = {
            'PlateNumb': item['PlateNumb'],
            'GPSTime': item['GPSTime'],
            'Lat':item['BusPosition']['PositionLat'],
            'Lon':item['BusPosition']['PositionLon'],
            'Speed':item['Speed']
        }
        doc_ref = db.collection("bus").document(item['GPSTime'])
        doc_ref.set(doc)

if __name__ == '__main__':
    scheduler = BlockingScheduler()
    scheduler.add_job(tick, 'interval', seconds=5)
    print('Press Ctrl+{0} to exit'.format('Break' if os.name == 'nt' else 'C    '))

    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        pass