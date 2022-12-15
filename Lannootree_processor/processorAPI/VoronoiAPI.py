import cv2
import random
import imageio
import redis as rd
from paho.mqtt import client as mqtt_client

r = rd.StrictRedis('localhost', 6379)

broker = 'lannootree.devbitapp.be'
port = 8883
topic = "processor/input"
client_id = f'voronoiAPI-{random.randint(0, 1000)}'

def connect_mqtt():
  def on_connect(client, userdata, flags, rc):
    if rc == 0:
      print("Connected to MQTT Broker!")
    else:
      print("Failed to connect, return code %d\n", rc)
  
  client = mqtt_client.Client(client_id)
  client.tls_set(ca_certs="../../certs/ca.crt", certfile="../../certs/client/client.crt", keyfile="../../certs/client/client.key")
  client.on_connect = on_connect
  client.connect(broker, port)
  return client

client = connect_mqtt()

def try_read_as_video(media):
  try:
    frames = imageio.mimread(media[1], memtest=False)
    return frames
  except Exception as e:
    return False

def try_read_as_image(media):
  try:
    image = imageio.imread(media[1])
  except Exception as e:
    return False

def process_image(image):
  r.lpush("voronoi", cv2.imencode('.jpg', image)[1].tobytes())

  processed = r.brpop("processed")

  print(processed[1])
  # client.publish("")

while True:
  media = r.brpop("voronoi")

  frames = try_read_as_video(media)

  if (frames):
    process_video(frames)
    continue

  image = try_read_as_image(media)
  if (image):
    process_image(image)
    continue

  print("Invalid media format")
