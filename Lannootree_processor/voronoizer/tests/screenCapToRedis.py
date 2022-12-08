import cv2
import redis as rd
import numpy as np
from mss import mss 

import time

r = rd.StrictRedis('localhost', 6379)

# 1920 x 1080
bounding_box = {'top': 0, 'left': 0, 'width': 1920, 'height': 1080}
sct = mss()

while True:
  image = sct.grab(bounding_box)
  image = np.array(image)

  r0 = 1080 / image.shape[1]
  dim = (1080, int(image.shape[0] * r0))

  image = cv2.resize(image, dim, interpolation=None)

  r.lpush('voronoi', cv2.imencode('.jpg', image)[1].tobytes())

  time.sleep(0.040)
  