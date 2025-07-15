import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-3xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#3578e5] to-amber-400 bg-clip-text text-transparent">Privacy Policy</h1>
        <p className="mb-4 text-white">Last updated: July 2024</p>
        <p className="mb-4 text-white">This Privacy Policy describes how MarketPlace collects, uses, and protects your personal information when you use our services. By using MarketPlace, you agree to the collection and use of information in accordance with this policy.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-white">Information We Collect</h2>
        <ul className="list-disc pl-6 text-white mb-4">
          <li>Personal identification information (Name, email address, phone number, etc.)</li>
          <li>Usage data and cookies</li>
          <li>Location data (if you allow it)</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-white">How We Use Your Information</h2>
        <ul className="list-disc pl-6 text-white mb-4">
          <li>To provide and maintain our service</li>
          <li>To notify you about changes to our service</li>
          <li>To allow you to participate in interactive features</li>
          <li>To provide customer support</li>
          <li>To gather analysis to improve our service</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-white">Your Rights</h2>
        <ul className="list-disc pl-6 text-white mb-4">
          <li>Access, update, or delete your personal information</li>
          <li>Opt out of marketing communications</li>
          <li>Request data portability</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-white">Contact Us</h2>
        <p className="text-white">If you have any questions about this Privacy Policy, contact us at <a href="mailto:support@marketplace.com" className="text-white underline">support@marketplace.com</a>.</p>
      </div>
    </div>
  );
} 