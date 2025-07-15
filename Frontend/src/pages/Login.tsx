import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card, Container } from '../components/ui';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-md w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse-glow">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gradient mb-3">Welcome Back</h1>
            <p className="text-white text-lg">Sign in to your account to continue</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Sparkles className="w-5 h-5 text-accent-500" />
                <span className="text-sm text-primary-500 font-medium">Secure & Fast Login</span>
                <Sparkles className="w-5 h-5 text-accent-500" />
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-fade-in flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {error}
                </div>
              )}
              
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                icon={Mail}
                required
                className="bg-white/50 backdrop-blur-sm"
              />
              
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  icon={Lock}
                  iconPosition="left"
                  required
                  className="bg-white/50 backdrop-blur-sm"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors p-1 rounded-lg hover:bg-primary-50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              <Button
                type="submit"
                loading={loading}
                className="w-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                icon={ArrowRight}
                iconPosition="right"
                variant="solid"
                color="primary"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
            <p className="text-white">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                className="text-white font-semibold transition-colors hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
      </div>
    </div>
  );
} 