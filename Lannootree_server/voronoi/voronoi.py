import numpy as np
import matplotlib.pylab as plt
import scipy.ndimage as ndimage
from scipy.spatial import Voronoi, voronoi_plot_2d

img_file = './img/homer.png'
img = plt.imread(img_file)

points = [] 

for col in range(int(img.shape[0] / 100)):
  for row in range(int(img.shape[1] / 100)):
    points.append([col * 100, row * 100])

points = np.array(points)

B = 141
C = 360-2*B
E = 122.267145123571231
D = 360-2*E
A = (360-C-D)/2

l = 10
nodes = []
nodes.append(0+0j)
nodes.append(l+0j)
nodes.append(nodes[-1]+l*np.exp(1j*(180-B)/180*np.pi))
nodes.append(nodes[-1]+l*np.exp(1j*B/180*np.pi))
nodes.append(nodes[-1]+l*np.exp(1j*(B+180-D)/180*np.pi))

nodes.append(nodes[0])
nodes = np.array(nodes)

# print(dist(np.real(nodes[-2]),np.imag(nodes[-2]),np.real(nodes[0]),np.imag(nodes[0])))

# plt.figure()
# plt.plot(np.real(nodes),np.imag(nodes))
# plt.axis('square')

nodes1 = nodes*np.exp(-1j*(180-B)/180*np.pi)+nodes[3]
nodestot = np.concatenate((nodes,nodes1))

nodes2 = (nodes-nodes[3])*np.exp(-1j*(360-B)/180*np.pi)+nodestot[10]
nodestot = np.concatenate((nodestot,nodes2))

nodes3 = np.conj(nodes)*np.exp(-1j*(180+2*(90-A))/180*np.pi)
nodestot = np.concatenate((nodestot,nodes3))

nodes4 = nodes3*np.exp(-1j*(180-B)/180*np.pi)+nodes[3]
nodestot = np.concatenate((nodestot,nodes4))

nodes5 = -nodes3+nodes[4]+nodes3[3]
nodestot = np.concatenate((nodestot,nodes5))

nodes6 = nodes*np.exp(-1j*180/180*np.pi)+nodes5[0]
nodestot = np.concatenate((nodestot,nodes6))

nodes7 = (-nodes3+nodes[4])*np.exp(-1j*(180-B)/180*np.pi)+nodes1[3]
primitiveunit = np.concatenate((nodestot,nodes7))

primitive_dx = nodes6[2]-nodes2[1]
primitive_dy = nodes2[2]

nodes8 = primitiveunit+primitive_dx
primitiveunit = np.concatenate((primitiveunit,nodes8))

nodes8b = primitiveunit+primitive_dy
primitiveunit = np.concatenate((primitiveunit,nodes8b))

nodes9 = primitiveunit-2*primitive_dx
primitiveunit = np.concatenate((primitiveunit,nodes9))

nodes9b = primitiveunit+2*primitive_dy
primitiveunit = np.concatenate((primitiveunit,nodes9b))

nodes9c = primitiveunit+4*primitive_dy
primitiveunit = np.concatenate((primitiveunit,nodes9c))

roundeduniquepoints = np.unique(np.round(primitiveunit,1))
exactuniquepoints = np.zeros(roundeduniquepoints.shape,dtype=complex)

for i in range(roundeduniquepoints.shape[0]):
    index = np.where(np.isclose(primitiveunit,roundeduniquepoints[i],rtol=1e-2))[0][0]
    exactuniquepoints[i] = primitiveunit[index]

plt.figure()
# plt.plot(np.real(exactuniquepoints),np.imag(exactuniquepoints))
plt.scatter(np.real(primitiveunit),np.imag(primitiveunit))
plt.axis('square')
plt.show()

points = np.zeros((len(exactuniquepoints),2))
points[:,0] = np.real(exactuniquepoints)
points[:,1] = np.imag(exactuniquepoints)

vor = Voronoi(points)

fig = plt.figure(1)
ax = fig.add_subplot(111)
ax.imshow(ndimage.rotate(img, 180))
voronoi_plot_2d(vor, point_size=3, ax=ax)

plt.figure()
plt.scatter(vor.points[:,0], vor.points[:,1])
leds = vor.vertices[0:2]
plt.scatter(leds[:,0], leds[:,1])

plt.axis('equal')
plt.show()
