## Batch interceptor

## We are using Axios for our http client and want to implement an easy way to batch requests.

## In Happeo, you can think of channels like Slack channels.

When you scroll down, you can get hundreds of posts, and some can have files attached.

### In this case:

- We have an API that batches file get requests in our JS API library. The api returns json.

- The request that is done to our servers is in uri /file-batch-api and takes in one query parameter: ids<Array<String>>. For example: /file-batch-api?ids=[fileid1,fileid2]

- The API returns a following response: {items:[{id: fileid1, ...data}, {id: fileid2, ...data}]}

- If a file with id cannot be found or returns an error, it is not provided in the response items array. For example, if fileid1 and fileid2 are requested, but fileid1 cannot be found, the return value is: {items:[{id: fileid2, ...data}]}

- The end result is that a developer can use a call: apiClient.get(“/file-batch-api”, {params: ids: “fileid1”}) and does not need to implement batching in the application layer but this is handled by our JS API library.

- Interceptor should collect requests until some certain time limit is reached, and then batch those requests into one

### Tasks:

1. Implement an interceptor that handles batching for the given API request. All requests should return the requested files.

   - A. The code can be javascript or typescript.
   - B. If you are familiar with other libraries than axios, jest,etc. , feel free to use them.

2. Answer those questions, in a README.md:

   - A. How to test your code?

   - B. What are the challenges you faced? and how did you solve them?

   - C. Give another good use case for batching requests and its benefits

### Benefits

- Batching enhances efficiency by consolidating multiple requests into one, significantly lightening the server's burden. Furthermore, it helps bypass potential rate limits set by servers.
