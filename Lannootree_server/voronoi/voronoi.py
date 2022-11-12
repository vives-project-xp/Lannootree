import io
import json
import imageio
import cupy as cp
import numpy as np
from PIL import Image
import matplotlib.pylab as plt

import panel

panelDimentions = (2, 2)
N = (panelDimentions[0] * panelDimentions[1]) * 72

img_file = 'homer.png'
img_path = './img/'
images = []

json_rep = dict()

img = Image.open(img_path + img_file)
img = img.resize([panelDimentions[0] * 9 * 8, panelDimentions[1] * 9 * 8])

# TODO: Read config for this
panels = []

for x in range(panelDimentions[0]):
  for y in range(panelDimentions[1]):
    x_offset = img.size[0] // panelDimentions[0]
    y_offset = img.size[1] // panelDimentions[1]

    box = (
      (x * x_offset),
      (y * y_offset),
      (x * x_offset) + x_offset,
      (y * y_offset) + y_offset
    )

    imgc = img.crop(box)

    panels.append(panel.Panel((x, y), imgc, panelDimentions))

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

for x in range(panelDimentions[0]):
  for y in range(panelDimentions[1]):
    _data = colors_dict[f"{x} {y}"]
    data_to_send.extend(_data)

json_rep[f"data"] = data_to_send

fig = plt.figure(1)
plt.clf()
plt.scatter(x_points, y_points, 100, c = newc/255)
plt.gca().invert_yaxis()
plt.axis('equal')

plt.show()

with open("data_json.json", "w") as f:
  json.dump(json_rep, f, indent=2)

