import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
cred = credentials.Certificate('./serviceAccount.json') #firebase存取憑證
firebase_admin.initialize_app(cred)
db = firestore.client()

path = "bus"
collection_ref = db.collection(path)
docs = collection_ref.where('PlateNumb','==','KKA-6103').get()
docs = list(docs)
print('len:',len(docs))
latlon = []
count = 0
import csv
for doc in docs:
    if count > 60 :
        break
    docc = doc.to_dict()
    print(docc['GPSTime'])
    print(docc['Lat'])
    print(docc['Lon'])
    print(docc['Speed'])
    latlon.append([docc['Lat'],docc['Lon']])
    count = count + 1

with open("./latlon.json",'w') as file_object:
    json.dump(latlon,file_object)