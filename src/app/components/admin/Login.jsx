import React, { useState } from 'react';
import { Lock, User, Mail, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { login, register } from '../../../api/api';
import { isValidEmail, isValidPassword } from '../../../utils/validation';

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const registerUser = async () => {
    try {
      setLoading(true);
      setError('');
      const { name, email, password, role } = formData;

      if (!name || !email || !password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      if (!isValidEmail(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      if (!isValidPassword(password)) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      const response = await register({ name, email, password, role });

      if (response.data) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '', role: 'user' });
          setShowSuccessPopup(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Backend not reachable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async () => {
    try {
      setLoading(true);
      setError('');
      const { email, password } = formData;

      if (!email || !password) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }

      if (!isValidEmail(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // 🔽 NORMAL USER / ADMIN LOGIN (UNCHANGED)
      const response = await login({ email, password });

      if (response.data) {
        onLogin(response.data.user, response.data.token);
        return;
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (loading) return; // ✅ PREVENT DOUBLE SUBMIT

    if (isLogin) {
      await loginUser();
    } else {
      await registerUser();
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white">
      {/* MOBILE BACKGROUND (Visible only on small screens) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0 lg:hidden user-select-none pointer-events-none"
      >
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
          alt="Food Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </motion.div>

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center">Registration Successful!</h2>
                <p className="text-gray-600 text-center">You can now sign in</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEFT SIDE: BRANDING/IMAGE */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center z-10"
      >
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
            alt="Food Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center p-12 text-white max-w-lg">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-[#E23744] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <UtensilsCrossed className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-5xl font-extrabold mb-6 tracking-tight"
          >
            FoodFusion
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xl text-gray-200 font-light leading-relaxed"
          >
            Manage your restaurant, track orders, and delight customers—all in one place.
          </motion.p>
        </div>
      </motion.div>

      {/* RIGHT SIDE: FORM */}
      {/* RIGHT SIDE: FORM */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-16 relative z-10"
      >
        <div className="w-full max-w-md space-y-8 bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl lg:shadow-xl border border-white/20 sm:border-gray-100">

          {/* MOBILE HEADER (Visible only on small screens) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="w-12 h-12 bg-[#E23744] rounded-full flex items-center justify-center mb-4"
            >
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900">FoodFusion</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-start"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLogin ? 'Please enter your details to sign in.' : 'Join us to start ordering or selling.'}
            </p>
          </motion.div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  key="name-field"
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:ring-4 focus:ring-red-50 transition-all bg-gray-50 focus:bg-white"
                      placeholder="John Doe"
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:ring-4 focus:ring-red-50 transition-all bg-gray-50 focus:bg-white"
                  placeholder="name@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:ring-4 focus:ring-red-50 transition-all bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  key="role-field"
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:ring-4 focus:ring-red-50 bg-gray-50 focus:bg-white transition-all appearance-none"
                      disabled={loading}
                    >
                      <option value="user">Customer (Ordering Food)</option>
                      <option value="admin">Restaurant Partner (Selling Food)</option>
                      <option value="agent">Delivery Agent (Delivering Food)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-500 rotate-45 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#E23744] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#c42e3a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-red-100 hover:shadow-2xl"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </motion.button>

            <div className="text-center pt-2">
              <p className="text-gray-500 text-sm">
                {isLogin ? "New to FoodFusion? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({ name: '', email: '', password: '', role: 'user' });
                  }}
                  disabled={loading}
                  className="text-[#E23744] font-bold hover:underline"
                >
                  {isLogin ? "Create Account" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}