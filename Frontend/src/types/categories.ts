export type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
};

export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    subcategories: [
      { id: '1-1', name: 'Phones' },
      { id: '1-2', name: 'Laptops' },
      { id: '1-3', name: 'TVs' },
    ],
  },
  {
    id: '2',
    name: 'Vehicles',
    subcategories: [
      { id: '2-1', name: 'Cars' },
      { id: '2-2', name: 'Bikes' },
      { id: '2-3', name: 'Trucks' },
    ],
  },
  {
    id: '3',
    name: 'Home',
    subcategories: [
      { id: '3-1', name: 'Furniture' },
      { id: '3-2', name: 'Appliances' },
      { id: '3-3', name: 'Decor' },
    ],
  },
]; 