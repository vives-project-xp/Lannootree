# -*- coding: utf-8 -*-
"""
Created on Mon Sep 26 11:34:20 2022

@author: u0110583
"""

import imageio
import numpy as np
import cv2
import io
from PIL import Image

import json

from matplotlib import pyplot as plt
from matplotlib.collections import LineCollection
import matplotlib.patches as patches

images = []

def draw_voronoi(img, facets, indices) :
  colors = []
  for i in range(len(facets)) :
    ifacet = facets[i].astype(np.int32)
    mask = np.zeros_like(gray)
    cv2.fillPoly(mask,[ifacet.astype(np.int32)],(255))
    values = frame[np.where(mask == 255)]
    color = (np.average(values,axis=0))
    cor_color = (np.power(color/255,2.4)*255).astype(int) # gamma correction
    colors.append(cor_color)
    cv2.fillConvexPoly(img, ifacet, color, cv2.LINE_AA, 0)
  
  buf = io.BytesIO()

  fig = plt.figure()
  plt.imshow(img)
  fig.savefig(buf)
  buf.seek(0)
  plt.close()

  images.append(Image.open(buf))

  cstring = []
  for i in np.argsort(indices):
    cor_color = colors[i]
    cstring.append(cor_color[0])
    cstring.append(cor_color[1])
    cstring.append(cor_color[2])

  return list(cstring)

img_file = "Vives.gif"
frames = imageio.mimread(f"./img/{img_file}")

# init sizes
size = frames[0].shape

dsubx = 107.76
dsuby = 109.03
dx = 3*dsubx
dy = 3*dsuby

prim_unit = np.array([[83.08, 368.57],
                      [116.65, 353.16],
                      [154.98, 345.04],
                      [80.74, 329.51],
                      [134.55, 314.05],
                      [62.96, 290.33],
                      [101.12, 298.58],
                      [137.07, 275.03]])

panel = np.zeros((9*prim_unit.shape[0],2))
for i in range(3):
  for j in range(3):
    idx = prim_unit.shape[0]*(i+j*3)
    panel[idx:idx+prim_unit.shape[0],:] = prim_unit+np.tile([i*dsubx, -j*dsuby],[prim_unit.shape[0],1])

# sort by x cord
panel = panel[np.argsort(panel[:,0]),:]
unique_xs = np.unique(panel[:,0])
for xs in unique_xs:
  idxs = np.where(panel[:,0]==xs)[0]
  jdxs = np.argsort(panel[idxs,1])
  panel[np.min(idxs):np.min(idxs)+len(idxs),1] = panel[idxs[jdxs],1]

screen = np.zeros((4*panel.shape[0],2))
for i in range(2):
  for j in range(2):
    idx = panel.shape[0]*(i+j*2)
    screen[idx:idx+panel.shape[0],:] = panel+np.tile([i*dx, (1-j)*dy],[panel.shape[0],1])
      
x0 = np.min(screen[:,0])
y0 = np.min(screen[:,1])

screen = screen-np.array([x0,y0])

xm = np.max(screen[:,0])
ym = np.max(screen[:,1])

scale = np.min([size[0]/ym,size[1]/xm])*0.9

screen = screen*scale

xt = np.abs(np.max(screen[:,0])-size[1])/2
yt = np.abs(np.max(screen[:,1])-size[0])/2

screen = screen+np.array([xt,yt])

panel_LED_indexes = np.array([ 0, 22, 46, 20, 44, 61, 21, 45, 62,  1, 23, 47, 19, 43, 63, 18, 42,
       60,  2, 24, 48, 17, 41, 64,  3, 25, 49, 16, 40, 59, 26, 50, 65,  4,
       39, 58, 15, 38, 66, 14, 37, 57,  5, 27, 51, 13, 36, 67,  6, 28, 56,
       12, 35, 68, 29, 52, 69,  7, 30, 55, 11, 34, 70,  9, 32, 54,  8, 31,
       53, 10, 33, 71])

screen_LED_indexes = np.zeros(4*panel_LED_indexes.shape[0],dtype=int)
for i in range(4):
  screen_LED_indexes[panel_LED_indexes.shape[0]*i:panel_LED_indexes.shape[0]*i+panel_LED_indexes.shape[0]] = panel_LED_indexes+panel_LED_indexes.shape[0]*i

points = screen

rect = (0, 0, size[1], size[0])
# Create an instance of Subdiv2Dq
subdiv = cv2.Subdiv2D(rect)
# Insert points into subdiv
for p in points :
    subdiv.insert(tuple(p))
    
# Allocate space for Voronoi Diagram
img_voronoi = np.zeros(frames[0].shape, dtype = frames[0].dtype)
( facets, centers) = subdiv.getVoronoiFacetList([]) 

datagram = []

homer = dict()

i = 0
for frame in frames:
  gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

  image_height, image_width, _ = frame.shape

  cstring = draw_voronoi(img_voronoi, facets, screen_LED_indexes)

  data_to_send = []
  for c in cstring:
    data_to_send.append(int(c))

  homer[f"frame{i}"] = data_to_send

  datagram.append(bytearray(cstring))
  i+=1


imageio.mimsave(f'./img_processed/proccesed_{img_file}', images)
with open(f"./processed_json/{img_file}.json", "w") as f:
  json.dump(homer, f, indent=2)


