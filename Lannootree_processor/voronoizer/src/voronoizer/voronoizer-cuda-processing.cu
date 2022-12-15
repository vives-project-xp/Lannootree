#include <voronoizer-cuda-processing.hpp>

uchar3* d_image = nullptr;
u_int16_t* d_mask = nullptr;
uint3* d_total = nullptr;
uint* d_count = nullptr;
uint3* d_cstring = nullptr;

void alloc_new_image_size(cv::Mat& image, cv::Mat& mask, size_t cstring_size) {
  cuda_check_errors(cudaFree(d_image));
  cuda_check_errors(cudaFree(d_mask));
  cuda_check_errors(cudaFree(d_cstring));
  cuda_check_errors(cudaFree(d_total));
  cuda_check_errors(cudaFree(d_count));
  cuda_check_errors(cudaFree(d_mask));

  cuda_check_errors(cudaMalloc(&d_total, sizeof(uint3) * cstring_size));
  cuda_check_errors(cudaMalloc(&d_count, sizeof(uint) * cstring_size));
  cuda_check_errors(cudaMalloc(&d_image, sizeof(uchar3) * image.rows * image.cols));
  cuda_check_errors(cudaMalloc(&d_mask, sizeof(u_int16_t) * image.rows * image.cols));
  cuda_check_errors(cudaMalloc(&d_cstring, sizeof(uint3) * cstring_size));

  u_int16_t* maskPtr = mask.ptr<u_int16_t>(0);
  cuda_check_errors(cudaMemcpy(d_mask, maskPtr, sizeof(u_int16_t) * image.rows * image.cols, cudaMemcpyHostToDevice));
}

void process_image(cv::Mat& image, std::vector<uint3>& cstring) {
  cuda_check_errors(cudaMemset(d_total, 0, sizeof(uint3) * cstring.size()));
  cuda_check_errors(cudaMemset(d_count, 0, sizeof(uint) * cstring.size()));

  uchar3* imagePtr = (uchar3*) image.ptr<uchar>(0);
  cuda_check_errors(cudaMemcpy(d_image, imagePtr, sizeof(uchar3) * image.rows * image.cols, cudaMemcpyHostToDevice));


  mean_of_mask_launcher(d_image, d_mask, d_total, d_count, image.rows, image.cols);
  cudaDeviceSynchronize();
  divide_total_launcher(d_total, d_count, d_cstring, cstring.size());
  cudaDeviceSynchronize();

  cuda_check_errors(cudaMemcpy(&cstring[0], d_cstring, sizeof(uint3) * cstring.size(), cudaMemcpyDeviceToHost));
}
