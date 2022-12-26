import cv2
import json
import base64
import random
import threading
import imageio.v2 as imageio

import redis as rd
from paho.mqtt import client as mqtt_client

print("Execute")
r = rd.StrictRedis('redis', 6379)

broker = 'fenix.devbit.be'
port = 38883
topic = "processor/input"
client_id = f'voronoiAPI-{random.randint(0, 1000)}'

def connect_mqtt():
  def on_connect(client, userdata, flags, rc):
    if rc == 0:
      print("Connected to MQTT Broker!")
    else:
      print("Failed to connect, return code %d\n", rc)
  
  client = mqtt_client.Client(client_id)
  client.tls_set(ca_certs="./certs/ca.crt", certfile="./certs/client/client.crt", keyfile="./certs/client/client.key")
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
    return image
  except Exception as e:
    return None

def process_image(image):
  r.lpush("voronoi", cv2.imencode('.jpg', image)[1].tobytes())
  processed = r.brpop("processed")

  return processed

def process_video(frames):
  processed = dict()
  for i, frame in enumerate(frames):
    processed_frame = process_image(frame)
    json_data =  json.loads(processed_frame[1].decode('utf-8'))
    processed[f"frame{i}"] = json_data['frame']
  return processed

def redis_loop():
  while True:
    media = r.brpop("process")
    base64Media = base64.b64encode(media[1]).decode('ascii')

    frames = try_read_as_video(media)

    if (frames):
      processed_vid = process_video(frames)
      client.publish('processor/out', json.dumps({
        "original": base64Media,
        "processed": json.dumps(processed_vid)
      }))
      continue

    image = try_read_as_image(media)
    if image is not None:
      processed_img = process_image(image)
      client.publish('processor/out', json.dumps({
        "original": base64Media,
        "processed": json.loads(processed_img[1])
      }))
      continue

    print("Invalid media format")

def subscribe_to_topics(client: mqtt_client):
  def on_message(client, userdata, msg):
    r.lpush('process', msg.payload)
  
  client.subscribe("processor/in")
  client.on_message = on_message


def main():
  process_loop = threading.Thread(target=redis_loop, daemon=True)
  process_loop.start()

  subscribe_to_topics(client)

  client.loop_forever()

if __name__ == "__main__":
  main()
