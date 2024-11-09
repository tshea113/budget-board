export interface Dictionary<T> {
  [Key: string]: T;
}

export const months = [...Array(12).keys()].map((key) =>
  new Date(0, key).toLocaleString('en', { month: 'long' })
);
