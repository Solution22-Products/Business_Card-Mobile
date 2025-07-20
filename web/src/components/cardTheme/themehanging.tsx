// components/cardTheme/HangingGlassWeb.tsx

import React from 'react';

export default function HangingGlassWeb({ card }: { card: any }) {
  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center bg-black"
      style={{
        backgroundImage: `url(${card.cover_url || '/default-cover.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Glass Card */}
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-3xl shadow-2xl w-[90%] max-w-sm px-6 pt-24 pb-6 text-center">
        {/* Hanging Portrait Image */}
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
          <img
            src={card.profile_url}
            alt="Avatar"
            className="w-24 h-48 rounded-xl left-20 border-white shadow-lg object-cover"
          />
        </div>

        {/* Name & Info */}
        <h2 className="text-2xl font-bold mb-1">{card.full_name}</h2>
        {card.designation && <p className="text-white/80 text-sm">{card.designation}</p>}
        {card.company && <p className="text-white/60 text-sm mb-4">{card.company}</p>}

        {/* Contact Info */}
        <div className="text-sm space-y-1">
          {card.mobile && <p>📞 {card.mobile}</p>}
          {card.email && <p>📧 {card.email}</p>}
          {card.website && (
            <p>
              🌐 <a href={card.website} className="underline">{card.website}</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
