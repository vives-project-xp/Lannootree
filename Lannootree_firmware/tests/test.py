import socket
import time

SOCKET_PATH = "./dev/lannootree.socket"
data = [0xff] * 5000 * 3 # 5000 Leds RGB

with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as s:
  s.connect(SOCKET_PATH)
  start = time.time()
  for i in range(240):
    s.sendall(bytearray(data))
    time.sleep(0.004)
  stop = time.time()
  print(stop - start)
  s.close()
