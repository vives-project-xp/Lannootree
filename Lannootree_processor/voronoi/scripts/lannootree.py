"""
@author: Joey De Smet
"""

import cv2
import json
import imageio
import redis as rd
import numpy as np

def draw_voronoi(img, facets, indices, frame, gray):
  colors = []

  for i in range(len(facets)):
    # Convert facets to int32
    ifacet = facets[i].astype(np.int32)

    # Create mask for polygon
    mask = np.zeros_like(gray)
    cv2.fillPoly(mask,[ifacet.astype(np.int32)],(255))

    # Get masked values
    values = frame[np.where(mask == 255)]

    # Calculate average color
    color = (np.average(values,axis=0))
    
    # Gamma correction
    cor_color = (np.power(color/255, 2.4) * 255).astype(int) 
    colors.append(cor_color)

    # Fill in polygon with average color
    cv2.fillConvexPoly(img, ifacet, color, cv2.LINE_AA, 0)

    # Add data in correct way
  cstring = []
  for i in np.argsort(indices):
    cor_color = colors[i]
    cstring.append(cor_color[0])
    cstring.append(cor_color[1])
    cstring.append(cor_color[2])

  return list(cstring)

class Lannootree:
  def __init__(self) -> None:
    self.panel = np.load('./numpy_saves/panel.npy')
    self.panel_LED_indexes = np.load('./numpy_saves/panel_led_indexes.npy')

    self.__init_config__()
    self.__init_redis__()

  def start(self):
    # Get next image from redis
    self.i = 0
    while True:
      img = self.redis.brpop('voronoi')

      with open('./img/current.gif', 'wb') as f:
        f.write(img[1])

      frames = imageio.mimread('./img/current.gif')
      size = frames[0].shape

      # Scale to image
      xm = np.max(self.screen[:,0])
      ym = np.max(self.screen[:,1])

      scale = np.min([size[0]/ym, size[1]/xm]) * 0.9

      new_screen = self.screen * scale

      # Shift screen right up
      xt = np.abs(np.max(new_screen[:,0])-size[1])/2
      yt = np.abs(np.max(new_screen[:,1])-size[0])/2

      new_screen = new_screen + np.array([xt, yt])

      points = new_screen

      # Image size
      rect = (0, 0, size[1], size[0])

      # Create an instance of Subdiv2Dq
      subdiv = cv2.Subdiv2D(rect)

      # Insert points into subdiv
      for p in points :
          subdiv.insert(tuple(p))

      # Allocate space for Voronoi Diagram
      img_voronoi = np.zeros(frames[0].shape, dtype = frames[0].dtype)
      ( facets, centers) = subdiv.getVoronoiFacetList([])  

      processed = dict()

      for i, frame in enumerate(frames):
        print(f'processing frame [{i + 1}/{len(frames)}]')

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        image_height, image_width, _ = frame.shape

        cstring = draw_voronoi(img_voronoi, facets, self.screen_LED_indexes, frame, gray)

        data_to_send = []
        for c in cstring:
          data_to_send.append(int(c))

        processed[f"frame{i}"] = data_to_send

      with open(f"./processed_json/{self.i}.json", "w") as f:
        json.dump(processed, f, indent=2)
      
      self.i += 1

  def __init_config__(self):
    dsubx = 107.76
    dsuby = 109.03
    dx = 3*dsubx
    dy = 3*dsuby

    # TODO: Change this to read config file
    width, height = 2, 2
    nPanels = width * height
    
    self.screen = np.zeros((nPanels * self.panel.shape[0], 2))
    for w in range(width):
      for h in range(height):
        idx = self.panel.shape[0] * (w + h * width)
        self.screen[idx:idx+self.panel.shape[0],:] = self.panel + np.tile([w * dx, (1-h) * dy], [self.panel.shape[0],1])

    # Make all positive
    x0 = np.min(self.screen[:,0])
    y0 = np.min(self.screen[:,1])

    self.screen = self.screen - np.array([x0, y0])
    
    self.screen_LED_indexes = np.zeros(nPanels*self.panel_LED_indexes.shape[0],dtype=int)
    for i in range(nPanels):
      self.screen_LED_indexes[self.panel_LED_indexes.shape[0]*i:self.panel_LED_indexes.shape[0]*i+self.panel_LED_indexes.shape[0]] = self.panel_LED_indexes+self.panel_LED_indexes.shape[0]*i


  def __init_redis__(self):
    self.redis = rd.Redis(
      host='localhost',
      port=6379
    )

