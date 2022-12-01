# -*- coding: utf-8 -*-
"""
Created on Mon Sep 26 11:34:20 2022

@author: u0110583

Edited by: Joey De Smet
"""

import os
import io
import cv2
import json
import imageio
import argparse
import numpy as np
from PIL import Image
from matplotlib import pyplot as plt

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--image', type=str, required=True, help='Path to image file')
parser.add_argument('-c', '--config', type=str, help='Path to config.json file (Currently not implemented)')

args = parser.parse_args()

images = []

import sys
np.set_printoptions(threshold=sys.maxsize)

def draw_voronoi(img, facets, indices) :
  colors = []

  for i in range(len(facets)) :
    # Convert facets to int32
    ifacet = facets[i].astype(np.int32)

    # Create mask for polygon
    mask = np.zeros_like(gray)
    cv2.fillPoly(mask,[ifacet.astype(np.int32)],(255))

    # Get masked values
    values = frame[np.where(mask == 255)]

    # Calculate average color
    color = (np.average(values, axis=0))
    
    # Gamma correction
    cor_color = (np.power(color/255,2.4)*255).astype(int) 
    colors.append(cor_color)

    # Fill in polygon with average color
    cv2.fillConvexPoly(img, ifacet, color, cv2.LINE_AA, 0)
  
  # Save image
  buf = io.BytesIO()

  fig = plt.figure()
  plt.imshow(img)
  fig.savefig(buf)
  buf.seek(0)
  plt.close()

  images.append(Image.open(buf))

  # Add data in correct way
  cstring = []
  for i in np.argsort(indices):
    cor_color = colors[i]
    cstring.append(cor_color[0])
    cstring.append(cor_color[1])
    cstring.append(cor_color[2])

  return list(cstring)

# Read in image
img_path = args.image
img_file = img_path.replace('\\', '/').split('/')[-1]

frames = imageio.mimread(img_path)

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


# Create panel coordinates
panel = np.zeros((9*prim_unit.shape[0],2))
for i in range(3):
  for j in range(3):
    idx = prim_unit.shape[0]*(i+j*3)
    panel[idx:idx+prim_unit.shape[0]:] = prim_unit + np.tile([i*dsubx, -j*dsuby], (prim_unit.shape[0], 1))


panel = panel[np.argsort(panel[:,0]),:]
unique_xs = np.unique(panel[:,0])
for xs in unique_xs:
  idxs = np.where(panel[:,0]==xs)[0]
  jdxs = np.argsort(panel[idxs,1])
  panel[np.min(idxs):np.min(idxs)+len(idxs),1] = panel[idxs[jdxs],1]

width, height = 2, 2
nPanels = width * height

# print(panel)

# Create current configuration
screen = np.zeros((nPanels*panel.shape[0],2))
for i in range(width):
  for j in range(height):
    idx = panel.shape[0]*(i + j * width)
    # print(f"idx {idx}, idx+panel.shape[0]: {idx + panel.shape[0]}")
    screen[idx:idx+panel.shape[0],:] = panel + np.tile([i*dx, (1-j)*dy],[panel.shape[0], 1])



# Make positive
x0 = np.min(screen[:,0])
y0 = np.min(screen[:,1])

screen = screen - np.array([x0,y0])


# Scale to image
xm = np.max(screen[:,0])
ym = np.max(screen[:,1])

scale = np.min([size[0]/ym, size[1]/xm]) * 0.9

screen = screen * scale


# Shift screen right up
xt = np.abs(np.max(screen[:,0]) - size[1]) /2
yt = np.abs(np.max(screen[:,1]) - size[0]) /2

screen = screen + np.array([xt,yt])

print(screen)

# Indexes for color data
panel_LED_indexes = np.array([ 0, 22, 46, 20, 44, 61, 21, 45, 62,  1, 23, 47, 19, 43, 63, 18, 42,
       60,  2, 24, 48, 17, 41, 64,  3, 25, 49, 16, 40, 59, 26, 50, 65,  4,
       39, 58, 15, 38, 66, 14, 37, 57,  5, 27, 51, 13, 36, 67,  6, 28, 56,
       12, 35, 68, 29, 52, 69,  7, 30, 55, 11, 34, 70,  9, 32, 54,  8, 31,
       53, 10, 33, 71])

# Led indexes for configuration
screen_LED_indexes = np.zeros(nPanels*panel_LED_indexes.shape[0],dtype=int)
for i in range(nPanels):
  screen_LED_indexes[panel_LED_indexes.shape[0]*i:panel_LED_indexes.shape[0]*i+panel_LED_indexes.shape[0]] = panel_LED_indexes+panel_LED_indexes.shape[0]*i

points = screen

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
np_processed = [[] for i in range(len(frames))]

import time

for i, frame in enumerate(frames):
  print(f'processing frame [{i + 1}/{len(frames)}]')

  gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

  image_height, image_width, _ = frame.shape

  start = time.time()
  cstring = draw_voronoi(img_voronoi, facets, screen_LED_indexes)
  end = time.time()

  print(f"Render took ~ {(end - start) * 100}")

  data_to_send = []
  for c in cstring:
    data_to_send.append(int(c))
    np_processed[i].append(int(c))

  processed[f"frame{i}"] = data_to_send

print("Done... saving data")

np_processed = np.array(np_processed)

if not os.path.exists('./img_processed'):
  os.mkdir('img_processed')

# if not os.path.exists('./processed_json'):
#   os.mkdir('processed_json')

# if not os.path.exists('./numpy_store'):
#   os.mkdir('numpy_store')

# with open(f"./numpy_store/np_{img_file}.npy", 'wb') as f:
#   np.save(f, np_processed)

imageio.mimsave(f'./img_processed/proccesed_{img_file}', images)
# with open(f"./processed_json/{img_file}.json", "w") as f:
#   json.dump(processed, f, indent=2)
