import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shield, Zap, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onExploreCategory: (category: string) => void;
}

const SLIDES = [
  {
    id: 1,
    title: 'Mission-Critical Video Surveillance & AI Analytics',
    subtitle: 'Ultra low-light 4K Starlight PTZ, thermal perimeter barriers & high-throughput NVRs.',
    tag: 'Enterprise Certified Infrastructure',
    ctaText: 'Explore Surveillance',
    category: 'Video Surveillance & Cameras',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'from-blue-900/90 via-slate-900/80 to-transparent'
  },
  {
    id: 2,
    title: 'Biometric Access Control & Physical Security',
    subtitle: 'Contactless AI facial recognition, OSDP 2.2 encrypted door controllers & turnstiles.',
    tag: 'FIPS 140-2 Standard Compliance',
    ctaText: 'Explore Access Control',
    category: 'Access Control & Door Security',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'from-emerald-950/90 via-slate-900/80 to-transparent'
  },
  {
    id: 3,
    title: 'Renewable Power & Zero-Downtime Backup',
    subtitle: '12kW 3-phase hybrid inverters, tier-1 LiFePO4 rack batteries & solar arrays.',
    tag: 'Continuous 24/7 Autonomy',
    ctaText: 'Explore Clean Energy',
    category: 'Renewable Energy',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'from-amber-950/90 via-slate-900/80 to-transparent'
  },
  {
    id: 4,
    title: 'Industrial PoE Switching & Microwave Telecom',
    subtitle: 'Cisco & Ubiquiti managed switches, long-range 1Gbps backhaul dishes & Cat6A burial cables.',
    tag: 'Carrier-Grade Connectivity',
    ctaText: 'Explore Networking',
    category: 'Networking & Connectivity',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'from-indigo-950/90 via-slate-900/80 to-transparent'
  }
];

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] overflow-hidden bg-gray-900 select-none">
      {/* Background Image with smooth transition */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url(${slide.image})` }}
      />

      {/* Dark gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor}`} />

      {/* Amazon Bottom Gradient Fade into content cards */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#eaeded] via-[#eaeded]/60 to-transparent pointer-events-none" />

      {/* Slide Content */}
      <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center px-6 md:px-12 pb-24 z-10">
        <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-300 w-fit mb-3 border border-amber-500/30">
          <Shield className="w-3.5 h-3.5" />
          <span>{slide.tag}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white max-w-2xl leading-tight drop-shadow-md">
          {slide.title}
        </h1>

        <p className="mt-2 text-sm sm:text-base text-gray-200 max-w-xl line-clamp-2 drop-shadow-sm">
          {slide.subtitle}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => onExploreCategory(slide.category)}
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold text-sm px-6 py-2.5 rounded-full shadow-md transition-all hover:scale-102 flex items-center gap-2"
          >
            <span>{slide.ctaText}</span>
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-2 top-1/3 -translate-y-1/2 p-2.5 rounded-xs bg-black/20 hover:bg-black/50 text-white transition-colors z-20 focus:outline-none"
        title="Previous banner"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
        className="absolute right-2 top-1/3 -translate-y-1/2 p-2.5 rounded-xs bg-black/20 hover:bg-black/50 text-white transition-colors z-20 focus:outline-none"
        title="Next banner"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-[#febd69]' : 'w-2 bg-white/60 hover:bg-white'}`}
          />
        ))}
      </div>
    </div>
  );
};
