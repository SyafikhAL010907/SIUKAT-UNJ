import React from 'react';

const UktLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="relative flex flex-col items-center">
                
                {/* Loader Animation */}
                <div className="relative w-24 h-24">
                    {/* Ring Luar */}
                    <div className="absolute inset-0 border-4 border-dashed border-green-600 rounded-full animate-spin-slow"></div>
                    
                    {/* Ring Dalam dengan Pulse */}
                    <div className="absolute inset-2 border-4 border-yellow-400 rounded-full animate-pulse"></div>
                    
                    {/* Icon Tengah */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <i className="fas fa-graduation-cap text-3xl text-green-700 animate-bounce"></i>
                    </div>
                </div>

                {/* Text Content */}
                <div className="mt-8 text-center">
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                        Mohon Bersabar
                    </h3>
                    <p className="text-gray-500 font-medium italic animate-pulse">
                        Sistem sedang menyiapkan data Anda...
                    </p>
                    
                    {/* Emoji Section dengan Hover Effect */}
                    <div className="mt-4 flex justify-center gap-3 text-2xl">
                        <span className="hover:scale-125 transition-transform duration-300 inline-block" role="img" aria-label="greeting">🙏</span>
                        <span className="hover:scale-125 transition-transform duration-300 inline-block" role="img" aria-label="smile">😊</span>
                        <span className="hover:scale-125 transition-transform duration-300 inline-block" role="img" aria-label="greeting">🙏</span>
                    </div>
                </div>

                {/* Progress Bar Sederhana (Opsional/Dekorasi) */}
                <div className="mt-6 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-600 via-yellow-400 to-green-600 w-full animate-shimmer"></div>
                </div>
            </div>

            {/* Tambahkan Style Custom untuk Animasi yang tidak ada di Tailwind default */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
            `}} />
        </div>
    );
};

export default UktLoader;