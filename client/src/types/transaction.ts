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

interface Category {
  label: string;
  value: string;
  parent: string;
  subCategories: Category[];
}

const categories: Category[] = [
  {
    label: 'Auto & Transport',
    value: 'auto & transport',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Auto Insurance',
    value: 'auto insurance',
    parent: 'auto & transport',
    subCategories: [],
  },
  {
    label: 'Auto Payment',
    value: 'auto payment',
    parent: 'auto & transport',
    subCategories: [],
  },
  {
    label: 'Gas & Fuel',
    value: 'gas & fuel',
    parent: 'auto & transport',
    subCategories: [],
  },
  {
    label: 'Parking',
    value: 'parking',
    parent: 'auto & transport',
    subCategories: [],
  },
  {
    label: 'Public Transportation',
    value: 'public transportation',
    parent: 'auto & transport',
    subCategories: [],
  },
  {
    label: 'Ride Share',
    value: 'ride share',
    parent: 'auto & transport',
    subCategories: [],
  },
  {
    label: 'Service & Parts',
    value: 'service & parts',
    parent: 'auto & transport',
    subCategories: [],
  },
  {
    label: 'Bills & Utilities',
    value: 'bills & utilities',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Internet',
    value: 'internet',
    parent: 'bills & utilities',
    subCategories: [],
  },
  {
    label: 'Mobile Phone',
    value: 'mobile phone',
    parent: 'bills & utilities',
    subCategories: [],
  },
  {
    label: 'Television',
    value: 'television',
    parent: 'bills & utilities',
    subCategories: [],
  },
  {
    label: 'Utilities',
    value: 'utilities',
    parent: 'bills & utilities',
    subCategories: [],
  },
  {
    label: 'Education',
    value: 'education',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Books & Supplies',
    value: 'books & supplies',
    parent: 'education',
    subCategories: [],
  },
  {
    label: 'Student Loan',
    value: 'student loan',
    parent: 'education',
    subCategories: [],
  },
  {
    label: 'Tuition',
    value: 'tuition',
    parent: 'education',
    subCategories: [],
  },
  {
    label: 'Entertainment',
    value: 'entertainment',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Activities',
    value: 'activities',
    parent: 'entertainment',
    subCategories: [],
  },
  {
    label: 'Arts',
    value: 'arts',
    parent: 'entertainment',
    subCategories: [],
  },
  {
    label: 'Movies',
    value: 'movies',
    parent: 'entertainment',
    subCategories: [],
  },
  {
    label: 'Music',
    value: 'music',
    parent: 'entertainment',
    subCategories: [],
  },
  {
    label: 'Books',
    value: 'books',
    parent: 'entertainment',
    subCategories: [],
  },
  {
    label: 'Games',
    value: 'games',
    parent: 'entertainment',
    subCategories: [],
  },
  {
    label: 'Fees & Charges',
    value: 'fees & charges',
    parent: '',
    subCategories: [],
  },
  {
    label: 'ATM Fee',
    value: 'atm fee',
    parent: 'fees & charges',
    subCategories: [],
  },
  {
    label: 'Bank Fee',
    value: 'bank fee',
    parent: 'fees & charges',
    subCategories: [],
  },
  {
    label: 'Finance Charge',
    value: 'finance charge',
    parent: 'fees & charges',
    subCategories: [],
  },
  {
    label: 'Late Fee',
    value: 'late fee',
    parent: 'fees & charges',
    subCategories: [],
  },
  {
    label: 'Service Fee',
    value: 'service fee',
    parent: 'fees & charges',
    subCategories: [],
  },
  {
    label: 'Trade Commissions',
    value: 'trade commissions',
    parent: 'fees & charges',
    subCategories: [],
  },
  {
    label: 'Financial',
    value: 'financial',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Roth IRA',
    value: 'roth ira',
    parent: 'financial',
    subCategories: [],
  },
  {
    label: 'Investment',
    value: 'investment',
    parent: 'financial',
    subCategories: [],
  },
  {
    label: 'Food & Dining',
    value: 'food & dining',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Alcohol & Bars',
    value: 'alcohol & bars',
    parent: 'food & dining',
    subCategories: [],
  },
  {
    label: 'Coffee Shops',
    value: 'coffee shops',
    parent: 'food & dining',
    subCategories: [],
  },
  {
    label: 'Food Delivery',
    value: 'food delivery',
    parent: 'food & dining',
    subCategories: [],
  },
  {
    label: 'Groceries',
    value: 'groceries',
    parent: 'food & dining',
    subCategories: [],
  },
  {
    label: 'Restaurants',
    value: 'restaurants',
    parent: 'food & dining',
    subCategories: [],
  },
  {
    label: 'Gifts & Donations',
    value: 'gifts & donations',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Charity',
    value: 'charity',
    parent: 'gifts & donations',
    subCategories: [],
  },
  {
    label: 'Gift',
    value: 'gift',
    parent: 'gifts & donations',
    subCategories: [],
  },
  {
    label: 'Health & Fitness',
    value: 'health & fitness',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Dentist',
    value: 'dentist',
    parent: 'health & fitness',
    subCategories: [],
  },
  {
    label: 'Doctor',
    value: 'doctor',
    parent: 'health & fitness',
    subCategories: [],
  },
  {
    label: 'Eyecare',
    value: 'eyecare',
    parent: 'health & fitness',
    subCategories: [],
  },
  {
    label: 'Gym',
    value: 'gym',
    parent: 'health & fitness',
    subCategories: [],
  },
  {
    label: 'Health Insurance',
    value: 'health insurance',
    parent: 'health & fitness',
    subCategories: [],
  },
  {
    label: 'Pharmacy',
    value: 'pharmacy',
    parent: 'health & fitness',
    subCategories: [],
  },
  {
    label: 'Sports',
    value: 'sports',
    parent: 'health & fitness',
    subCategories: [],
  },
  {
    label: 'Home',
    value: 'home',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Furnishings',
    value: 'furnishings',
    parent: 'home',
    subCategories: [],
  },
  {
    label: 'Home Improvement',
    value: 'home improvement',
    parent: 'home',
    subCategories: [],
  },
  {
    label: 'Home Insurance',
    value: 'home insurance',
    parent: 'home',
    subCategories: [],
  },
  {
    label: 'Home Services',
    value: 'home services',
    parent: 'home',
    subCategories: [],
  },
  {
    label: 'Home Supplies',
    value: 'home supplies',
    parent: 'home',
    subCategories: [],
  },
  {
    label: 'Lawn & Garden',
    value: 'lawn & garden',
    parent: 'home',
    subCategories: [],
  },
  {
    label: 'Mortgage & Rent',
    value: 'mortgage & rent',
    parent: 'home',
    subCategories: [],
  },
  {
    label: 'Income',
    value: 'income',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Bonus',
    value: 'bonus',
    parent: 'income',
    subCategories: [],
  },
  {
    label: 'Interest Income',
    value: 'interest income',
    parent: 'income',
    subCategories: [],
  },
  {
    label: 'Paycheck',
    value: 'paycheck',
    parent: 'income',
    subCategories: [],
  },
  {
    label: 'Reimburstments',
    value: 'reimburstments',
    parent: 'income',
    subCategories: [],
  },
  {
    label: 'Tax Return',
    value: 'tax return',
    parent: 'income',
    subCategories: [],
  },
  {
    label: 'Investments',
    value: 'investments',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Buy',
    value: 'buy',
    parent: 'investments',
    subCategories: [],
  },
  {
    label: 'Deposit',
    value: 'deposit',
    parent: 'investments',
    subCategories: [],
  },
  {
    label: 'Dividend & Cap Gains',
    value: 'dividend & cap gains',
    parent: 'investments',
    subCategories: [],
  },
  {
    label: 'Sell',
    value: 'sell',
    parent: 'investments',
    subCategories: [],
  },
  {
    label: 'Withdrawl',
    value: 'withdrawl',
    parent: 'investments',
    subCategories: [],
  },
  {
    label: 'Loans',
    value: 'loans',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Loan Fees & Charges',
    value: 'loan fees & charges',
    parent: 'loans',
    subCategories: [],
  },
  {
    label: 'Loan Insurance',
    value: 'loan insurance',
    parent: 'loans',
    subCategories: [],
  },
  {
    label: 'Loan Interest',
    value: 'loan interest',
    parent: 'loans',
    subCategories: [],
  },
  {
    label: 'Loan Payments',
    value: 'loan payments',
    parent: 'loans',
    subCategories: [],
  },
  {
    label: 'Loan Principal',
    value: 'loan principal',
    parent: 'loans',
    subCategories: [],
  },
  {
    label: 'Misc',
    value: 'misc',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Personal Care',
    value: 'personal care',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Hair',
    value: 'hair',
    parent: 'personal care',
    subCategories: [],
  },
  {
    label: 'Laundry',
    value: 'laundry',
    parent: 'personal care',
    subCategories: [],
  },
  {
    label: 'Spa & Massage',
    value: 'spa & massage',
    parent: 'personal care',
    subCategories: [],
  },
  {
    label: 'Pets',
    value: 'pets',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Pet Food & Supplies',
    value: 'pet food & supplies',
    parent: 'pets',
    subCategories: [],
  },
  {
    label: 'Pet Grooming',
    value: 'pet grooming',
    parent: 'pets',
    subCategories: [],
  },
  {
    label: 'Veterinary',
    value: 'veterinary',
    parent: 'pets',
    subCategories: [],
  },
  {
    label: 'Shopping',
    value: 'shopping',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Clothing',
    value: 'clothing',
    parent: 'shopping',
    subCategories: [],
  },
  {
    label: 'Electronics & Software',
    value: 'electronics & software',
    parent: 'shopping',
    subCategories: [],
  },
  {
    label: 'Hobbies',
    value: 'hobbies',
    parent: 'shopping',
    subCategories: [],
  },
  {
    label: 'Household',
    value: 'household',
    parent: 'shopping',
    subCategories: [],
  },
  {
    label: 'Taxes',
    value: 'taxes',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Federal Tax',
    value: 'federal tax',
    parent: 'taxes',
    subCategories: [],
  },
  {
    label: 'Local Tax',
    value: 'local tax',
    parent: 'taxes',
    subCategories: [],
  },
  {
    label: 'Property Tax',
    value: 'property tax',
    parent: 'taxes',
    subCategories: [],
  },
  {
    label: 'Sales Tax',
    value: 'sales tax',
    parent: 'taxes',
    subCategories: [],
  },
  {
    label: 'State Tax',
    value: 'state tax',
    parent: 'taxes',
    subCategories: [],
  },
  {
    label: 'Transfer',
    value: 'transfer',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Credit Card Payment',
    value: 'credit card payment',
    parent: 'transfer',
    subCategories: [],
  },
  {
    label: 'Travel',
    value: 'travel',
    parent: '',
    subCategories: [],
  },
  {
    label: 'Air Travel',
    value: 'air travel',
    parent: 'travel',
    subCategories: [],
  },
  {
    label: 'Hotel',
    value: 'hotel',
    parent: 'travel',
    subCategories: [],
  },
  {
    label: 'Rental Car & Taxi',
    value: 'rental car & taxi',
    parent: 'travel',
    subCategories: [],
  },
  {
    label: 'Vacation',
    value: 'vacation',
    parent: 'travel',
    subCategories: [],
  },
  {
    label: 'Other',
    value: 'other',
    parent: '',
    subCategories: [],
  },
];

export type { Transaction, NewTransaction };
export type { Category };
export { categories };
