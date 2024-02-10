interface Transaction {
  id: string;
  amount: number;
  date: Date;
  category: string;
  subcategory: string;
  merchantName: string;
  pending: boolean;
  source: string;
  accountId: string;
}

interface NewTransaction extends Partial<Transaction> {}

const Category: string[] = [
  'Auto & Transport',
  'Bills & Utilities',
  'Education',
  'Entertainment',
  'Fees & Charges',
  'Financial',
  'Food & Dining',
  'Gifts & Donations',
  'Health & Fitness',
  'Home',
  'Income',
  'Investments',
  'Loans',
  'Misc',
  'Personal Care',
  'Pets',
  'Shopping',
  'Taxes',
  'Transfer',
  'Travel',
  'Other',
];

const SubCategory: string[][] = [
  [
    // Auto & Transport
    'Auto Insurance',
    'Auto Payment',
    'Gas & Fuel',
    'Parking',
    'Public Transportation',
    'Ride Share',
    'Service & Parts',
  ],
  [
    // Bills & Utilities
    'Internet',
    'Mobile Phone',
    'Televison',
    'Utilities',
  ],
  [
    // Education
    'Books & Supplies',
    'Student Loan',
    'Tuition',
  ],
  [
    // Entertainment
    'Activities',
    'Arts',
    'Movies',
    'Music',
    'Books',
    'Games',
  ],
  [
    // Fees & Charges
    'ATM Fee',
    'Bank Fee',
    'Finance Charge',
    'Late Fee',
    'Service Fee',
    'Trade Commissions',
  ],
  [
    // Financial
    'Roth IRA',
    'Investment',
  ],
  [
    // Food & Dining
    'Alcohol & Bars',
    'Coffee Shops',
    'Food Delivery',
    'Groceries',
    'Restaurants',
  ],
  [
    // Gifts & Donations
    'Charity',
    'Gift',
  ],
  [
    // Health & Fitness
    'Dentist',
    'Doctor',
    'Eyecare',
    'Gym',
    'Health Insurance',
    'Pharmacy',
    'Sports',
  ],
  [
    // Home
    'Furnishings',
    'Home Improvement',
    'Home Insurance',
    'Home Services',
    'Home Supplies',
    'Lawn & Garden',
    'Mortgage & Rent',
  ],
  [
    // Income
    'Bonus',
    'Interest Income',
    'Paycheck',
    'Reimburstment',
    'Tax Return',
  ],
  [
    // Investments
    'Buy',
    'Deposit',
    'Dividend & Cap Gains',
    'Sell',
    'Withdrawl',
  ],
  [
    // Loans
    'Loan Fees & Charges',
    'Loan Insurance',
    'Loan Interest',
    'Loan Payment',
    'Loan Principal',
  ],
  [
    // Misc
  ],
  [
    // Personal Care
    'Hair',
    'Laundry',
    'Spa & Massage',
  ],
  [
    // Pets
    'Pet Food & Supplies',
    'Pet Grooming',
    'Veterinary',
  ],
  [
    // Shopping
    'Clothing',
    'Electronics & Software',
    'Hobbies',
    'Household',
  ],
  [
    // Taxes
    'Federal Tax',
    'Local Tax',
    'Property Tax',
    'Sales Tax',
    'State Tax',
  ],
  [
    // Transfer
    'Credit Card Payment',
  ],
  [
    // Travel
    'Air Travel',
    'Hotel',
    'Rental Car & Taxi',
    'Vacation',
  ],
  [
    // Other
  ],
];

export type { Transaction, NewTransaction };
export { Category, SubCategory };
