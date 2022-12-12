#pragma once

#include <iostream>
#include <cuda.h>
#include <cuda_runtime.h>


typedef unsigned char uchar;

#define BLOCK_WIDTH 32
#define cuda_check_errors(val) check((val), #val, __FILE__, __LINE__)

template<typename T>
void check(T err, const char* const func, const char* const file, const int line) {
  if (err != cudaSuccess) {
    std::cerr << "CUDA error at: " << file << ":" << line << std::endl;
    std::cerr << cudaGetErrorString(err) << " " << func << std::endl;
    std::exit(1);
  }
}

void mean_of_mask_launcher(uchar3* d_input_image, u_int16_t* d_mask, uint3* d_total, uint* d_count, size_t rows, size_t cols);

void divide_total_launcher(uint3* d_total, uint* d_count, uint3* d_cstrign, int size);
