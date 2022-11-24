import os
import redis as rd

r = rd.StrictRedis('localhost', 6379)

for files in os.listdir('./img'):
  if files.endswith('.gif'):
    gif = open(f"./img/{files}", 'rb')
    r.lpush('voronoi', gif.read())
    gif.close()
  else:
    continue
