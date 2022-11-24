"""
@author: Joey De Smet
"""

import redis as rd
import numpy as np

class Lannootree:
  def __init__(self) -> None:
    self.panel = np.load('./numpy_saves/panel.npy')
    self.panel_LED_indexes = np.load('./numpy_saves/panel_led_indexes.npy')

    self.__init_config__()
    self.__init_redis__()
    self.__init_mqtt__()

  def start(self):
    while True:
      # Get next image from redis
      img = self.redis.lpop('image')

      # Convert image 
  
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
    
    screen_LED_indexes = np.zeros(nPanels*self.panel_LED_indexes.shape[0],dtype=int)
    for i in range(nPanels):
      screen_LED_indexes[self.panel_LED_indexes.shape[0]*i:self.panel_LED_indexes.shape[0]*i+self.panel_LED_indexes.shape[0]] = self.panel_LED_indexes+self.panel_LED_indexes.shape[0]*i


  def __init_redis__(self):
    self.redis = rd.Redis(
      host='redis',
      port=6379
    )

  def __init_mqtt__(self):
    pass

