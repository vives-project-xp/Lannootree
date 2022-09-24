#include <lannootree_config.hpp>

using namespace Lannootree;
using namespace Lannootree::communication;

uint8_t running = 1;

ws2811_t ledstrips = {
  .freq = WS2811_TARGET_FREQ,
  .dmanum = DMA,
  .channel = {
    [0] = {
      .gpionum = GPIO_PIN,
      .invert  = 0,
      .count   = 8,
      .strip_type = STRIP_TYPE,
      .brightness = 255,
    },
    [1] = { // Second channel of PWM for other ledstrip if needed
      .gpionum = 0,
      .invert  = 0,
      .count   = 0,
      .brightness = 0,
    },
  },
};

std::shared_ptr<Socket> api_socket = std::shared_ptr<Socket>(new Socket());

static void add_sig_handels(void) {
  struct sigaction act;
  memset(&act, '\0', sizeof(act));
  act.sa_sigaction = [](int sig, siginfo_t* siginfo, void* context) { running = 0; };
  act.sa_flags = SA_SIGINFO;
  sigaction(SIGTERM, &act, NULL);
  sigaction(SIGINT,  &act, NULL);
  sigaction(SIGKILL, &act, NULL);
}

int main(int argc, char** argv) {
  ws2811_return_t ret;

  if ((ret = ws2811_init(&ledstrips)) != WS2811_SUCCESS) {
    error_log("ws2811_init failed %s\n", ws2811_get_return_t_str(ret));
    return ret;
  }

  // Start socket thread
  api_socket->start();

  add_sig_handels();

  while (running) {
    ledstrips.channel[0].leds[0] = 0x00200000; // Set first led to RED

    if ((ret = ws2811_render(&ledstrips)) != WS2811_SUCCESS) {
      error_log("ws2811_render fail: %s\n", ws2811_get_return_t_str(ret));
      break;
    }
  }

  api_socket->stop();
  ws2811_fini(&ledstrips);

  return ret;
}
