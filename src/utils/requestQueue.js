/**
 * Request Queue Manager
 * Prevents rate limiting by queuing and spacing out API requests
 */

class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.minDelay = 3000; // Minimum 3 seconds between requests (more conservative)
    this.lastRequestTime = 0;
    this.rateLimited = false;
    this.rateLimitRecoveryTime = 0;
  }

  /**
   * Add a request to the queue
   * @param {Function} requestFn - Function that returns a promise
   * @returns {Promise} - Promise that resolves with the request result
   */
  enqueue(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process the queue with delays between requests
   */
  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const { requestFn, resolve, reject } = this.queue.shift();

    try {
      // Check if we're in rate limit recovery period
      const now = Date.now();
      if (this.rateLimited && now < this.rateLimitRecoveryTime) {
        const remainingRecovery = this.rateLimitRecoveryTime - now;
        console.log(`🚫 Rate limit recovery: Waiting ${remainingRecovery}ms before attempting requests`);
        await new Promise((res) => setTimeout(res, remainingRecovery));
        this.rateLimited = false;
      }

      // Calculate how long to wait before next request
      const timeSinceLastRequest = now - this.lastRequestTime;
      const effectiveDelay = this.rateLimited ? this.minDelay * 2 : this.minDelay;
      const delay = Math.max(0, effectiveDelay - timeSinceLastRequest);

      if (delay > 0) {
        console.log(`⏳ Rate limiting: Waiting ${delay}ms before next request (${this.queue.length} remaining in queue)`);
        await new Promise((res) => setTimeout(res, delay));
      }

      // Execute the request
      console.log(`🚀 Executing queued request (${this.queue.length} remaining)`);
      
      try {
        const result = await requestFn();
        this.lastRequestTime = Date.now();
        this.rateLimited = false; // Reset rate limit flag on success
        resolve(result);
      } catch (error) {
        // Check if this is a rate limiting error
        if (error.response?.status === 429) {
          console.log(`🚫 Rate limited! Entering recovery mode for 30 seconds`);
          this.rateLimited = true;
          this.rateLimitRecoveryTime = Date.now() + 30000; // 30 seconds recovery
        }
        reject(error);
      }
    } catch (error) {
      reject(error);
    }

    // Process next item in queue
    this.processQueue();
  }

  /**
   * Clear the queue and reset rate limiting
   */
  clear() {
    this.queue = [];
    this.processing = false;
    this.rateLimited = false;
    this.rateLimitRecoveryTime = 0;
    console.log('🔄 Request queue cleared and rate limiting reset');
  }

  /**
   * Get queue size
   */
  size() {
    return this.queue.length;
  }
}

// Create singleton instance
const requestQueue = new RequestQueue();

export default requestQueue;
