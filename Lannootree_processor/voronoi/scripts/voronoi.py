import cv2
import numpy as np

def draw_voronoi(img, facets, indices):
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
    cor_color = (np.power(color/255,2.4)*255).astype(int) 
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
  