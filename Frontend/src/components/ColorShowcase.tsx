import React from 'react';
import { Container, Card } from './ui';

export default function ColorShowcase() {
  const colorPalette = {
    primary: {
      name: 'Blue (Primary)',
      description: 'Main brand blue for primary UI elements',
      colors: [
        { name: '50', class: 'bg-primary-50', hex: '#e3f2fd' },
        { name: '100', class: 'bg-primary-100', hex: '#bbdefb' },
        { name: '200', class: 'bg-primary-200', hex: '#90caf9' },
        { name: '300', class: 'bg-primary-300', hex: '#64b5f6' },
        { name: '400', class: 'bg-primary-400', hex: '#42a5f5' },
        { name: '500', class: 'bg-primary-500', hex: '#2196f3' },
        { name: '600', class: 'bg-primary-600', hex: '#1e88e5' },
        { name: '700', class: 'bg-primary-700', hex: '#1976d2' },
        { name: '800', class: 'bg-primary-800', hex: '#1565c0' },
        { name: '900', class: 'bg-primary-900', hex: '#0d47a1' },
      ]
    },
    secondary: {
      name: 'Blue Accent',
      description: 'Secondary blue for highlights and secondary actions',
      colors: [
        { name: '50', class: 'bg-secondary-50', hex: '#f0f7ff' },
        { name: '100', class: 'bg-secondary-100', hex: '#c2e0ff' },
        { name: '200', class: 'bg-secondary-200', hex: '#99ccf3' },
        { name: '300', class: 'bg-secondary-300', hex: '#66b2ff' },
        { name: '400', class: 'bg-secondary-400', hex: '#3399ff' },
        { name: '500', class: 'bg-secondary-500', hex: '#007fff' },
        { name: '600', class: 'bg-secondary-600', hex: '#0059b2' },
        { name: '700', class: 'bg-secondary-700', hex: '#004494' },
        { name: '800', class: 'bg-secondary-800', hex: '#003366' },
        { name: '900', class: 'bg-secondary-900', hex: '#001a33' },
      ]
    },
    accent: {
      name: 'Amber/Orange Accent',
      description: 'Amber/yellow for calls-to-action and highlights',
      colors: [
        { name: '50', class: 'bg-accent-50', hex: '#fff8e1' },
        { name: '100', class: 'bg-accent-100', hex: '#ffecb3' },
        { name: '200', class: 'bg-accent-200', hex: '#ffe082' },
        { name: '300', class: 'bg-accent-300', hex: '#ffd54f' },
        { name: '400', class: 'bg-accent-400', hex: '#ffca28' },
        { name: '500', class: 'bg-accent-500', hex: '#ffc107' },
        { name: '600', class: 'bg-accent-600', hex: '#ffb300' },
        { name: '700', class: 'bg-accent-700', hex: '#ffa000' },
        { name: '800', class: 'bg-accent-800', hex: '#ff8f00' },
        { name: '900', class: 'bg-accent-900', hex: '#ff6f00' },
      ]
    },
  };

  return (
    <Container className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gradient mb-4">Enhanced Nardo Grey Design System</h1>
        <p className="text-xl text-primary-600 max-w-3xl mx-auto">
          Our sophisticated color palette featuring Nardo Grey as the primary color, 
          enhanced with blue and orange accents for a modern, professional marketplace experience.
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(colorPalette).map(([key, palette]) => (
          <Card key={key} className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary-700 mb-2">{palette.name}</h2>
              <p className="text-primary-600">{palette.description}</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-4">
              {palette.colors.map((color) => (
                <div key={color.name} className="text-center">
                  <div 
                    className={`w-full h-20 rounded-lg shadow-md mb-2 ${color.class} border border-primary-200/30`}
                    title={`${color.name}: ${color.hex}`}
                  />
                  <div className="text-sm font-semibold text-primary-700">{color.name}</div>
                  <div className="text-xs text-primary-500 font-mono">{color.hex}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-12 p-8">
        <h2 className="text-2xl font-bold text-primary-700 mb-6">Design Philosophy</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary-700 mb-3">Blue Dominance</h3>
            <p className="text-primary-600 mb-4">
              Blue serves as our primary color throughout the interface, providing:
            </p>
            <ul className="space-y-2 text-primary-600">
              <li>• Trust, professionalism, and clarity</li>
              <li>• Excellent readability and contrast</li>
              <li>• Versatile background and text colors</li>
              <li>• Consistent visual hierarchy</li>
              <li>• Enhanced glassmorphism effects</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-700 mb-3">Accent Strategy</h3>
            <p className="text-primary-600 mb-4">
              Amber/orange accents complement blue by:
            </p>
            <ul className="space-y-2 text-primary-600">
              <li>• Drawing attention to calls-to-action</li>
              <li>• Highlighting important features</li>
              <li>• Providing energetic contrast</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="mt-8 p-8">
        <h2 className="text-2xl font-bold text-primary-700 mb-6">Usage Guidelines</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-primary-50/30 rounded-xl border border-primary-200/50">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              P
            </div>
            <h3 className="font-semibold text-primary-700 mb-2">Primary Elements</h3>
            <p className="text-sm text-primary-600">Main navigation, headers, and core UI components</p>
          </div>
          <div className="text-center p-6 bg-secondary-50/30 rounded-xl border border-secondary-200/50">
            <div className="w-16 h-16 bg-gradient-to-r from-secondary-600 to-secondary-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              S
            </div>
            <h3 className="font-semibold text-primary-700 mb-2">Secondary Actions</h3>
            <p className="text-sm text-primary-600">Buttons, links, and supporting interface elements</p>
          </div>
          <div className="text-center p-6 bg-accent-50/30 rounded-xl border border-accent-200/50">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-600 to-accent-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              C
            </div>
            <h3 className="font-semibold text-primary-700 mb-2">Calls-to-Action</h3>
            <p className="text-sm text-primary-600">Primary buttons, important features, and promotions</p>
          </div>
        </div>
      </Card>
    </Container>
  );
} 