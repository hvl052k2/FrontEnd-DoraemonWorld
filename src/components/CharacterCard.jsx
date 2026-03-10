import { Volume2, VolumeOff, VolumeX } from 'lucide-react'; // Import icon từ thư viện

const CharacterCard = ({ name, image, description, onPlay, isActive }) => {
    return (
        <div className={`relative bg-white rounded-[15px] overflow-hidden transition-all duration-500 text-center group
            ${isActive
                ? 'ring-4 ring-[#0091ea] shadow-[0_0_20px_rgba(0,145,234,0.5)] scale-105'
                : 'shadow-lg hover:-translate-y-2'
            }`}
        >
            {/* Nút Loa */}
            <button
                onClick={onPlay}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 cursor-pointer shadow-md
                    ${isActive ? 'bg-red-500 animate-pulse' : 'bg-[#0091ea] hover:bg-[#0077c2]'}
                `}
            >
                {isActive ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <img
                src={image}
                alt={name}
                className={`w-full h-50 object-contain bg-[#f8f9fa] p-2.5 transition-opacity 
                    ${isActive ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}`}
            />

            <div className="p-4">
                <h3 className={`text-xl font-bold mb-2 transition-colors ${isActive ? 'text-[#0091ea]' : 'text-[#0077c2]'}`}>
                    {name}
                </h3>
                <p className="text-[0.9rem] leading-relaxed text-gray-600">
                    {description}
                </p>
            </div>

            {/* Hiệu ứng tia sáng chạy quanh viền (Tùy chọn) */}
            {isActive && (
                <div className="absolute inset-0 pointer-events-none border-4 border-[#0091ea] rounded-[15px] animate-ping opacity-20"></div>
            )}
        </div>
    );
};

export default CharacterCard;