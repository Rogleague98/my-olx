import React from 'react';

export default function TrustStats() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-3xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#3578e5] to-amber-400 bg-clip-text text-transparent">Trust & Stats</h1>
        <div className="mb-8 text-[#2563EB]">
          <p className="mb-2">At MarketPlace, trust and transparency are at the core of our community. Here are some numbers and facts that show why millions choose us:</p>
          <ul className="list-disc pl-6 text-[#3578e5] mb-4">
            <li><span className="font-bold text-amber-500">4.8/5</span> Average User Rating</li>
            <li><span className="font-bold text-amber-500">2M+</span> Active Users</li>
            <li><span className="font-bold text-amber-500">500K+</span> Successful Sales</li>
          </ul>
          <p className="mb-2">We use secure payment methods, verify users, and offer 24/7 support to keep your experience safe and enjoyable.</p>
          <p>Have questions? <a href="mailto:support@marketplace.com" className="text-amber-500 underline">Contact our support team</a>.</p>
        </div>
      </div>
    </div>
  );
} 