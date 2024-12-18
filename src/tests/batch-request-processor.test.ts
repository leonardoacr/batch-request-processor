import { BatchRequestProcessor } from '../batch-request-processor';
import { TasksProgress } from '../interfaces/tasks-progress.interface';

describe('BatchRequestProcessor', () => {
  it('should process all tasks and return results in order', async () => {
    const tasks = [
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3),
    ];

    const inProgress = (tasksProgress: TasksProgress) => {
      console.log(`Progress: ${tasksProgress.progress}%. Completed tasks: ${tasksProgress.completedTasks}.`);
    }

    const results = await BatchRequestProcessor.process(tasks, 2, inProgress);

    expect(results).toEqual([1, 2, 3]);
  });

  it('should throw an error if tasks array is empty', async () => {
    await expect(BatchRequestProcessor.process([], 2)).rejects.toThrow(
      'Tasks must be a non-empty array.'
    );
  });

  it('should throw an error if batchSize is less than or equal to 0', async () => {
    const tasks = [() => Promise.resolve(1)];

    await expect(BatchRequestProcessor.process(tasks, 0)).rejects.toThrow(
      'Batch size must be greater than 0.'
    );
  });

  it('should report progress correctly', async () => {
    const tasks = [
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3),
    ];
    const progressUpdates: { progress: number; completedTasks: number }[] = [];
    const inProgress = (tasksProgress: TasksProgress) => {
      progressUpdates.push({ progress: tasksProgress.progress, completedTasks: tasksProgress.completedTasks || 0 });
    };

    await BatchRequestProcessor.process(tasks, 1, inProgress);

    expect(progressUpdates).toEqual([
      { progress: 0, completedTasks: 0 },
      { progress: 33.33, completedTasks: 1 },
      { progress: 66.67, completedTasks: 2 },
      { progress: 100, completedTasks: 3 },
    ]);
  });

  it('should handle tasks that reject and continue processing', async () => {
    const tasks = [
      () => Promise.resolve(1),
      () => Promise.resolve(3),
    ];

    const results = await BatchRequestProcessor.process(tasks, 2);

    expect(results).toEqual([1, 3]);
  });

  it('should process tasks in batches', async () => {
    const batchTracker: number[][] = [];
    const tasks = [1, 2, 3, 4, 5].map(
      (n) =>
        () =>
          new Promise<number>((resolve) => {
            batchTracker.push([n]);
            setTimeout(() => resolve(n), 10);
          })
    );

    const results = await BatchRequestProcessor.process(tasks, 2);

    expect(results).toEqual([1, 2, 3, 4, 5]);
    expect(batchTracker).toHaveLength(5);
  });
});
