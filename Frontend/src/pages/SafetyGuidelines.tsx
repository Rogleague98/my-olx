import React from 'react';

export default function SafetyGuidelines() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-3xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#3578e5] to-amber-400 bg-clip-text text-transparent">Safety Guidelines</h1>
        <p className="mb-4 text-[#2563EB]">Your safety is our top priority. Please follow these guidelines to ensure a safe and secure experience on MarketPlace.</p>
        <ul className="list-disc pl-6 text-[#3578e5] mb-4">
          <li>Meet in public, well-lit places for transactions</li>
          <li>Bring a friend or let someone know your plans</li>
          <li>Inspect items before purchasing</li>
          <li>Never share sensitive personal or financial information</li>
          <li>Trust your instincts—if something feels off, walk away</li>
          <li>Report suspicious activity to our support team</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-[#2563EB]">Contact Support</h2>
        <p className="text-[#3578e5]">If you have concerns about safety, contact us at <a href="mailto:support@marketplace.com" className="text-amber-500 underline">support@marketplace.com</a>.</p>
      </div>
    </div>
  );
} 