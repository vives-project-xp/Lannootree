#pragma once

#include <mutex>
#include <queue>
#include <thread>
#include <cstdint>
#include <functional>
#include <condition_variable>

namespace Threading {

  class ThreadPool {

    public:
      /**
       * @brief 
       * Start a number of thead given by n_workers that can start executing jobs.
       * 
       * @param n_workers 
       * Number of threads to create, if this is bigger than hardware supported number of threads this will use the hardware suported umber of threads instead.
       * 
       * @returns
       * Actual acheived number of workers.
       */
      uint32_t start(uint n_workers);
      
      /**
       * @brief 
       * Joins all thread then deletes them.
       * 
       */
      void stop(void);

      /**
       * @brief
       * Add a job to be executed.
       * 
       * @param job 
       * Job to be executed.
       */
      void queue_job(const std::function<void()>& job);
      
      /**
       * @brief 
       * Check if there are queued jobs.
       * 
       * @return true 
       * When there are still jobs queued.
       * @return false 
       * When there are no jobs queued.
       */
      bool busy(void);

      /**
       * @brief 
       * Wait for all threads to finish there job.
       * 
       */
      void wait_all_running_jobs(void) {
        do {
          std::unique_lock<std::mutex> lock(m_buzy_mutex);
          m_buzy_jobs.wait(lock);
          
          if (!jobs_running() && m_should_terminate) break;

        } while (jobs_running());
      }

      uint32_t running_jobs(void) {
        uint32_t number;
        {
          std::unique_lock<std::mutex> lock(m_running_jobs_mutex);
          number = m_running_jobs;
        }
        return number;
      }

    private:
      void thread_loop(void);

      bool jobs_running(void) {
        bool running_jobs;
        {
          std::unique_lock<std::mutex> lock(m_running_jobs_mutex);
          running_jobs = (m_running_jobs > 0);
        }
        return running_jobs;
      };

      uint32_t m_running_jobs = 0;
      bool m_should_terminate = false;
      
      std::mutex m_queue_mutex;
      std::condition_variable m_new_jobs;
      std::vector<std::thread> m_threads;
      std::queue<std::function<void()>> m_jobs;

      std::mutex m_buzy_mutex;
      std::mutex m_running_jobs_mutex;
      std::condition_variable m_buzy_jobs;

  };

}

