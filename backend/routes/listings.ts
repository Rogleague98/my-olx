import express, { Request, Response } from 'express';
import Listing from '../models/Listing';
import { adminCheck } from '../middleware/auth';

const router = express.Router();

// Get all listings with advanced filtering and sorting
router.get('/', async (req: Request, res: Response) => {
  const { q, category, subcategory, location, minPrice, maxPrice, sort } = req.query;
  const filter: any = {};
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];
  }
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (location) filter.location = location;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

  let sortObj: any = {};
  if (sort === 'price_asc') sortObj.price = 1;
  else if (sort === 'price_desc') sortObj.price = -1;
  else if (sort === 'promoted') sortObj = { promoted: -1, createdAt: -1 };
  else sortObj.createdAt = -1; // newest default

  let listings = await Listing.find(filter).sort(sortObj).populate('seller', 'name email');
  
  // If no listings exist, create some sample data
  // if (listings.length === 0) {
  //   // First, create a sample user if none exists
  //   const User = require('../models/User').default;
  //   let sampleUser = await User.findOne();
  //   
  //   if (!sampleUser) {
  //     sampleUser = await User.create({
  //       name: 'Sample Seller',
  //       email: 'seller@example.com',
  //       password: 'password123',
  //       phone: '123-456-7890'
  //     });
  //   }
  //   
  //   // Create sample listings
  //   const sampleListings = [
  //     {
  //       title: 'iPhone 14 Pro',
  //       description: 'Brand new iPhone 14 Pro, never used. 256GB storage.',
  //       price: 999,
  //       images: ['/uploads/1751312362579-mlqko_s_oriz.jpg'],
  //       category: 'Electronics',
  //       subcategory: 'Phones',
  //       location: 'Sofia',
  //       seller: sampleUser._id
  //     },
  //     {
  //       title: 'MacBook Air M2',
  //       description: 'Excellent condition MacBook Air with M2 chip. 8GB RAM, 256GB SSD.',
  //       price: 1200,
  //       images: ['/uploads/1751313492147-30af8efc46b02eabf06d6f93fd265390.jpg'],
  //       category: 'Electronics',
  //       subcategory: 'Computers',
  //       location: 'Plovdiv',
  //       seller: sampleUser._id
  //     },
  //     {
  //       title: 'Nike Air Jordan 1',
  //       description: 'Classic Air Jordan 1 sneakers. Size 10, barely worn.',
  //       price: 150,
  //       images: ['/uploads/1751318087252-30af8efc46b02eabf06d6f93fd265390.jpg'],
  //       category: 'Fashion',
  //       subcategory: 'Shoes',
  //       location: 'Varna',
  //       seller: sampleUser._id
  //     }
  //   ];
  //   
  //   await Listing.insertMany(sampleListings);
  //   listings = await Listing.find(filter).sort(sortObj).populate('seller', 'name email');
  // }
  
  // Transform MongoDB _id to id for frontend compatibility
  const baseUrl = req.protocol + '://' + req.get('host');
  const transformedListings = listings.map(listing => {
    const listingObj = listing.toObject ? listing.toObject() : listing;
    return {
      ...listingObj,
      id: listingObj._id || listingObj.id,
      sellerId: listingObj.seller?._id || listingObj.seller,
      images: Array.isArray(listingObj.images)
        ? listingObj.images.map((img: string) => img.startsWith('http') ? img : `${baseUrl}${img}`)
        : [], // Ensure images is always an array of full URLs
    };
  });
  
  res.json(transformedListings);
});

// Get single listing
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  const listing = await Listing.findById(req.params.id).populate('seller', 'name email');
  if (!listing) return res.status(404).json({ message: 'Not found' });
  
  // Transform MongoDB _id to id for frontend compatibility
  const baseUrl = req.protocol + '://' + req.get('host');
  const listingObj = listing.toObject();
  const transformedListing = {
    ...listingObj,
    id: listingObj._id,
    sellerId: listingObj.seller._id || listingObj.seller,
    images: Array.isArray(listingObj.images)
      ? listingObj.images.map((img: string) => img.startsWith('http') ? img : `${baseUrl}${img}`)
      : [],
  };
  
  res.json(transformedListing);
});

// Create listing
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, price, images, category, subcategory, location, seller } = req.body;
    if (!title || !description || !price || !category || !subcategory || !location || !seller) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const listing = await Listing.create({ title, description, price, images, category, subcategory, location, seller });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update listing
router.put('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!listing) return res.status(404).json({ message: 'Not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete listing
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all listings
router.get('/admin/listings', adminCheck, async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Delete a listing
router.delete('/admin/listings/:id', adminCheck, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Update a listing
router.patch('/admin/listings/:id', adminCheck, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(listing);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
