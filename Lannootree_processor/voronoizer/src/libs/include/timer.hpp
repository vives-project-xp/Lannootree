#pragma once

#include <string>
#include <chrono>
#include <iostream>

namespace Processing {

  class Timer {

    public:
      Timer(const std::string& name)
        : m_name(name)
      {
        m_start_point = std::chrono::high_resolution_clock::now();
      }

      ~Timer() {
        auto end_point = std::chrono::high_resolution_clock::now();

        long long start = std::chrono::time_point_cast<std::chrono::microseconds>(m_start_point).time_since_epoch().count();
        long long end   = std::chrono::time_point_cast<std::chrono::microseconds>(end_point).time_since_epoch().count();

        std::cout << m_name << ": " << ((end - start) / 1000) << "ms | " << (end - start) << "us" << std::endl;
      }

    private:
      std::string m_name;
      std::chrono::time_point<std::chrono::high_resolution_clock> m_start_point;

  };

}
