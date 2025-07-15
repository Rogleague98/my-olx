import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Button } from '../components/ui';
import { Home, Search, AlertTriangle, Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 via-secondary-100/20 to-accent-100/30"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <Container size="sm" animate>
        <Card variant="elevated" className="text-center py-16 animate-scale-in relative overflow-hidden">
          {/* Card background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-accent-500/10 to-blush-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-xl animate-pulse-glow">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
            
            <h1 className="text-8xl font-bold mb-4 text-gradient animate-pulse-glow">404</h1>
            <h2 className="text-3xl font-bold mb-4 text-primary-700">Page Not Found</h2>
            <p className="text-primary-600 mb-8 text-lg leading-relaxed">
              Oops! The page you're looking for doesn't exist or has been moved to a different location.
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-accent-500" />
              <span className="text-sm text-primary-500 font-medium">Don't worry, we'll help you find your way back</span>
              <Sparkles className="w-5 h-5 text-accent-500" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                icon={ArrowLeft}
                onClick={() => window.history.back()}
                variant="outline"
                color="primary"
                className="shadow-lg hover:shadow-xl"
              >
                Go Back
              </Button>
              <Button 
                icon={Home}
                as={Link}
                to="/"
                variant="solid"
                color="primary"
                className="shadow-lg hover:shadow-xl"
              >
                Go Home
              </Button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/30">
              <p className="text-primary-500 text-sm">
                Need help? <Link to="/help" className="text-primary-600 hover:text-primary-700 underline">Visit our help center</Link>
              </p>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
} 