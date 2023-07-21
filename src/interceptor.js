import httpAdapter from "axios/lib/adapters/http";

// Maps to store batched requests and associated promises
let batchedRequestsMap = {};
let batchedRequestPromise = {};

// Config to control delay before sending batched requests for each endpoint
const batchEnabled = {
  "/file-batch-api": 500,
};

/**
 * Retrieves all batched request parameters for a specific URL.
 * @param {string} url - The URL for which batched request parameters are to be retrieved.
 * @returns {Array} The unique batched request parameters associated with the given URL.
 */
const getBatchParams = (url) => {
  const requestArr = batchedRequestsMap[url];
  const params = requestArr.map((item) => item.params.ids);
  return [...new Set(params.flat())];
};

/**
 * Function to get the updated config for a batched request
 * @param {object} config - The original configuration object.
 * @returns {object} The updated configuration object with batched ids for the request.
 * @throws {Error} Throws an error if there are no batched ids found.
 */
const getUpdatedConfig = (config) => {
  const batchedIds = getBatchParams(config.url);
  if (!batchedIds.length) {
    throw new Error("No batched IDs found");
  }
  const params = { ...config.params, ids: batchedIds };
  return { ...config, params };
};

/**
 *  Function to resolve the response for a specific request
 * @param {object} config - The configuration object for the request.
 * @returns {Function} A function that takes a response object and returns a promise
 *                      that resolves to a response object containing matching items.
 */
const responseResolver = (config) => {
  return (res) => {
    const ids = config.params?.ids || [];
    const data = JSON.parse(res.data);
    const items = data.items.filter((item) => ids.includes(item.id));

    if (!items.length) {
      return Promise.reject("No results");
    }

    return Promise.resolve({ ...res, data: { items } });
  };
};

/**
 * Adapter function for handling batched requests
 * @param {object} config - The configuration object for the request.
 * @returns {Promise} A promise that resolves to the response of the batched request.
 */
const batchAdapter = (config) => {
  // Check if there are already batched requests for the URL
  if (batchedRequestsMap[config.url] && batchedRequestsMap[config.url].length) {
    // If there are, add the new request to the batch
    batchedRequestsMap = {
      ...batchedRequestsMap,
      [config.url]: [...batchedRequestsMap[config.url], config],
    };
  } else {
    batchedRequestsMap = {
      ...batchedRequestsMap,
      [config.url]: [config],
    };

    batchedRequestPromise[config.url] = new Promise((resolve, reject) => {
      setTimeout(() => {
        // After a delay, send the batched request

        httpAdapter(getUpdatedConfig(config))
          .then(resolve)
          .catch((error) => {
            console.error("Network error", error);
            batchedRequestsMap[config.url].forEach((waitingRequest) => {
              reject(error);
            });
          })
          .finally(() => {
            // Finally, clear the batched requests for the URL

            batchedRequestsMap[config.url] = [];
          });
      }, batchEnabled[config.url]);
    });
  }

  return batchedRequestPromise[config.url]; // Return the promise for the batched request
};

/**
 * Adds a batch interceptor to an Axios instance This function modifies the request
 * adapter in the interceptor to enable batch requests if batching is enabled for the request URL.
 * @param {object} instance - The Axios instance to which the batch interceptor is to be added.
 * @returns {Promise} A promise that resolves to the modified request if successful, or rejects with an error if not.
 */
async function batchInterceptor(instance) {
  instance.interceptors.request.use(
    async (request) => {
      if (batchEnabled.hasOwnProperty(request.url)) {
        // If batching is enabled, set the request adapter to the batch adapter
        request.adapter = async (config) => {
          return await batchAdapter(config).then(responseResolver(config));
        };
      }
      return request;
    },
    (error) => Promise.reject(error) // If there is an error, reject the promise
  );
}

export default batchInterceptor;
