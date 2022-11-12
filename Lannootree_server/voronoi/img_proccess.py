import math
import random
import collections
import os
import sys
import functools
import operator as op
import numpy as np
import warnings

from scipy.spatial import cKDTree as KDTree
from skimage.filters.rank import entropy
from skimage.morphology import disk, dilation
from skimage.util import img_as_ubyte
from skimage.io import imread, imsave
from skimage.color import rgb2gray, rgb2lab, lab2rgb
from skimage.filters import sobel, gaussian_filter
from skimage.restoration import denoise_bilateral
from skimage.transform import downscale_local_mean


# Returns a random real number in half-open range [0, x).
def rand(x):
    r = x
    while r == x:
        r = random.uniform(0, x)
    return r


def poisson_disc(img, n, k=30):
    h, w = img.shape[:2]

    nimg = denoise_bilateral(img, sigma_range=0.15, sigma_spatial=15)
    img_gray = rgb2gray(nimg)
    img_lab = rgb2lab(nimg)

    entropy_weight = 2**(entropy(img_as_ubyte(img_gray), disk(15)))
    entropy_weight /= np.amax(entropy_weight)
    entropy_weight = gaussian_filter(dilation(entropy_weight, disk(15)), 5)

    color = [sobel(img_lab[:, :, channel])**2 for channel in range(1, 3)]
    edge_weight = functools.reduce(op.add, color) ** (1/2) / 75
    edge_weight = dilation(edge_weight, disk(5))

    weight = (0.3*entropy_weight + 0.7*edge_weight)
    weight /= np.mean(weight)
    weight = weight

    max_dist = min(h, w) / 4
    avg_dist = math.sqrt(w * h / (n * math.pi * 0.5) ** (1.05))
    min_dist = avg_dist / 4

    dists = np.clip(avg_dist / weight, min_dist, max_dist)

    def gen_rand_point_around(point):
        radius = random.uniform(dists[point], max_dist)
        angle = rand(2 * math.pi)
        offset = np.array([radius * math.sin(angle), radius * math.cos(angle)])
        return tuple(point + offset)

    def has_neighbours(point):
        point_dist = dists[point]
        distances, idxs = tree.query(point,
                                    len(sample_points) + 1,
                                    distance_upper_bound=max_dist)

        if len(distances) == 0:
            return True

        for dist, idx in zip(distances, idxs):
            if np.isinf(dist):
                break

            if dist < point_dist and dist < dists[tuple(tree.data[idx])]:
                return True

        return False

    # Generate first point randomly.
    first_point = (rand(h), rand(w))
    to_process = [first_point]
    sample_points = [first_point]
    tree = KDTree(sample_points)

    while to_process:
        # Pop a random point.
        point = to_process.pop(random.randrange(len(to_process)))

        for _ in range(k):
            new_point = gen_rand_point_around(point)

            if (0 <= new_point[0] < h and 0 <= new_point[1] < w
                    and not has_neighbours(new_point)):
                to_process.append(new_point)
                sample_points.append(new_point)
                tree = KDTree(sample_points)
                if len(sample_points) % 1000 == 0:
                    print("Generated {} points.".format(len(sample_points)))

    print("Generated {} points.".format(len(sample_points)))

    return sample_points


def sample_colors(img, sample_points, n):
    h, w = img.shape[:2]

    print("Sampling colors...")
    tree = KDTree(np.array(sample_points))
    color_samples = collections.defaultdict(list)
    img_lab = rgb2lab(img)
    xx, yy = np.meshgrid(np.arange(h), np.arange(w))
    pixel_coords = np.c_[xx.ravel(), yy.ravel()]
    nearest = tree.query(pixel_coords)[1]

    i = 0
    for pixel_coord in pixel_coords:
        color_samples[tuple(tree.data[nearest[i]])].append(
            img_lab[tuple(pixel_coord)])
        i += 1

    print("Computing color means...")
    samples = []
    for point, colors in color_samples.items():
        avg_color = np.sum(colors, axis=0) / len(colors)
        samples.append(np.append(point, avg_color))

    if len(samples) > n:
        print("Downsampling {} to {} points...".format(len(samples), n))

    while len(samples) > n:
        tree = KDTree(np.array(samples))
        dists, neighbours = tree.query(np.array(samples), 2)
        dists = dists[:, 1]
        worst_idx = min(range(len(samples)), key=lambda i: dists[i])
        samples[neighbours[worst_idx][1]] += samples[neighbours[worst_idx][0]]
        samples[neighbours[worst_idx][1]] /= 2
        samples.pop(neighbours[worst_idx][0])

    color_samples = []
    for sample in samples:
        color = lab2rgb([[sample[2:]]])[0][0]
        color_samples.append(tuple(sample[:2][::-1]) + tuple(color))

    return color_samples


def render(img, color_samples):
    print("Rendering...")
    h, w = [2*x for x in img.shape[:2]]
    xx, yy = np.meshgrid(np.arange(h), np.arange(w))
    pixel_coords = np.c_[xx.ravel(), yy.ravel()]

    colors = np.empty([h, w, 3])
    coords = []
    for color_sample in color_samples:
        coord = tuple(x*2 for x in color_sample[:2][::-1])
        colors[coord] = color_sample[2:]
        coords.append(coord)

    tree = KDTree(coords)
    idxs = tree.query(pixel_coords)[1]
    data = colors[tuple(tree.data[idxs].astype(int).T)].reshape((w, h, 3))
    data = np.transpose(data, (1, 0, 2))

    return downscale_local_mean(data, (2, 2, 1))


if __name__ == "__main__":
    warnings.simplefilter("ignore")

    img = imread(sys.argv[1])[:, :, :3]

    print("Calibrating...")
    mult = 1.02 * 500 / len(poisson_disc(img, 500))

    for n in (100, 300, 1000, 3000):
        print("Sampling {} for size {}.".format(sys.argv[1], n))

        sample_points = poisson_disc(img, mult * n)
        samples = sample_colors(img, sample_points, n)
        base = os.path.basename(sys.argv[1])
        with open("{}-{}.txt".format(os.path.splitext(base)[0], n), "w") as f:
            for sample in samples:
                f.write(" ".join("{:.3f}".format(x) for x in sample) + "\n")

        imsave("autorenders/{}-{}.png".format(os.path.splitext(base)[0], n),
            render(img, samples))

        print("Done!")
