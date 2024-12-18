export class BatchRequestProcessor {
  /**
   * Processes a list of tasks in batches and collects results.
   * @param tasks - An array of tasks (factory functions) to be executed.
   * @param batchSize - The number of tasks to process in each batch.
   * @param inProgress - Optional callback to report the progress percentage.
   * @returns A promise that resolves with the collected results of all tasks.
   */
  static async process<T>(
    tasks: (() => Promise<T>)[],
    batchSize: number,
    inProgress?: (progress: number) => void
  ): Promise<T[]> {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      throw new Error('Tasks must be a non-empty array.');
    }

    if (batchSize <= 0) {
      throw new Error('Batch size must be greater than 0.');
    }

    const results: T[] = [];
    const totalTasks = tasks.length;
    let completedTasks = 0;

    if (inProgress) {
      inProgress(0);
    }

    for (let i = 0; i < totalTasks; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map((task) => task()));
      results.push(...batchResults.filter(Boolean));

      completedTasks += batch.length;
      if (inProgress) {
        const progress = Math.round((completedTasks / totalTasks) * 100);
        inProgress(progress);
      }
    }

    return results;
  }
}
