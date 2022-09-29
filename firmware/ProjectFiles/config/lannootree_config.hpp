#pragma once

#include <memory>
#include <stdio.h>
#include <signal.h>
#include <string.h>

#include <ws2811.h>
#include <socket.hpp>

#define info_log(...) fprintf(stdout, __VA_ARGS__)
#define error_log(...) fprintf(stderr, __VA_ARGS__)

#define GPIO_PIN        18
#define DMA             10
#define STRIP_TYPE      WS2811_STRIP_RGB

extern uint8_t running;
extern std::shared_ptr<Lannootree::communication::Socket> api_socket;
