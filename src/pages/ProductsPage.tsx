import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, MapPin, Star } from 'lucide-react';
import { Button, Card, Input, Loader } from '../components/ui';
import { useCart } from '../context/CartContext';
import type { RetailProduct, ProductCategory } from '../types';

// Mock data for demonstration
const mockProducts: RetailProduct[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    category: 'vegetables',
    description: 'Fresh, organic tomatoes grown with care',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    farmerId: 'farmer1',
    farmer: {
      id: 'farmer1',
      name: 'Ravi Kumar',
      phone: '9876543210',
      role: 'farmer',
      address: 'Karnataka, India',
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationStatus: 'verified',
    },
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Bangalore, Karnataka',
    },
    type: 'retail',
    price: 40,
    unit: 'kg',
    quantity: 100,
    minOrderQuantity: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Organic Basmati Rice',
    category: 'grains',
    description: 'Premium quality organic basmati rice',
    images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    farmerId: 'farmer2',
    farmer: {
      id: 'farmer2',
      name: 'Priya Sharma',
      phone: '9876543211',
      role: 'farmer',
      address: 'Punjab, India',
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationStatus: 'verified',
    },
    location: {
      latitude: 30.7333,
      longitude: 76.7794,
      address: 'Chandigarh, Punjab',
    },
    type: 'retail',
    price: 120,
    unit: 'kg',
    quantity: 500,
    minOrderQuantity: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Fresh Apples',
    category: 'fruits',
    description: 'Crisp and sweet apples from Himachal Pradesh',
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    farmerId: 'farmer3',
    farmer: {
      id: 'farmer3',
      name: 'Suresh Singh',
      phone: '9876543212',
      role: 'farmer',
      address: 'Himachal Pradesh, India',
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationStatus: 'verified',
    },
    location: {
      latitude: 31.1048,
      longitude: 77.1734,
      address: 'Shimla, Himachal Pradesh',
    },
    type: 'retail',
    price: 180,
    unit: 'kg',
    quantity: 200,
    minOrderQuantity: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const categories: { value: ProductCategory; label: string }[] = [
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'grains', label: 'Grains' },
  { value: 'pulses', label: 'Pulses' },
  { value: 'spices', label: 'Spices' },
  { value: 'herbs', label: 'Herbs' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'other', label: 'Other' },
];

export const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();
  const [allProducts, setAllProducts] = useState<RetailProduct[]>([]);
  const [products, setProducts] = useState<RetailProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'latest' | 'popular'>('latest');

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched all products:', data);
          
          if (data.success && data.data) {
            // Map backend products to frontend format
            const mappedProducts: RetailProduct[] = data.data.data
              .filter((product: any) => product.type === 'retail') // Only show retail products
              .map((product: any) => ({
                id: product._id,
                name: product.name,
                category: product.category,
                description: product.description || '',
                images: product.images || ['https://images.unsplash.com/photo-1546470427-e5f5e7e7ff34?w=150&h=150&fit=crop'],
                farmerId: product.farmerId._id || product.farmerId,
                farmer: {
                  id: product.farmerId._id || product.farmerId,
                  name: product.farmerId.name || 'Unknown Farmer',
                  phone: product.farmerId.phone || '',
                  role: 'farmer',
                  address: product.location?.address || '',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  verificationStatus: 'verified' as const,
                },
                location: product.location || { latitude: 0, longitude: 0, address: '' },
                type: 'retail',
                price: product.price || 0,
                unit: product.unit || '',
                quantity: product.quantity || 0,
                minOrderQuantity: product.minOrderQuantity || 1,
                isActive: true,
                createdAt: new Date(product.createdAt),
                updatedAt: new Date(product.updatedAt),
              }));

            setAllProducts(mappedProducts);
          } else {
            console.warn('No products found or invalid response structure');
            setAllProducts(mockProducts); // Fallback to mock data
          }
        } else {
          console.error('Failed to fetch products:', response.status);
          setAllProducts(mockProducts); // Fallback to mock data
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts(mockProducts); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter and sort products
    let filteredProducts = [...allProducts];

    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    filteredProducts = filteredProducts.filter(
      product => product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
    filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setProducts(filteredProducts);
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const ProductCard: React.FC<{ product: RetailProduct }> = ({ product }) => {
    const handleAddToCart = () => {
      addToCart(product, product.minOrderQuantity);
    };

    return (
    <Card hover className="overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <span className="text-xl font-bold text-primary-600">₹{product.price}/{product.unit}</span>
        </div>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{product.location.address}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600">
                {product.farmer.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-gray-600">{product.farmer.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.5</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Min order: {product.minOrderQuantity} {product.unit}</span>
          <Button size="sm" onClick={handleAddToCart}>Add to Cart</Button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fresh Products</h1>
          <p className="text-gray-600">Discover fresh produce directly from verified farmers</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search for products..."
                leftIcon={<Search className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-48">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | '')}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="w-full lg:w-48">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="latest">Latest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (₹)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input placeholder="Enter location..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality Rating
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {mockProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="lg" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <Card key={product.id} className="flex flex-col lg:flex-row overflow-hidden">
                <div className="lg:w-1/3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 lg:h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-2">{product.description}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{product.location.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {product.farmer.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{product.farmer.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600 mb-2">
                        ₹{product.price}/{product.unit}
                      </div>
                      <div className="flex items-center space-x-1 mb-4">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.5</span>
                      </div>
                      <Button>Add to Cart</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setPriceRange({ min: 0, max: 1000 });
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
