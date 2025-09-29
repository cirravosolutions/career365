import React from 'react';

interface MarqueeProps {
  text: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text }) => {
  return (
    <div className="relative flex overflow-x-hidden bg-primary/90 dark:bg-primary/50 text-white py-2.5 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="absolute top-0 left-0 bottom-0 flex items-center pl-3 z-10">
         <span className="animate-blink bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white/50">NEW</span>
      </div>
      <div className="animate-marquee whitespace-nowrap flex items-center pl-16">
         <span className="font-semibold mx-8 text-sm">{text}</span>
         <span className="mx-4 text-amber-300">•</span>
         <span className="font-semibold mx-8 text-sm">{text}</span>
         <span className="mx-4 text-amber-300">•</span>
         <span className="font-semibold mx-8 text-sm">{text}</span>
         <span className="mx-4 text-amber-300">•</span>
         <span className="font-semibold mx-8 text-sm">{text}</span>
         <span className="mx-4 text-amber-300">•</span>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          min-width: 200%; /* Ensure content is wide enough for seamless loop */
        }
         @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-blink {
          animation: blink 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Marquee;