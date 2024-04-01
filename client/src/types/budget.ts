interface Budget {
  id: string;
  date: Date;
  category: string;
  limit: number;
  userId: string;
}

const budgetDemo: Budget[] = [
  {
    id: '1',
    date: new Date(2024, 3),
    category: 'Shopping',
    limit: 100,
    userId: '',
  },
  {
    id: '2',
    date: new Date(2024, 2),
    category: 'Groceries',
    limit: 200,
    userId: '',
  },
  {
    id: '3',
    date: new Date(2024, 3),
    category: 'Restaurants',
    limit: 100,
    userId: '',
  },
  {
    id: '4',
    date: new Date(2024, 1),
    category: 'Utilities',
    limit: 200,
    userId: '',
  },
];

export type { Budget };
export { budgetDemo };
