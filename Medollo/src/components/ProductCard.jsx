import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import LoginRequiredModal from './ui/LoginRequiredModal';

const ProductCard = ({ product, currentPath }) => {
  const { addToCart, isLoggedIn } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isWishListed, setIsWishListed] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    const success = addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      originalPrice: product.price,
      image: product.image,
      brand: product.brand || 'Generic',
      quantity: 1
    });

    if (success) {
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000); // Reset after 2 seconds
    }
  };

  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    setIsWishListed(!isWishListed);
  };

  const discount = product.price && product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <>
      <motion.div 
        className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative pb-[100%] overflow-hidden">
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
              {discount}% OFF
            </div>
          )}
          <Link to={`/products/${product.id}`}>
            <img 
              src={product.image || '/placeholder-medicine.jpg'} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-200 hover:scale-110"
              onError={(e) => { e.target.src = '/placeholder-medicine.jpg'; }}
            />
          </Link>
          <button 
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all z-10"
          >
            <HeartIcon className={`h-5 w-5 ${isWishListed ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          </button>
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex-grow">
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
              <Link to={`/products/${product.id}`} className="hover:text-primary">
                {product.name}
              </Link>
            </h3>
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">
              {product.brand || 'Generic'}
            </p>
          </div>
          
          <div className="mt-2">
            <div className="flex items-baseline">
              <span className="font-bold text-lg">₹{product.discountPrice || product.price}</span>
              {product.discountPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">₹{product.price}</span>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button 
                onClick={handleAddToCart}
                disabled={isAddedToCart}
                className={`flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isAddedToCart 
                    ? 'bg-green-500 text-white' 
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {isAddedToCart ? (
                  <>
                    <CheckIcon className="h-4 w-4 mr-1" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="h-4 w-4 mr-1" /> Add to Cart
                  </>
                )}
              </button>
              <Link 
                to={`/products/${product.id}`} 
                className="text-sm text-primary font-medium hover:underline"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <LoginRequiredModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        returnUrl={currentPath}
      />
    </>
  );
};

export default ProductCard;