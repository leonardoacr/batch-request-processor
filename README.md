# Batch Request Processor

`batch-request-processor` is a lightweight and efficient library designed to help you process large sets of asynchronous tasks in batches. It’s especially useful for handling tasks like making API requests or processing promises in a controlled, efficient manner.

## Features

- **Batch processing**: Efficiently processes tasks in manageable batches.
- **Progress tracking**: Optionally monitor the percentage of completed tasks.
- **Promise handling**: Works seamlessly with tasks that return promises (e.g., API calls).
- **Easy-to-use**: Simple API to integrate into your existing projects.
- **TypeScript support**: Developed in TypeScript for better development experience and type safety.

## Installation

You can easily install the library via npm:

```bash
npm install batch-request-processor
```

## Usage

Here is an example of how to use the library to process tasks in batches:

```typescript
import { BatchRequestProcessor } from 'batch-request-processor';

const createRequestFactory = () => async () => {
    console.log('Request triggered by factory');
    return fetchCatFact();
};

const fetchCatFact = async () => {
    const response = await fetch('https://meowfacts.herokuapp.com/');
    const data = await response.json();
    return data[0];
};

const inProgress = (progress: number) => {
    console.log(`Progress: ${progress}%`);
};

const requestFactories = Array.from({ length: 4 }, createRequestFactory);
const batchSize = 2;

BatchRequestProcessor.process(requestFactories, batchSize, inProgress)
    .then((results) => console.log('Fetched Cat Facts:', results))
    .catch((error) => console.error('Error:', error));
```

### Explanation of the Code

1. **Request Factory**: We define a `createRequestFactory` function that generates an asynchronous request task to fetch a cat fact.
2. **Progress Callback**: An `inProgress` function is provided to log the completion percentage of the batch.
3. **Processing**: The `BatchRequestProcessor.process` method is used to handle the tasks in batches, with the progress being reported during the process.

## Medium Post

For a detailed guide on how to use the library with practical examples, check out this [Medium post](https://medium.com/@leonardoacrg.dev/javascript-how-to-process-tasks-in-batches-with-progress-tracking-6e3b1a82241a).

## License

This library is licensed under the [MIT License](LICENSE).