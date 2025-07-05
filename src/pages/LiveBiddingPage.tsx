import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, TrendingUp, Eye, Filter, Search } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import type { WholesaleProduct } from '../types';

// Mock data for bidding products
const mockBiddingProducts: (WholesaleProduct & { 
  currentBid?: number; 
  bidCount: number; 
  timeLeft: string;
  participants: number;
})[] = [
  {
    id: 'bid1',
    name: 'Organic Wheat',
    category: 'grains',
    description: 'Premium quality organic wheat from Punjab',
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    farmerId: 'farmer1',
    farmer: {
      id: 'farmer1',
      name: 'Harpreet Singh',
      phone: '9876543210',
      role: 'farmer',
      address: 'Punjab, India',
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationStatus: 'verified',
    },
    location: {
      latitude: 30.7333,
      longitude: 76.7794,
      address: 'Ludhiana, Punjab',
    },
    type: 'wholesale',
    startingPrice: 2000,
    quantity: 1000,
    unit: 'kg',
    qualityCertificate: 'https://example.com/cert1.pdf',
    biddingEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    biddingStatus: 'active',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    currentBid: 2150,
    bidCount: 8,
    timeLeft: '2h 15m',
    participants: 5,
  },
  {
    id: 'bid2',
    name: 'Fresh Onions',
    category: 'vegetables',
    description: 'Grade A onions, freshly harvested',
    images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    farmerId: 'farmer2',
    farmer: {
      id: 'farmer2',
      name: 'Rajesh Patel',
      phone: '9876543211',
      role: 'farmer',
      address: 'Maharashtra, India',
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationStatus: 'verified',
    },
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Nashik, Maharashtra',
    },
    type: 'wholesale',
    startingPrice: 1500,
    quantity: 2000,
    unit: 'kg',
    qualityCertificate: 'https://example.com/cert2.pdf',
    biddingEndTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    biddingStatus: 'active',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    currentBid: 1680,
    bidCount: 12,
    timeLeft: '4h 52m',
    participants: 8,
  },
  {
    id: 'bid3',
    name: 'Basmati Rice',
    category: 'grains',
    description: 'Premium basmati rice, export quality',
    images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    farmerId: 'farmer3',
    farmer: {
      id: 'farmer3',
      name: 'Sukhwinder Kaur',
      phone: '9876543212',
      role: 'farmer',
      address: 'Punjab, India',
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationStatus: 'verified',
    },
    location: {
      latitude: 31.6340,
      longitude: 74.8723,
      address: 'Amritsar, Punjab',
    },
    type: 'wholesale',
    startingPrice: 4500,
    quantity: 500,
    unit: 'kg',
    qualityCertificate: 'https://example.com/cert3.pdf',
    biddingEndTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    biddingStatus: 'active',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    currentBid: 4750,
    bidCount: 15,
    timeLeft: '28m',
    participants: 6,
  },
];

export const LiveBiddingPage: React.FC = () => {
  const [products, setProducts] = useState(mockBiddingProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setProducts(prev => prev.map(product => ({
        ...product,
        currentBid: product.currentBid! + Math.floor(Math.random() * 50),
        bidCount: product.bidCount + Math.floor(Math.random() * 2),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const BiddingCard: React.FC<{ product: typeof mockBiddingProducts[0] }> = ({ product }) => {
    const isEndingSoon = product.timeLeft.includes('m') && !product.timeLeft.includes('h');
    
    return (
      <Card hover className="overflow-hidden">
        <div className="relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              isEndingSoon 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {isEndingSoon ? 'Ending Soon!' : 'Active'}
            </span>
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            <Clock className="w-4 h-4 inline mr-1" />
            {product.timeLeft}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <span className="text-sm text-gray-500">{product.quantity} {product.unit}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{product.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Starting Price:</span>
              <span className="text-sm font-medium">₹{product.startingPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current Bid:</span>
              <span className="text-lg font-bold text-primary-600">
                ₹{product.currentBid?.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{product.bidCount} bids</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{product.participants} bidders</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              By {product.farmer.name}
            </div>
            <div className="flex space-x-2">
              <Link to={`/bidding/${product.id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </Link>
              <Link to={`/bidding/${product.id}`}>
                <Button size="sm" className={isEndingSoon ? 'bidding-pulse' : ''}>
                  Join Bidding
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Bidding</h1>
          <p className="text-gray-600">Participate in real-time auctions for wholesale agricultural products</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">{products.length}</div>
            <div className="text-sm text-gray-600">Active Auctions</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-secondary-600 mb-1">
              {products.reduce((sum, p) => sum + p.participants, 0)}
            </div>
            <div className="text-sm text-gray-600">Active Bidders</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {products.reduce((sum, p) => sum + p.bidCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Bids</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              ₹{Math.max(...products.map(p => p.currentBid!)).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Highest Bid</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search auctions..."
                leftIcon={<Search className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="">All Categories</option>
                <option value="grains">Grains</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="pulses">Pulses</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="">All Locations</option>
                <option value="punjab">Punjab</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="karnataka">Karnataka</option>
              </select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ending Time
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">Any Time</option>
                    <option value="1h">Within 1 hour</option>
                    <option value="6h">Within 6 hours</option>
                    <option value="24h">Within 24 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Range (kg)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="ending-soon">Ending Soon</option>
                    <option value="highest-bid">Highest Bid</option>
                    <option value="lowest-bid">Lowest Bid</option>
                    <option value="most-bids">Most Bids</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Updates Banner */}
        <div className="bg-primary-600 text-white rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Live Updates Active</span>
            <span className="text-primary-100">•</span>
            <span>Bids are updated in real-time</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <BiddingCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <TrendingUp className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active auctions</h3>
            <p className="text-gray-600">Check back later for new bidding opportunities</p>
          </div>
        )}

        {/* How Bidding Works */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Bidding Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse Auctions</h3>
              <p className="text-gray-600">Browse active wholesale auctions and find products you're interested in.</p>
            </Card>
            <Card className="text-center">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Place Your Bid</h3>
              <p className="text-gray-600">Join the bidding room and place competitive bids in real-time.</p>
            </Card>
            <Card className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Win & Purchase</h3>
              <p className="text-gray-600">If you win, connect directly with the farmer to complete the transaction.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
