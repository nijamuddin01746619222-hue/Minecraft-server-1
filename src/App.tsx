import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import StoreLayout from './components/layout/StoreLayout';
import AdminLayout from './components/layout/AdminLayout';

// Store Pages
import Home from './pages/store/Home';
import CategoryPage from './pages/store/CategoryPage';
import ProductDetails from './pages/store/ProductDetails';
import Cart from './pages/store/Cart';
import Checkout from './pages/store/Checkout';
import Profile from './pages/store/Profile';
import Support from './pages/store/Support';
import Terms from './pages/store/Terms';
import Privacy from './pages/store/Privacy';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import Settings from './pages/admin/Settings';
import Coupons from './pages/admin/Coupons';

import { useAuthStore } from './store/useAuthStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const { user, setUser, setAdminLoggedIn, isAdminLoggedIn } = useAuthStore();
  const { initSettings } = useSettingsStore();

  useEffect(() => {
    const unsubSettings = initSettings();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from firestore to get role
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (user.email?.toLowerCase() === 'taher@gmail.com' && data.role !== 'admin') {
              // Force admin for this email
              const { setDoc } = await import('firebase/firestore');
              await setDoc(doc(db, 'users', user.uid), { ...data, role: 'admin' });
              setUser({ id: user.uid, ...data, role: 'admin' } as any);
            } else {
              setUser({ id: user.uid, ...data } as any);
            }
          } else {
            const role = user.email?.toLowerCase() === 'taher@gmail.com' ? 'admin' : 'user';
            const { setDoc } = await import('firebase/firestore');
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              role: role,
              createdAt: new Date().toISOString(),
              totalSpent: 0
            });
            setUser({ id: user.uid, email: user.email, role: role });
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setUser(null);
      }
    });

    // Check admin session
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession === 'true') {
      setAdminLoggedIn(true);
    }

    return () => {
      unsub();
      unsubSettings();
    };
  }, [setUser, setAdminLoggedIn, initSettings]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Store Routes */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:categoryId" element={<CategoryPage />} />
          <Route path="ranks" element={<CategoryPage type="ranks" />} />
          <Route path="coins" element={<CategoryPage type="coins" />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<Support />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>

        <Route path="/auth" element={<Auth />} />

        {/* Admin Routes */}
        <Route path="/admin">
          <Route index element={isAdminLoggedIn || user?.role === 'admin' || user?.role === 'super_admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to='/auth' replace />} />
          <Route element={isAdminLoggedIn || user?.role === 'admin' || user?.role === 'super_admin' ? <AdminLayout /> : <Navigate to="/admin" replace />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="coupons" element={<Coupons />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
