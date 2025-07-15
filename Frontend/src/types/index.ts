export type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
};

export type Listing = {
  city: string;
  location: string;
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  sellerId: string;
  createdAt: string;
  promoted?: boolean;
  verified?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  listings: Listing[];
  profilePic?: string;
  bio?: string;
}; 