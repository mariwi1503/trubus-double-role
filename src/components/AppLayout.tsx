'use client';

import React, { useState, useCallback } from 'react';
import Header from './halotrubus/Header';
import ExpertHeader from './halotrubus/ExpertHeader';
import BottomNav from './halotrubus/BottomNav';
import HomeView from './halotrubus/HomeView';
import ShopView from './halotrubus/ShopView';
import ConsultView from './halotrubus/ConsultView';
import ArticlesView from './halotrubus/ArticlesView';
import ProfileView from './halotrubus/ProfileView';
import CartModal from './halotrubus/CartModal';
import ProductDetailModal from './halotrubus/ProductDetailModal';
import ConsultationModal from './halotrubus/ConsultationModal';
import ArticleDetailModal from './halotrubus/ArticleDetailModal';
import SuccessModal from './halotrubus/SuccessModal';
import AuthModal, { RegisterData } from './halotrubus/AuthModal';
import { Article, CartItem, Expert, Product } from '../data/dummyData';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'consumer' | 'expert';
  avatar: string;
  isVerified: boolean;
}

const AppLayout: React.FC = () => {
  // Navigation state
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchChange, setSearchChange] = useState('');

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // User state
  const [userRole, setUserRole] = useState<'consumer' | 'expert'>('consumer');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  // Success modal state
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    type: 'cart' | 'consultation' | 'checkout';
    message?: string;
  }>({ isOpen: false, type: 'cart' });

  // Auth handlers
  const handleLogin = useCallback((email: string, password: string) => {
    // Determine role based on email (for demo purposes)
    let role: 'consumer' | 'expert' = 'consumer';
    let name = 'Budi Santoso';
    let avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200';

    if (email.includes('ahli')) {
      role = 'expert';
      name = 'Dr. Siti Nurhaliza';
      avatar = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200';
    }

    const mockUser: UserData = {
      id: '1',
      name: name,
      email: email,
      phone: '081234567890',
      role: role,
      avatar: avatar,
      isVerified: true
    };
    setUserData(mockUser);
    setUserRole(mockUser.role);
    setActiveTab(role === 'expert' ? 'consult' : 'home');
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  }, []);

  const handleRegister = useCallback((data: RegisterData) => {
    // Simulate registration - in real app, this would call an API
    const newUser: UserData = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      avatar: data.role === 'consumer'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
        : 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200',
      isVerified: false
    };
    setUserData(newUser);
    setUserRole(newUser.role);
    // Note: Not setting isLoggedIn to true here because user needs to verify email first
  }, []);

  const handleForgotPassword = useCallback((email: string) => {
    // Simulate forgot password - in real app, this would call an API
    console.log('Password reset requested for:', email);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserData(null);
    setUserRole('consumer');
    setCartItems([]);
  }, []);

  // Cart functions
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setSuccessModal({ isOpen: true, type: 'cart', message: `${product.name} ditambahkan ke keranjang` });
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const handleCheckout = useCallback(() => {
    if (!isLoggedIn) {
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    setSuccessModal({ isOpen: true, type: 'checkout' });
    setCartItems([]);
  }, [isLoggedIn]);

  // Navigation handlers
  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }, []);

  const handleExpertClick = useCallback((expert: Expert) => {
    setSelectedExpert(expert);
    setIsConsultModalOpen(true);
  }, []);

  const handleArticleClick = useCallback((article: Article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  }, []);

  const handleCategoryClick = useCallback((category: string) => {
    setSelectedCategory(category);
    setActiveTab('shop');
  }, []);

  const handleBookConsultation = useCallback((expert: Expert, date: string, time: string, type: string) => {
    if (!isLoggedIn) {
      setIsConsultModalOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    setIsConsultModalOpen(false);
    setSuccessModal({
      isOpen: true,
      type: 'consultation',
      message: `Konsultasi dengan ${expert.name} pada ${date} pukul ${time} berhasil dipesan.`
    });
  }, [isLoggedIn]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const renderContent = () => {
    // If expert, redirect to consult if trying to access other tabs
    if (userRole === 'expert' && !['consult', 'articles', 'profile'].includes(activeTab)) {
      return (
        <ConsultView
          onExpertClick={handleExpertClick}
          userRole={userRole}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            onProductClick={handleProductClick}
            onAddToCart={(product) => addToCart(product)}
            onExpertClick={handleExpertClick}
            onArticleClick={handleArticleClick}
            onCategoryClick={handleCategoryClick}
            onViewAllProducts={() => setActiveTab('shop')}
            onViewAllExperts={() => setActiveTab('consult')}
            onViewAllArticles={() => setActiveTab('articles')}
          />
        );
      case 'shop':
        return (
          <ShopView
            onProductClick={handleProductClick}
            onAddToCart={(product) => addToCart(product)}
            initialCategory={selectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchChange}
          />
        );
      case 'consult':
        return (
          <ConsultView
            onExpertClick={handleExpertClick}
            userRole={userRole}
          />
        );
      case 'articles':
        return (
          <ArticlesView
            onArticleClick={handleArticleClick}
            userRole={userRole}
            userData={userData}
          />
        );
      case 'profile':
        return (
          <ProfileView
            userRole={userRole}
            onRoleChange={(role) => {
              setUserRole(role);
              // Update activeTab if current tab is not available for the new role
              if (role === 'expert' && ['home', 'shop'].includes(activeTab)) {
                setActiveTab('consult');
              }
            }}
            isLoggedIn={isLoggedIn}
            userData={userData}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto relative">
      {/* Header - different for consumers and experts */}
      {userRole === 'consumer' && activeTab === 'home' && (
        <Header
          onSearchClick={() => setActiveTab('shop')}
          onCartClick={() => setIsCartOpen(true)}
          cartCount={cartCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
      {userRole === 'expert' && !['profile'].includes(activeTab) && (
        <ExpertHeader
          userName={userData?.name}
          userAvatar={userData?.avatar}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content */}
      <main className={activeTab === 'home' && userRole === 'consumer' ? 'pt-0' : 'pt-0'}>
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'shop') {
            setSelectedCategory(undefined);
          }
        }}
        cartCount={cartCount}
        userRole={userRole}
      />

      {/* Modals */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={handleCheckout}
        onProductClick={handleProductClick}
      />

      <ProductDetailModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        onAddToCart={addToCart}
      />

      <ConsultationModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        expert={selectedExpert}
        onBookConsultation={handleBookConsultation}
      />

      <ArticleDetailModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        article={selectedArticle}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
        type={successModal.type}
        message={successModal.message}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onForgotPassword={handleForgotPassword}
      />

      {/* Custom Styles */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes scale-up {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-scale-up {
          animation: scale-up 0.2s ease-out;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AppLayout;
