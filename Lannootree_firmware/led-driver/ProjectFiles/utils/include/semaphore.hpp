#include <mutex>
#include <condition_variable>

class semaphore {
  std::mutex mutex_;
  std::condition_variable condition_;
  unsigned long count_ = 0; // Initialized as locked.

public:
  /**
   * @brief Release semaphore
   * 
   */
  void release() {
    std::lock_guard<decltype(mutex_)> lock(mutex_);
    ++count_;
    condition_.notify_one();
  }

  /**
   * @brief Asuire the semaphore in a blocking wat
   * 
   */
  void acquire() {
    std::unique_lock<decltype(mutex_)> lock(mutex_);
    while(!count_) // Handle spurious wake-ups.
        condition_.wait(lock);
    --count_;
  }

  /**
   * @brief Try to aquire semaphore
   * 
   * @return true 
   * When semaphore is aquired
   * @return false 
   * When failed to aquire
   */
  bool try_acquire() {
    std::lock_guard<decltype(mutex_)> lock(mutex_);
    if(count_) {
        --count_;
        return true;
    }
    return false;
  }
};