import React, { useState } from 'react';
import { Container, Card, Button } from '../components/ui';
import { ShieldCheck, MessageCircle, User, Star, AlertTriangle, HelpCircle, Sparkles, Mail, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export default function Help() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['buying-selling']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const helpSections = [
    {
      id: 'buying-selling',
      title: 'How does buying and selling work?',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      content: [
        'Anyone can post a listing for free. Just click Sell and fill in your item details.',
        'Buyers can search, filter, and view listings. Click Contact on a listing or seller profile to chat directly with the seller.',
        'Payment is arranged directly between buyer and seller. We recommend Cash on Delivery (C.o.D) and meeting in person.',
        'All transactions are peer-to-peer for maximum flexibility and minimal fees.'
      ]
    },
    {
      id: 'safety-tips',
      title: 'Safety Tips',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      content: [
        'Meet in a public place and bring a friend if possible.',
        'Inspect items carefully before paying.',
        'Never send money in advance to strangers.',
        'Use the in-app chat to keep a record of your communication.',
        'Trust your instincts - if something feels off, walk away.',
        'Verify the seller\'s profile and read their reviews.'
      ]
    },
    {
      id: 'reporting',
      title: 'Reporting Issues',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      content: [
        'If you encounter suspicious activity or a problem user, use the Report button on listings or user profiles.',
        'Contact support at support@example.com for urgent issues.',
        'Provide as much detail as possible when reporting.',
        'Our team reviews all reports within 24 hours.',
        'False reports may result in account suspension.'
      ]
    },
    {
      id: 'platform-basics',
      title: 'Platform Basics',
      icon: <User className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      content: [
        'All users can be buyers or sellers.',
        'Promoted listings are highlighted for extra visibility (contact admin to request promotion).',
        'Admins can help with disputes and moderation.',
        'Create an account to save favorites and track your listings.',
        'Use the search and filter features to find exactly what you\'re looking for.',
        'Real-time messaging keeps you connected with buyers and sellers.'
      ]
    }
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email Support',
      value: 'support@example.com',
      action: () => window.open('mailto:support@example.com')
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone Support',
      value: '+1 (555) 123-4567',
      action: () => window.open('tel:+15551234567')
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Office Hours',
      value: 'Mon-Fri 9AM-6PM EST',
      action: null
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 via-secondary-100/20 to-accent-100/30"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <Container className="py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse-glow">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-3">Help & Support</h1>
            <p className="text-white text-lg">Everything you need to know about using our marketplace</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5 text-accent-500" />
            <span className="text-sm text-primary-500 font-medium">24/7 Support Available</span>
            <Sparkles className="w-5 h-5 text-accent-500" />
          </div>
        </div>

        {/* Contact Information */}
        <Card variant="elevated" className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Need Immediate Help?</h2>
              <p className="text-white">Get in touch with our support team</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactInfo.map((contact, index) => (
              <div 
                key={contact.label}
                className={`p-4 rounded-xl border border-white/30 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 cursor-pointer animate-fade-in`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                onClick={contact.action || undefined}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white">
                    {contact.icon}
                  </div>
                  <div>
                      <div className="font-semibold text-white text-sm">{contact.label}</div>
                      <div className="text-white">{contact.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* FAQ Sections */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {helpSections.map((section, index) => (
            <Card
              key={section.id}
              variant="elevated"
              className={`overflow-hidden transition-all duration-300 animate-fade-in ${
                expandedSections.has(section.id) ? 'ring-2 ring-primary-400/60' : ''
              }`}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <button
                className="w-full p-6 flex items-center justify-between hover:bg-white/20 transition-all duration-300"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
                    {section.icon}
                  </div>
                    <h3 className="text-xl font-bold text-white">{section.title}</h3>
                </div>
                  <div className="text-white transition-transform duration-300">
                  {expandedSections.has(section.id) ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </div>
              </button>
              
              {expandedSections.has(section.id) && (
                <div className="px-6 pb-6 animate-fade-in">
                  <div className="border-t border-white/30 pt-4">
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3 text-white">
                            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <Card variant="elevated" className="mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
              <div className="text-white mb-6">Our support team is here to help you with any questions or issues</div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="solid"
                color="primary"
                icon={Mail}
                onClick={() => window.open('mailto:support@example.com')}
                className="shadow-xl hover:shadow-2xl"
              >
                Email Support
              </Button>
              <Button
                variant="outline"
                color="primary"
                icon={MessageCircle}
                onClick={() => window.open('tel:+15551234567')}
              >
                Call Support
              </Button>
            </div>
          </div>
        </Card>
      </Container>
      </div>
    </div>
  );
} 