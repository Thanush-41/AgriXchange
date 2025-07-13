import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, TrendingUp, Eye, Filter, Search } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import type { WholesaleProduct } from '../types';
import { getSocket } from '../utils/socket';

export const LiveBiddingPage: React.FC = () => {
  const [products, setProducts] = useState<WholesaleProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Simulated auth context (replace with real auth context if available)
  const user = JSON.parse(localStorage.getItem('agrixchange_user') || 'null');
  const token = localStorage.getItem('agrixchange_token');

  useEffect(() => {
    if (!user || user.role !== 'trader') return;
    const fetchBiddings = async () => {
      try {
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const response = await fetch('http://localhost:5000/api/bidding/active', { headers });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setProducts(data.data.data || []);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      } catch (error) {
        setProducts([]);
      }
    };
    fetchBiddings(); // Only fetch once on mount
  }, []);    //[token, user]); use in production

  // BiddingCard for real API data
  const BiddingCard: React.FC<{ product: WholesaleProduct }> = ({ product }) => {
    // Fallbacks for stats (API may not provide these fields)
    const bidCount = (product as any).bidCount ?? 0;
    const participants = (product as any).participants ?? 0;
    const currentBid = (product as any).currentBid ?? product.startingPrice;
    const timeLeft = (product as any).timeLeft ?? '';
    const isEndingSoon = typeof timeLeft === 'string' && timeLeft.includes('m') && !timeLeft.includes('h');
    const handleJoinBidding = () => {
      if (!user || !token) {
        alert('Please log in as a trader to join bidding.');
        return;
      }
      // Always create a new socket to ensure fresh auth
      const socket = getSocket(token);
      // Authenticate explicitly before joining room
      socket.emit('authenticate', token);
      socket.once('authenticated', () => {
        // Use biddingRoom._id, not product.id
        const roomId = (product as any).biddingRoom?._id;
        if (!roomId) {
          alert('No bidding room found for this product.');
          return;
        }
        socket.emit('join-bidding-room', roomId);
      });
      socket.once('room-joined', ({ room }) => {
        window.location.href = `/bidding/${room._id}`;
      });
      socket.once('error', (msg: string) => {
        alert(msg);
      });
    };
    return (
      <Card hover className="overflow-hidden">
        <div className="relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${isEndingSoon ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{isEndingSoon ? 'Ending Soon!' : 'Active'}</span>
          </div>
          {timeLeft && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              <Clock className="w-4 h-4 inline mr-1" />
              {timeLeft}
            </div>
          )}
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
              <span className="text-lg font-bold text-primary-600">₹{currentBid?.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{bidCount} bids</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{participants} bidders</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">By {(product.farmer as any)?.name || 'Unknown'}</div>
            <div className="flex space-x-2">
              <Link to={`/bidding/${product.id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </Link>
              <Button size="sm" className={isEndingSoon ? 'bidding-pulse' : ''} onClick={handleJoinBidding}>
                Join Bidding
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Stats: fallback to 0 if fields missing
  const totalAuctions = products.length;
  const totalBidders = products.reduce((sum, p) => sum + ((p as any).participants ?? 0), 0);
  const totalBids = products.reduce((sum, p) => sum + ((p as any).bidCount ?? 0), 0);
  const highestBid = products.length > 0 ? Math.max(...products.map(p => (p as any).currentBid ?? p.startingPrice ?? 0)) : 0;

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
            <div className="text-2xl font-bold text-primary-600 mb-1">{totalAuctions}</div>
            <div className="text-sm text-gray-600">Active Auctions</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-secondary-600 mb-1">
              {totalBidders}
            </div>
            <div className="text-sm text-gray-600">Active Bidders</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {totalBids}
            </div>
            <div className="text-sm text-gray-600">Total Bids</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              ₹{highestBid.toLocaleString()}
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
