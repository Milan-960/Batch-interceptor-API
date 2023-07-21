## Batch interceptor

## We are using Axios for our http client and want to implement an easy way to batch requests.

## How to test your code?

### Please follow the below instructions

- To install dependencies

```bash
npm install
#or
yarn install
```

- To run the project enter this command

```bash
npm start
# or
yarn start
```

- Run tests with `jest` command in terminal or IDE's run/debug feature

```bash
npm run test
#or
npm test -- --coverage
```

## What are the challenges you faced? and how did you solve them?

- Batching Logic: I had a challenge on how to bundle the requests, like trying to hold balloons together. I solved this by creating a Functions that keeps all the requests in one place, like a big bag for the balloons. Then, I used a timer to wait until all requests are ready before sending them off.

- Error Handling: It's like sending a group message on your phone and it fails. Everyone in the group needs to know, right? Same thing here. If the bundle of requests doesn't work, each request in the bundle needs to be informed. I handled this by checking all requests when a network issue pops up.

- Managing Lots of Requests: Imagine getting many kids on a bus at the same time - crazy! 😂 But like a good bus driver, I made sure all the requests were grouped properly, even when many were coming in all at once.

- Testing: Think of it like checking a school bus before a trip. I had to check my functions, make sure everything works right with many requests, different timing, and even when things go wrong. Like a good bus driver, I made sure everything was okay under any condition!

## Give another good use case for batching requests and its benefits

- One potential use case for batching requests could be in a chat application where multiple users send messages to the same chat group. Instead of sending each message as a separate network request, the messages could be batched and sent in a single request at regular intervals say every second. This would significantly reduce the number of network requests made to the server, thus reducing the server load and improving the applications performance.

For example: WhatsApp uses batching to send messages to chat groups.

PS: There are many apps which uses the batching solution :)

### Benefits

- Batching enhances efficiency by consolidating multiple requests into one, significantly lightening the servers burden. Furthermore, it helps bypass potential rate limits set by servers.
