#pragma once

#include <mutex>
#include <tuple>
#include <iostream>

namespace Lannootree {

  template <class T>
  class Matrix {

    public:
      Matrix(uint width, uint height) {
        _width = width;
        _height = height;

        _data = new T[_width * _height];
      };

      ~Matrix() {
        delete[] _data;
      };

    public:
      /**
       * @brief Get the value object
       * 
       * @param col 
       * @param row 
       * @return T& 
       */
      T& get_value(uint col, uint row) {
        std::unique_lock<std::mutex> lock(_mtx);
        if (col > _width || row > _height) throw ":(";
        return _data[_width * row + col];
      };

      /**
       * @brief Set the value object
       * 
       * @param col 
       * @param row 
       * @param val 
       */
      void set_value(uint col, uint row, const T& val) {
        std::unique_lock<std::mutex> lock(_mtx);
        _data[_width * row + col] = val;
      }

    public:
      /**
       * @brief Get the dimension of the matrix
       * 
       * @return std::tuple<uint, uint> 
       */
      std::tuple<uint, uint> dimention(void) {
        std::unique_lock<std::mutex> lock(_mtx);
        return std::make_tuple(_width, _height);
      }

    public:
      friend std::ostream& operator<<(std::ostream& os, const Matrix& m) {
        os << "Matrix(" << std::to_string(m._width) << ", " << std::to_string(m._height) << "):\n";
        for (int row = 0; row < m._height; row++) {
          os << "[ ";
          for (int col = 0; col < m._width; col++) {
            os << m._data[m._width * row + col] << " ";
          }
          os << "]\n";
        }
        return os;
      }

    private:
      uint _width = 0;
      uint _height = 0;

    private:
      std::mutex _mtx;
      T* _data = nullptr;

  };

}