import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-3xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-white">Cookie Policy</h1>
        <p className="mb-4 text-white">Last updated: July 2024</p>
        <p className="mb-4 text-white">This Cookie Policy explains how MarketPlace uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-white">What Are Cookies?</h2>
        <p className="mb-4 text-white">Cookies are small data files placed on your device when you visit a website. They are widely used to make websites work, or to work more efficiently, as well as to provide reporting information.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-white">How We Use Cookies</h2>
        <ul className="list-disc pl-6 text-white mb-4">
          <li>To enable essential site functionality</li>
          <li>To analyze site usage and improve our services</li>
          <li>To remember your preferences</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-white">Your Choices</h2>
        <p className="mb-4 text-white">You can control and/or delete cookies as you wish. For details, see aboutcookies.org. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2 text-white">Contact Us</h2>
        <p className="text-white">If you have any questions about this Cookie Policy, contact us at <a href="mailto:support@marketplace.com" className="text-white underline">support@marketplace.com</a>.</p>
      </div>
    </div>
  );
} 