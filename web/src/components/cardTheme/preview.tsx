// src/components/cardTheme/preview.tsx

'use client';

import React, { useState } from 'react';
import CoverSocialWeb from './themecover';
import ClassicDarkWeb from './themedark';
import HangingGlassWeb from './themehanging';
import ShareContactForm from '../shareContactForm';

export default function CardThemePreview({ card }: { card: any }) {
  const [showForm, setShowForm] = useState(false);

  const theme = (card.theme || '').trim().toLowerCase();

  const renderThemeComponent = () => {
    switch (theme) {
      case 'theme-hanging-glass':
        return <HangingGlassWeb card={card} />;
      case 'theme-cover-social':
        return <CoverSocialWeb card={card} />;
      case 'theme-classic-dark':
        return <ClassicDarkWeb card={card} />;
      default:
        return <div>Unknown theme</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-6 px-4">
      {renderThemeComponent()}

      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full"
        onClick={() => setShowForm(true)}
      >
        Share Contact
      </button>

      {showForm && <ShareContactForm cardId={card.id} onClose={() => setShowForm(false)} />}
    </div>
  );
}
