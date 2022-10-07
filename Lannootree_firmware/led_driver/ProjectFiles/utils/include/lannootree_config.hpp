#pragma once

#include <memory>
#include <stdio.h>
#include <signal.h>
#include <string.h>
#include <iostream>

#include <ws2811.h>
#include <terminal_colors.hpp>

#define log(...) std::cout << __VA_ARGS__ << '\n'
#define info_log(...) std::cout << "[INFO] " << __VA_ARGS__ << '\n'
#define warn_log(...) std::cout << F_YELLOW << "[WARN] " << __VA_ARGS__ << RESET_COLOR << '\n'
#define error_log(...) std::cerr << F_RED << "[ERROR] " << __VA_ARGS__ << RESET_COLOR << '\n'


#define GPIO_PIN        18
#define DMA             10
#define STRIP_TYPE      WS2811_STRIP_GRB

extern uint8_t running;

static const char* logo =
"  _                                   _                  \n"
" | |                                 | |                 \n"
" | |     __ _ _ __  _ __   ___   ___ | |_ _ __ ___  ___  \n"
" | |    / _` | '_ \\| '_ \\ / _ \\ / _ \\| __| '__/ _ \\/ _ \\ \n"
" | |___| (_| | | | | | | | (_) | (_) | |_| | |  __/  __/ \n"
" |______\\__,_|_| |_|_| |_|\\___/ \\___/ \\__|_|  \\___|\\___| \n"
"        __ _                                             \n"
"       / _(_)                                            \n"
"      | |_ _ _ __ _ __ _____      ____ _ _ __ ___        \n"
"      |  _| | '__| '_ ` _ \\ \\ /\\ / / _` | '__/ _ \\       \n"
"      | | | | |  | | | | | \\ V  V / (_| | | |  __/       \n"
"      |_| |_|_|  |_| |_| |_|\\_/\\_/ \\__,_|_|  \\___|       \n"
"                                                         \n"
"                                                         \n";
