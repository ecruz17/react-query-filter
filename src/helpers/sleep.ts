export const sleep = (seconds: number): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve
    }, seconds * 1000);
  })
}