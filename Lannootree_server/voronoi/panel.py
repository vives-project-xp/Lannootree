# Has to store points in picture
import numpy as np
# import cupy as cp
from PIL import Image
import functools

def dist(x1, y1, x2, y2, xp):
  d = xp.sqrt((x2 - x1)**2 + (y2 - y1)**2)
  return d

vdist = functools.partial(dist, xp=np) # Uncomment when using numpy
# vdist = functools.partial(dist, xp=cp) # Uncomment when using cupy

class Panel:
  def __init__(self, coordinate, image, panel_dimentions) -> None:
    self.N = 9 # TODO: Get actual point coordiantes instead of this 
    
    self.points = []
    self.im = np.array(image)
    self.coordinate = coordinate
    self.panel_dimentions = panel_dimentions

    self.__generate_points__()
  
  def __generate_points__(self):
    for x in range(self.N):
      for y in range(self.N):
        if ((x == 1 or x == 4 or x == 7) and (y == 1 or y == 4 or y == 7)): continue
        _x = (x * ((self.im.shape[0] // self.panel_dimentions[0]) // self.N)) + (self.coordinate[0] * (self.im.shape[0] // self.panel_dimentions[0])) + np.random.randint(0, 1)
        _y = (y * ((self.im.shape[1] // self.panel_dimentions[1]) // self.N)) + (self.coordinate[1] * (self.im.shape[1] // self.panel_dimentions[1])) + np.random.randint(0, 1)
        self.points.append((_x, _y))


    # for i in range(72):
    #   x_min = self.coordinate[0] * (self.im.shape[0] // self.panel_dimentions[0])
    #   x_max = x_min + (self.im.shape[0] // self.panel_dimentions[0])

    #   y_min = self.coordinate[1] * (self.im.shape[1] // self.panel_dimentions[1])
    #   y_max = y_min + (self.im.shape[1] // self.panel_dimentions[1])

    #   _x = np.random.randint(x_min, x_max) + 1
    #   _y = np.random.randint(y_min, y_max) + 1

    #   self.points.append((_x, _y))


  def get_points(self):
    _x_coords = []
    _y_coords = []

    for p in self.points:
      _x_coords.append(p[0])
      _y_coords.append(p[1])
    
    return _x_coords, _y_coords

  def get_colors(self):
    nx, ny = self.im.shape[0], self.im.shape[1]
    xx = np.arange(0, nx, 1)
    yy = np.arange(0, ny, 1) 

    newx, newy = self.get_points()

    newx = np.array(newx)
    newy = np.array(newy)

    distances = np.empty((newx.shape[0], yy.shape[0], xx.shape[0]))

    vnewx = np.transpose(np.tile(newx, [len(xx), len(yy), 1]), (2, 1, 0))
    vnewy = np.transpose(np.tile(newy, [len(xx), len(yy), 1]), (2, 1, 0))

    vxx = np.tile(xx, [len(newx), len(yy), 1])
    vyy = np.transpose(np.tile(yy, [len(newx), len(xx), 1]), (0, 2, 1))

    distances = vdist(vnewx, vnewy, vxx, vyy) # Uncomment when using numpy
    # distances = vdist(cp.array(vnewx), cp.array(vnewy), cp.array(vxx), cp.array(vyy)) # Uncomment when using cupy
    
    mind = np.argmin(distances, 0) # Uncomment when using numpy
    # mind = np.argmin(distances.get(), 0) # Uncomment when using cupy

    imr = self.im[:,:,0]
    img = self.im[:,:,1]
    imb = self.im[:,:,2]
    newc = np.zeros((len(newx),3))
    for i in range(newc.shape[0]):
      newc[i,0] = np.mean(imr[np.where(mind==i)])
      newc[i,1] = np.mean(img[np.where(mind==i)])
      newc[i,2] = np.mean(imb[np.where(mind==i)])

    colors = []

    # Get the right format
    # 9 6 9 9 6 9 9 6 9

    a = newc[0 : 9]   # 9
    b = newc[9 : 15]  # 6
    c = newc[15 : 24] # 9
    d = newc[24 : 33] # 9
    e = newc[33 : 39] # 6
    f = newc[39 : 48] # 9
    g = newc[48 : 57] # 9
    h = newc[57 : 63] # 6
    i = newc[63 : 72] # 9

    # print(np.array(a).shape)
    # print(f"{len(a)}, {len(b)}, {len(c)}, {len(d)}, {len(e)}, {len(f)}, {len(g)}, {len(h)}, {len(i)}")

    colors.extend(i)
    colors.extend(h[::-1])
    colors.extend(g)
    colors.extend(f[::-1])
    colors.extend(e)
    colors.extend(d[::-1])
    colors.extend(c)
    colors.extend(b[::-1])
    colors.extend(a)

    # print(np.array(colors).shape)

    colors = np.array(colors)
    colors = np.concatenate(colors, axis=0)
    colors = colors.astype(int)

    return newc, colors.tolist()

  def get_coordinate(self):
    return self.coordinate