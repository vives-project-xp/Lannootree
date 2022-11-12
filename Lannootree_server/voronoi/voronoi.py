import cupy as cp
import numpy as np
import io
import imageio
import matplotlib.pylab as plt
import scipy.ndimage as ndimage
from PIL import Image
from scipy.spatial import Voronoi, voronoi_plot_2d
import functools

def buffer_plot_and_get():
  buf = io.BytesIO()
  fig.savefig(buf)
  buf.seek(0)
  return Image.open(buf)

def dist(x1, y1, x2, y2, xp):
  d = xp.sqrt((x2 - x1)**2 + (y2 - y1)**2)
  return d

vdist = functools.partial(dist, xp=np)

# N = 81
N = 324

img_file = './img/homer.png'
images = [] 

img = Image.open(img_file)

im = np.array(img) # Convert img to numpy array
nx, ny = im.shape[0], im.shape[1] # Dimentions
xx = np.arange(0, nx, 1) # Generates array with evenly spaced numbers (from 0 to nx, step: 1) [0, 1, 2, ..., nx]
yy = np.arange(0, ny, 1) 
X, Y = np.meshgrid(xx, yy)

plt.figure('Image')
plt.imshow(im, interpolation='none')
plt.axis('equal')

np.random.seed(1)

# newx = np.random.randint(0, nx, N)
# newy = np.random.randint(0, ny, N)

newx = []
newy = []

sqrtN = int(np.sqrt(N))

for x in range(sqrtN):
  for y in range(sqrtN):
    newx.append(x * (nx / sqrtN))
    newy.append(y * (nx / sqrtN))

newx = np.array(newx)
newy = np.array(newy)

plt.scatter(newx, newy, 10, 'k')

distances = np.empty((newx.shape[0], yy.shape[0], xx.shape[0])) # generate uninitialized 3d array of size (newx.shape[0], yy.shape[0], xx.shape[0])

vnewx = np.transpose(np.tile(newx, [len(xx), len(yy), 1]), (2, 1, 0))
vnewy = np.transpose(np.tile(newy, [len(xx), len(yy), 1]), (2, 1, 0))
vxx = np.tile(xx, [len(newx), len(yy), 1])
vyy = np.transpose(np.tile(yy, [len(newx), len(xx), 1]), (0, 2, 1))

# distances = vdist(cp.array(vnewx), cp.array(vnewy), cp.array(vxx), cp.array(vyy))
distances = vdist(vnewx, vnewy, vxx, vyy)

mind = np.argmin(distances, 0)
    
plt.figure(2)
# plt.pcolormesh(X,Y,mind)
plt.imshow(mind, interpolation='none')
plt.axis('equal')
plt.scatter(newx, newy, 10, 'k')
plt.clim(0,255)

imr = im[:,:,0]
img = im[:,:,1]
imb = im[:,:,2]
newc = np.zeros((len(newx),3))
for i in range(newc.shape[0]):
    newc[i,0] = np.mean(imr[np.where(mind==i)])
    newc[i,1] = np.mean(img[np.where(mind==i)])
    newc[i,2] = np.mean(imb[np.where(mind==i)])

fig = plt.figure(10)
plt.clf()
# plt.pcolormesh(X,Y,im)
# plt.imshow(im,interpolation='none')
plt.scatter(newx, newy, 100, c = newc/255)
plt.gca().invert_yaxis()
plt.axis('equal')
# plt.xlim([0,100])
# plt.ylim([0,100])
# plt.clim(0,255)
# plt.pause(0.1)

plt.show()

# images.append(buffer_plot_and_get())

# imageio.mimsave('interpline3.gif', images)

# # fig.savefig("interpline2_%d.png"%(index))

# B = 141
# C = 360-2*B
# E = 122.267145123571231
# D = 360-2*E
# A = (360-C-D)/2

# l = 10
# nodes = []
# nodes.append(0+0j)
# nodes.append(l+0j)
# nodes.append(nodes[-1]+l*np.exp(1j*(180-B)/180*np.pi))
# nodes.append(nodes[-1]+l*np.exp(1j*B/180*np.pi))
# nodes.append(nodes[-1]+l*np.exp(1j*(B+180-D)/180*np.pi))

# nodes.append(nodes[0])
# nodes = np.array(nodes)

# # print(dist(np.real(nodes[-2]),np.imag(nodes[-2]),np.real(nodes[0]),np.imag(nodes[0])))

# # plt.figure()
# # plt.plot(np.real(nodes),np.imag(nodes))
# # plt.axis('square')

# nodes1 = nodes*np.exp(-1j*(180-B)/180*np.pi)+nodes[3]
# nodestot = np.concatenate((nodes,nodes1))

# nodes2 = (nodes-nodes[3])*np.exp(-1j*(360-B)/180*np.pi)+nodestot[10]
# nodestot = np.concatenate((nodestot,nodes2))

# nodes3 = np.conj(nodes)*np.exp(-1j*(180+2*(90-A))/180*np.pi)
# nodestot = np.concatenate((nodestot,nodes3))

# nodes4 = nodes3*np.exp(-1j*(180-B)/180*np.pi)+nodes[3]
# nodestot = np.concatenate((nodestot,nodes4))

# nodes5 = -nodes3+nodes[4]+nodes3[3]
# nodestot = np.concatenate((nodestot,nodes5))

# nodes6 = nodes*np.exp(-1j*180/180*np.pi)+nodes5[0]
# nodestot = np.concatenate((nodestot,nodes6))

# nodes7 = (-nodes3+nodes[4])*np.exp(-1j*(180-B)/180*np.pi)+nodes1[3]
# primitiveunit = np.concatenate((nodestot,nodes7))

# primitive_dx = nodes6[2]-nodes2[1]
# primitive_dy = nodes2[2]

# nodes8 = primitiveunit+primitive_dx
# primitiveunit = np.concatenate((primitiveunit,nodes8))

# nodes8b = primitiveunit+primitive_dy
# primitiveunit = np.concatenate((primitiveunit,nodes8b))

# nodes9 = primitiveunit-2*primitive_dx
# primitiveunit = np.concatenate((primitiveunit,nodes9))

# nodes9b = primitiveunit+2*primitive_dy
# primitiveunit = np.concatenate((primitiveunit,nodes9b))

# nodes9c = primitiveunit+4*primitive_dy
# primitiveunit = np.concatenate((primitiveunit,nodes9c))

# roundeduniquepoints = np.unique(np.round(primitiveunit,1))
# exactuniquepoints = np.zeros(roundeduniquepoints.shape,dtype=complex)

# for i in range(roundeduniquepoints.shape[0]):
#     index = np.where(np.isclose(primitiveunit,roundeduniquepoints[i],rtol=1e-2))[0][0]
#     exactuniquepoints[i] = primitiveunit[index]

# plt.figure()
# # plt.plot(np.real(exactuniquepoints),np.imag(exactuniquepoints))
# plt.scatter(np.real(primitiveunit),np.imag(primitiveunit))
# plt.axis('square')


# # exactuniquepoints = nodes2

# points = np.zeros((len(exactuniquepoints),2))
# points[:,0] = np.real(exactuniquepoints)
# points[:,1] = np.imag(exactuniquepoints)

# from scipy.spatial import Voronoi, voronoi_plot_2d
# vor = Voronoi(points)

# fig = voronoi_plot_2d(vor)
# plt.axis('equal')
# plt.show()

# plt.figure()
# plt.scatter(vor.points[:,0], vor.points[:,1])
# leds = vor.vertices[0:2]
