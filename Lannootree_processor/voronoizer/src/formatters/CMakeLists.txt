add_library(voronoizer-formatters INTERFACE)

option(WITH_JSON_MQTT "Compile with json mqtt formatter" OFF)

target_include_directories(voronoizer-formatters INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/include
)

if (WITH_JSON_MQTT)
  add_compile_definitions(WITH_JSON_MQTT)

  target_sources(voronoizer-formatters INTERFACE
    ${CMAKE_CURRENT_LIST_DIR}/json-file-formatter.cpp
    ${CMAKE_CURRENT_LIST_DIR}/json-redis-formatter.cpp
    ${CMAKE_CURRENT_LIST_DIR}/auto-redis-formatter.cpp
    ${CMAKE_CURRENT_LIST_DIR}/json-mqtt-formatter.cpp
  )

  target_link_libraries(voronoizer-formatters INTERFACE
    ssl
    paho-mqttpp3
    paho-mqtt3as
    voronoizer-libs
  )
else()
  target_sources(voronoizer-formatters INTERFACE
    ${CMAKE_CURRENT_LIST_DIR}/json-file-formatter.cpp
    ${CMAKE_CURRENT_LIST_DIR}/auto-redis-formatter.cpp
    ${CMAKE_CURRENT_LIST_DIR}/json-redis-formatter.cpp
  )

  target_link_libraries(voronoizer-formatters INTERFACE
    voronoizer-libs
  )
endif()
