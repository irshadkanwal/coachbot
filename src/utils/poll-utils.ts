export async function poll<T>({
  targetFn,
  validateResult,
  interval = 2000,
  timeout = 60000, // 1 minute
}: {
  targetFn: () => Promise<T>;
  validateResult: (data: T) => boolean;
  interval?: number;
  timeout?: number;
}): Promise<T> {
  const start = Date.now();

  async function check(): Promise<T> {
    const result = await targetFn();

    if (validateResult(result)) return result;
    if (Date.now() - start > timeout) throw new Error('Polling timed out');

    return new Promise((resolve) => setTimeout(() => resolve(check()), interval));
  }

  return check();
}