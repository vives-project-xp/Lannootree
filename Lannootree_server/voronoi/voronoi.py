import functools
import cupy as cp
import numpy as np
from PIL import Image
import matplotlib.pylab as plt

import panel

N = 324
sqrtN = int(np.sqrt(N))

img_file = './img/homer.png'

img = Image.open(img_file)
img = img.resize([sqrtN * 8, sqrtN * 8])

# TODO: Read config for this
panels = []

for x in range(2):
  for y in range(2):
    panels.append(panel.Panel((x, y), img))

x_points = []
y_points = []

newc = []

colors_dict = dict()

for p in panels:
  _x, _y = p.get_points()
  x_points.extend(_x)
  y_points.extend(_y)

  _newc, colors = p.get_colors()
  newc.extend(_newc)

  coor = p.get_coordinate()

  colors_dict[f"{coor[0]} {coor[1]}"] = colors

x_points = np.array(x_points)
y_points = np.array(y_points)

newc = np.array(newc)

data_to_send = []

for x in range(2):
  for y in range(2):
    _data = colors_dict[f"{x} {y}"]
    data_to_send.extend(_data)

print(data_to_send)

fig = plt.figure(1)
plt.clf()
plt.scatter(x_points, y_points, 100, c = newc/255)
plt.gca().invert_yaxis()
plt.axis('equal')
plt.show()
