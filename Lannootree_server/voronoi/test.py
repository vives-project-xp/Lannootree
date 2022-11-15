import numpy as np
import matplotlib.pyplot as plt

points = [
  (-20, -11),
  (-43, -20),
  (-67, -40),
  (-79, -58),
  (-37, -57),
  (-19, -52),
  (8, -30),
  (19, -14),
  (20, 17), 
  (33, 31),
  (63, 52),
  (48, 63),
  (15, 62),
  (1, 52),
  (-32, 30),
  (-19, 16)
]

new_Points = []

# M=(2x1​+x2​​,2y1​+y2​​)

for i in range(0, len(points), 2):
  p1 = points[i]
  p2 = points[i + 1]

  mid_x = (p1[0] + p2[0]) // 2
  mid_y = (p1[1] + p2[1]) // 2 

  new_Points.append((mid_x, mid_y))

x = []
y = []

for p in new_Points:
  x.append(p[0])
  y.append(p[1])

x = np.array(x)
y = np.array(y)

max_x = np.max(x)
max_y = np.max(y)

for i in range(len(new_Points)):
  nx = new_Points[i][0] + max_x
  ny = new_Points[i][1] + max_y

  new_Points[i] = (nx, ny)

x = []
y = []

for p in new_Points:
  x.append(p[0])
  y.append(p[1])

x = np.array(x)
y = np.array(y)

max_x = np.max(x)
max_y = np.max(y)

for i in range(len(new_Points)):
  nx = new_Points[i][0] / max_x
  ny = new_Points[i][1] / max_y

  new_Points[i] = (nx, ny)

x = []
y = []

for p in new_Points:
  x.append(p[0])
  y.append(p[1])

plt.figure(1)
plt.scatter(x, y)
plt.show()
