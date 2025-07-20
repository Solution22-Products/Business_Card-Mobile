import React from 'react';

export default function ClassicDarkWeb({ card }: { card: any }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-black p-4">
      <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-xl p-6 w-full max-w-sm text-center text-white">
        <img
          src={card.profile_url}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto border-2 border-white"
        />
        <h2 className="text-2xl font-bold mt-4">{card.full_name}</h2>
        <p className="text-white/80">{card.designation}</p>
        <p className="text-white/60">{card.company}</p>

        <div className="mt-4 space-y-1 text-sm">
          {card.email && <p>📧 {card.email}</p>}
          {card.mobile && <p>📞 {card.mobile}</p>}
          {card.website && (
            <p>
              🌐 <a href={card.website} className="underline text-blue-300">{card.website}</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

