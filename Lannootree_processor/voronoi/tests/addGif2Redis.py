#!/usr/bin/env python

import os
import redis as rd

r = rd.StrictRedis('localhost', 6379)

# for files in os.listdir('./img'):
#   if files.endswith('.gif') or files.endswith('.jpg'):
#     gif = open(f"./img/{files}", 'rb')
#     r.lpush('voronoi', gif.read())
#     gif.close()
#   else:
    # continue

# After testing: pip uininstall pyautogui
import cv2
import time
import pyautogui
import numpy as np

while True:
  image = pyautogui.screenshot()
  image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

  r0 = 500.0 / image.shape[1]
  dim = (500, int(image.shape[0] * r0))

  image = cv2.resize(image, dim, interpolation=None)

  cv2.imwrite('screenshot.png', image)

  img = open('./screenshot.png', 'rb')

  r.lpush('voronoi', img.read())

  img.close()
  time.sleep(0.033)
