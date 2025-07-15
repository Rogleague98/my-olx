import React from 'react';

export default function CommunityGuidelines() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-3xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#3578e5] to-amber-400 bg-clip-text text-transparent">Community Guidelines</h1>
        <p className="mb-4 text-[#2563EB]">We strive to foster a positive, respectful, and safe community. Please follow these guidelines when using MarketPlace.</p>
        <ul className="list-disc pl-6 text-[#3578e5] mb-4">
          <li>Be respectful and courteous to all users</li>
          <li>Do not post offensive or inappropriate content</li>
          <li>Report harassment, abuse, or suspicious activity</li>
          <li>Only list items that are legal and allowed on MarketPlace</li>
          <li>Help keep the community safe and welcoming</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-[#2563EB]">Contact Support</h2>
        <p className="text-[#3578e5]">If you have concerns about community behavior, contact us at <a href="mailto:support@marketplace.com" className="text-amber-500 underline">support@marketplace.com</a>.</p>
      </div>
    </div>
  );
} 