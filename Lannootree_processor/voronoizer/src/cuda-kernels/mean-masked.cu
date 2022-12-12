#include <mean-masked.hpp>

__global__ void mean_of_mask(uchar3* d_input_image, u_int16_t* d_mask, uint3* d_total, uint* d_count, size_t rows, size_t cols) {
  size_t y = blockIdx.y * blockDim.y + threadIdx.y;
  size_t x = blockIdx.x * blockDim.x + threadIdx.x;

  if (x >= rows || y >= cols) return;
  
  uchar3 color = d_input_image[x * cols + y];

  atomicAdd(&d_total[d_mask[x * cols + y]].x, color.x);
  atomicAdd(&d_total[d_mask[x * cols + y]].y, color.y);
  atomicAdd(&d_total[d_mask[x * cols + y]].z, color.z);

  atomicAdd(&d_count[d_mask[x * cols + y]], 1);
}

__global__ void divide_total(uint3* d_total, uint* d_count, uint3* d_cstrign, int size) {
  size_t x = blockIdx.x * blockDim.x + threadIdx.x;

  if (x >= size) return;

  uint3 total_color = d_total[x];
  uint count = d_count[x];

  uint3 mean_color;
  mean_color.x = total_color.x / count;
  mean_color.y = total_color.y / count;
  mean_color.z = total_color.z / count;

  d_cstrign[x] = mean_color;
}

void mean_of_mask_launcher(uchar3* d_input_image, u_int16_t* d_mask, uint3* d_total, uint* d_count, size_t rows, size_t cols) {
  const dim3 block_size(BLOCK_WIDTH, BLOCK_WIDTH, 1);
  uint grid_x = (uint) (rows / BLOCK_WIDTH + 1);
  uint grid_y = (uint) (cols / BLOCK_WIDTH + 1);
  const dim3 grid_size(grid_x, grid_y);

  mean_of_mask<<<grid_size, block_size>>>(d_input_image, d_mask, d_total, d_count, rows, cols);
}

void divide_total_launcher(uint3* d_total, uint* d_count, uint3* d_cstrign, int size) {
  const dim3 block_size(BLOCK_WIDTH, BLOCK_WIDTH, 1);
  uint grid_x = (uint) (size / BLOCK_WIDTH + 1);
  const dim3 grid_size(grid_x, 1); 

  divide_total<<<grid_size, block_size>>>(d_total, d_count, d_cstrign, size);
}
