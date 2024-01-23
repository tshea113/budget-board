interface Transaction {
  id: string;
  amount: number;
  date: Date;
  category: string;
  subCategory: string;
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
    'Amusement',
    'Arts',
    'Gas & Fuel',
    'Parking',
    'Public Transportation',
    'Ride Share',
    'Service & Parts',
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
    'Fast Food',
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
    'Fet Food & Supplies',
    'Pet Grooming',
    'Veterinary',
  ],
  [
    // Shopping
    'Books',
    'Clothing',
    'Electronics & Software',
    'Hobbies',
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
