import cv2
import random
import threading
import imageio.v2 as imageio
from paho.mqtt import client as mqtt_client

broker = 'fenix.devbit.be'
port = 38883
topic = "processor/input"
client_id = f'voronoiAPITesterBot-{random.randint(0, 1000)}'

def on_connect(client, userdata, flags, rc):
  if rc == 0:
    print("Connected to MQTT Broker!")
    with open("./img/homer.gif", 'rb') as image:
      print("Publishing")
      binimg = image.read()
      client.publish('processor/in', binimg)
  else:
    print("Failed to connect, return code %d\n", rc)

def connect_mqtt():
  print("Connect mqtt")
  
  client = mqtt_client.Client(client_id)
  client.tls_set(ca_certs="../../certs/ca.crt", certfile="../../certs/client/client.crt", keyfile="../../certs/client/client.key")
  client.on_connect = on_connect
  client.connect(broker, port)
  return client

def subscribe_to_topics(client: mqtt_client):
  def on_message(client, userdata, msg):
    print(msg.payload)
  
  client.subscribe("processor/out")
  client.on_message = on_message


client = connect_mqtt()
subscribe_to_topics(client)
client.loop_forever()
