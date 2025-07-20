import React from 'react';

export default function CoverSocialWeb({ card }: { card: any }) {
  const socials = [
    { icon: '🌐', key: 'website', url: card.website },
    { icon: '📞', key: 'mobile', url: `tel:${card.mobile}` },
    { icon: '📧', key: 'email', url: `mailto:${card.email}` },
    { icon: '📸', key: 'instagram', url: card.instagram },
    { icon: '💬', key: 'whatsapp', url: card.whatsapp },
    { icon: '👤', key: 'linkedin', url: card.linkedin },
    { icon: '🎵', key: 'tiktok', url: card.tiktok },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl bg-black text-white">
      {/* Background cover image */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${card.cover_url || '/default-cover.jpg'})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90 z-10" />

        {/* Floating Profile Avatar (Hanging Left) */}
        <div className="absolute top-4 left-4 z-30">
          <img
            src={card.profile_url}
            alt="Profile"
            className="w-16 h-20 object-cover rounded-2xl border-4 border-white shadow-lg"
          />
        </div>

        {/* Right Side Name, Designation & Social Icons */}
        <div className="absolute top-60 right-4 flex flex-col items-end gap-3 z-30 text-right">
          <div>
            <h2 className="text-lg font-bold">{card.full_name}</h2>
            {card.designation && (
              <p className="text-xs opacity-80">{card.designation}</p>
            )}
            <span className="text-[10px] bg-white text-black px-2 py-[2px] rounded-full mt-1 inline-block">
              {card.type}
            </span>
          </div>

          {/* Vertical Social Icons on Right */}
          <div className="flex flex-col items-end gap-2 mt-2">
            {socials.map(
              (item, idx) =>
                item.url && (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg bg-black/50 p-2 rounded-full hover:bg-white hover:text-black transition"
                  >
                    {item.icon}
                  </a>
                )
            )}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="absolute bottom-6 w-full flex justify-center gap-4 z-30">
          <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold shadow">
            Save Contact
          </button>
          <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold shadow">
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}
