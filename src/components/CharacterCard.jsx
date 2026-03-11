import { Volume2, VolumeX, Trash2, Edit3 } from 'lucide-react'; 

const CharacterCard = ({ name, image, description, onPlay, isActive, onDelete, onEdit }) => {
    return (
        <div className={`relative bg-white rounded-[15px] overflow-hidden transition-all duration-500 text-center group
            ${isActive
                ? 'ring-4 ring-[#0091ea] shadow-[0_0_20px_rgba(0,145,234,0.5)] scale-105'
                : 'shadow-lg hover:-translate-y-2'
            }`}
        >
            {/* NHÓM NÚT ĐIỀU KHIỂN GÓC TRÁI (Ẩn mặc định, hiện khi hover) */}
            <div className="absolute top-3 left-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Nút Sửa */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ cha
                        onEdit();
                    }}
                    className="p-2 bg-amber-400 hover:bg-amber-500 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                    title="Chỉnh sửa nhân vật"
                >
                    <Edit3 size={18} />
                </button>

                {/* Nút Xóa */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                    title="Xóa nhân vật"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Nút Loa (Góc phải - Giữ nguyên logic cũ) */}
            <button
                onClick={onPlay}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 cursor-pointer shadow-md text-white
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
                <p className="text-[0.9rem] leading-relaxed text-gray-600 line-clamp-3">
                    {description}
                </p>
            </div>

            {isActive && (
                <div className="absolute inset-0 pointer-events-none border-4 border-[#0091ea] rounded-[15px] animate-ping opacity-20"></div>
            )}
        </div>
    );
};

export default CharacterCard;