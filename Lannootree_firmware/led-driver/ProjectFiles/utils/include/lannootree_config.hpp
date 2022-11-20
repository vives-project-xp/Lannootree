// ! DO NOT EDIT .hpp file EDIT THE .hpp.in FILE (.hpp FILE WILL BE OVERWRITEN ON BUILD)
#pragma once

#include <string>
#include <thread>
#include <chrono>
#include <fstream>
#include <iostream>

#include <json.hpp>
#include <ws2811.h>

#include <queue.hpp>
#include <color.hpp>
#include <logger.hpp>
#include <terminal_colors.hpp>

#ifndef DISABLE_LOG
  #define log(...) Logger::Get()(LogType::DEFAULT) << __VA_ARGS__
  #define info_log(...) Logger::Get()(LogType::INFO) << __VA_ARGS__
  #define warn_log(...) Logger::Get()(LogType::WARN) << __VA_ARGS__
  #define error_log(...) Logger::Get()(LogType::ERROR) << __VA_ARGS__
#else
  #define log(...)
  #define info_log(...)
  #define warn_log(...)
  #define error_log(...)
#endif

#define PANEL_LED_COUNT 72
#define STRIP_TYPE      WS2811_STRIP_GRB      

#define JSON_FILE_PATH "../../config.json"

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
"                                                         \n"
"                       VERSION[1.2]                       \n";
