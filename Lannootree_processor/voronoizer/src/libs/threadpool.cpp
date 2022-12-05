#include "./include/threadpool.hpp"

namespace Threading {

  uint32_t ThreadPool::start(uint n_workers) {
    const uint32_t hardware_supported_threads = std::thread::hardware_concurrency();

    uint32_t actual_workers = 
      (n_workers > hardware_supported_threads) ? hardware_supported_threads : n_workers;

    m_threads.resize(actual_workers);

    for (uint32_t i = 0; i < actual_workers; i++)
      m_threads.at(i) = std::thread(&ThreadPool::thread_loop, this);
    
    return actual_workers;
  }

  void ThreadPool::stop(void) {
    {
      std::unique_lock<std::mutex> lock(m_queue_mutex);
      m_should_terminate = true;
    }

    m_new_jobs.notify_all();

    for (auto& thread : m_threads) thread.join();
    m_threads.clear();
  }

  void ThreadPool::queue_job(const std::function<void()>& job) {
    {
      std::unique_lock<std::mutex> lock(m_queue_mutex);
      m_jobs.push(job);
    }

    m_new_jobs.notify_one();
  }

  bool ThreadPool::busy(void) {
    bool pool_busy;
    {
      std::unique_lock<std::mutex> lock(m_queue_mutex);
      pool_busy = m_jobs.empty();
    }
    return pool_busy;
  }

  void ThreadPool::thread_loop(void) {
    while (true) {
      std::function<void()> job;
      
      {
        std::unique_lock<std::mutex> lock(m_queue_mutex);
        m_new_jobs.wait(lock, [this]() {
          return !m_jobs.empty() || m_should_terminate;
        });

        if (m_should_terminate) return;

        job = m_jobs.front();
        m_jobs.pop();

        {
          std::unique_lock lock(m_running_jobs_mutex);
          m_running_jobs++;
        }
      }

      job();

      {
        std::unique_lock<std::mutex> lock0(m_buzy_mutex);
        std::unique_lock<std::mutex> lock1(m_running_jobs_mutex);
        m_running_jobs--;
        m_buzy_jobs.notify_one();
      }
    }
  }

}
