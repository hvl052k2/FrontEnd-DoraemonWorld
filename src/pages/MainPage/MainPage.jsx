import { useRef, useState, useEffect } from "react";
import CharacterCard from "../../components/CharacterCard";
import { Button, message, Tag, Modal, Form, Input, Upload } from 'antd'; // Thêm Tag cho sinh động
import { LogOut, Sparkles, Heart, PlusCircle, UploadCloud, Music, Image as ImageIcon } from 'lucide-react';
import { getCharacters } from "../../services/handleAPIData";
import axios from 'axios';

// Khai báo địa chỉ Backend của bạn
const BACKEND_URL = "http://localhost/BackEndDoraemonWorld";

const MainPage = ({ onLogout }) => {
    const audioRef = useRef(null);
    const [activeId, setActiveId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingCharacter, setEditingCharacter] = useState(null);

    // State cho Modal thêm nhân vật
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    // Tìm kiếm nhân vật
    const filteredCharacters = characters.filter(char =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Hàm khi bấm nút Sửa trên thẻ nhân vật
    const handleEditClick = (char) => {
        setEditingCharacter(char); // Lưu thông tin nhân vật đang sửa
        setIsModalOpen(true);
        // Đổ dữ liệu cũ vào form (Trừ các trường file upload)
        form.setFieldsValue({
            name: char.name,
            description: char.description,
        });
    };

    // Hàm khi bấm nút "Thêm mới"
    const handleAddClick = () => {
        setEditingCharacter(null); // Reset về null
        form.resetFields();
        setIsModalOpen(true);
    };

    // Hàm gửi dữ liệu (Gộp chung logic Add & Update)
    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);

        // Nếu đang sửa, gửi thêm ID
        if (editingCharacter) {
            formData.append('id', editingCharacter.id);
        }

        if (values.image?.fileList?.[0]?.originFileObj) {
            formData.append('image', values.image.fileList[0].originFileObj);
        }
        if (values.audio?.fileList?.[0]?.originFileObj) {
            formData.append('audio', values.audio.fileList[0].originFileObj);
        }

        try {
            // Chọn file PHP tương ứng
            const url = editingCharacter
                ? `${BACKEND_URL}/update_character.php`
                : `${BACKEND_URL}/add_character.php`;

            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                message.success(editingCharacter ? "Cập nhật thành công!" : "Thêm thành công!");
                setIsModalOpen(false);
                form.resetFields();
                fetchCharacters();
            }
        } catch (error) {
            message.error("Lỗi kết nối server!");
        }
    };

    // Hàm tải dữ liệu nhân vật
    const fetchCharacters = async () => {
        try {
            const data = await getCharacters.getAll();
            setCharacters(data);
        } catch (error) {
            message.error("Không thể kết nối với túi thần kỳ (Backend)!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    useEffect(() => {
        const session = localStorage.getItem('isLoggedIn');
        if (session === 'true') setIsLoggedIn(true);
    }, []);

    // Hàm xóa nhân vật
    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn chia tay người bạn này?',
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Xác nhận xóa',
            okType: 'danger',
            onOk: async () => {
                try {
                    const response = await axios.post(`${BACKEND_URL}/delete_character.php`, { id });
                    if (response.data.success) {
                        message.success("Đã tạm biệt nhân vật!");
                        fetchCharacters();
                    }
                } catch (error) { message.error("Lỗi khi xóa!"); }
            }
        });
    };

    const handlePlaySound = (id, src) => {
        if (!src) {
            message.error('Nhân vật này chưa có âm thanh!');
            return;
        };
        if (activeId === id && audioRef.current) {
            audioRef.current.pause();
            setActiveId(null);
            return;
        }
        if (audioRef.current) audioRef.current.pause();
        setActiveId(id);
        audioRef.current = new Audio(src);
        audioRef.current.play();
        audioRef.current.onended = () => setActiveId(null);
    };

    // Hàm xử lý gửi dữ liệu thêm nhân vật
    const handleAddCharacter = async (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);

        // Lấy file từ Ant Design Upload
        if (values.image?.fileList?.[0]?.originFileObj) {
            formData.append('image', values.image.fileList[0].originFileObj);
        }
        if (values.audio?.fileList?.[0]?.originFileObj) {
            formData.append('audio', values.audio.fileList[0].originFileObj);
        }

        try {
            // Gọi API đến file php trên localhost
            const response = await axios.post(`${BACKEND_URL}/add_character.php`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                message.success("Bảo bối mới đã được thêm vào túi!");
                setIsModalOpen(false);
                form.resetFields();
                fetchCharacters(); // Tải lại danh sách nhân vật
            } else {
                message.error(response.data.message || "Lỗi khi lưu nhân vật");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            message.error("Không thể kết nối tới máy chủ Localhost!");
        }
    };

    // Hàm kiểm tra file âm thanh (MP3 & < 60s)
    const validateAudio = (file) => {
        return new Promise((resolve, reject) => {
            const isMp3 = file.type === 'audio/mpeg';
            if (!isMp3) {
                message.error('Chỉ chấp nhận file MP3!');
                return reject(false);
            }

            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            audio.onloadedmetadata = () => {
                URL.revokeObjectURL(audio.src);
                if (audio.duration > 60) {
                    message.error('Âm thanh không được quá 60 giây!');
                    reject(false);
                } else {
                    resolve(true);
                }
            };
        });
    };

    // Hàm xử lý URL thông minh
    const formatUrl = (path) => {
        if (!path) return "";
        // Nếu path bắt đầu bằng /uploads (file mới từ PHP) -> Nối với BACKEND_URL
        if (path.startsWith('/uploads')) {
            return `${BACKEND_URL}${path}`;
        }
        // Nếu path là /images hoặc /sounds (file cũ trong public React) -> Để nguyên
        return path;
    };

    return (
        <div className="min-h-screen bg-[#e3f2fd] font-sans relative overflow-x-hidden">


            {/* Header: Thiết kế dạng cong mềm mại */}
            <header className="bg-[#0091ea] text-white py-8 px-6 md:px-20 flex justify-between items-center shadow-[0_4px_20px_rgba(0,145,234,0.4)] rounded-b-[40px] relative z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-full shadow-inner">
                        <Sparkles className="text-[#ffd600]" size={28} fill="#ffd600" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-wide uppercase">
                            Thế Giới <span className="text-[#ffd600]">Doraemon</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                            <p className="text-xs md:text-sm font-medium opacity-90">Sẵn sàng cho chuyến phiêu lưu!</p>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={onLogout}
                    className="h-11 px-6 rounded-full border-none bg-[#ff5252] text-white font-bold shadow-[0_4px_15px_rgba(255,82,82,0.4)] hover:bg-[#ff1744] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden md:inline font-black tracking-wider">ĐĂNG XUẤT</span>
                </Button>
            </header>

            {/* Main Content */}
            <main className="max-w-275 mx-auto my-12 px-6 relative z-10">
                <div className="text-center mb-10">
                    <Tag color="blue" className="rounded-full px-4 py-1 text-sm font-semibold border-none bg-white text-[#0091ea] shadow-sm">
                        NHÂN VẬT CHÍNH
                    </Tag>
                    <h2 className="text-gray-500 mt-4 font-medium italic">"Bấm vào nút loa để nghe giọng nói nhân vật"</h2>
                </div>
                {/* Thêm ô tìm kiếm bên dưới phần Tag */}
                <div className="max-w-md mx-auto mb-8">
                    <Input
                        placeholder="Tìm tên nhân vật (ví dụ: Doraemon...)"
                        prefix={<Sparkles size={16} className="text-[#0091ea]" />}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-full h-12 shadow-sm"
                        allowClear
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Thẻ thêm nhân vật */}
                    <div
                        onClick={handleAddClick} // Kích hoạt Modal khi click vào thẻ
                        className="relative bg-white/50 rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer group hover:bg-white hover:shadow-[0_10px_30px_rgba(0,145,234,0.2)] border-2 border-transparent flex items-center justify-center min-h-80"
                    >
                        {/* Viền nét đứt bên trong */}
                        <div className="absolute inset-4 border-2 border-dashed border-[#0091ea]/30 rounded-[18px] group-hover:border-[#0091ea]/60 transition-colors flex flex-col items-center justify-center gap-4">

                            {/* Vòng tròn chứa dấu cộng */}
                            <div className="w-16 h-16 bg-[#0091ea]/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0091ea] transition-all duration-300">
                                <PlusCircle
                                    size={40}
                                    className="text-[#0091ea] group-hover:text-white transition-colors"
                                    strokeWidth={1.5}
                                />
                            </div>

                            <div className="text-center">
                                <span className="block text-[#0091ea] font-black text-lg tracking-wider">THÊM NHÂN VẬT MỚI</span>
                                <span className="text-gray-400 text-sm font-medium">Mở túi thần kỳ...</span>
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-center mt-20">Đang mở túi thần kỳ...</div>
                    ) : (
                        filteredCharacters.map((char) => {
                            return (
                                <CharacterCard
                                    key={char.id}
                                    name={char.name}
                                    image={formatUrl(char.image)}
                                    description={char.description}
                                    isActive={activeId === char.id}
                                    onPlay={() => handlePlaySound(char.id, formatUrl(char.audio_src))}
                                    onDelete={() => handleDelete(char.id)}
                                    onEdit={() => handleEditClick(char)}
                                />
                            );
                        })
                    )}

                </div>
            </main>

            <Modal
                title={editingCharacter ? "Chỉnh sửa nhân vật" : "Thêm bạn mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnHidden // Rất quan trọng để reset form khi đóng
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="name" label="Tên nhân vật" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="image" label={editingCharacter?" Hình ảnh (Để trống nếu giữ nguyên)": "Hình ảnh (bắt buộc)"} rules={[{required: true}]}>
                        <Upload.Dragger listType="picture" maxCount={1} beforeUpload={() => false}>
                            <p className="ant-upload-drag-icon"><ImageIcon size={24} /></p>
                            <p className="text-xs">Kéo thả ảnh mới vào đây</p>
                        </Upload.Dragger>
                    </Form.Item>

                    <Form.Item name="audio" label={editingCharacter?" Âm thanh (Để trống nếu giữ nguyên)": "Âm thanh (không bắt buộc)"}>
                        <Upload.Dragger maxCount={1} beforeUpload={(file) => validateAudio(file)} accept=".mp3">
                            <p className="ant-upload-drag-icon"><Music size={24} /></p>
                            <p className="text-xs">Kéo thả file MP3 mới</p>
                        </Upload.Dragger>
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block className="h-12 bg-[#0091ea]">
                        {editingCharacter ? "Lưu thay đổi" : "Lưu vào túi thần kỳ"}
                    </Button>
                </Form>
            </Modal>

            {/* Footer */}
            <footer className="text-center py-12 text-[#0091ea] font-medium">
                <div className="flex justify-center items-center gap-2 opacity-60">
                    <span>&copy; 2026 Fanpage Doraemon</span>
                    <Heart size={14} fill="#ff5252" className="text-[#ff5252]" />
                    <span>Made for Hà Văn Linh</span>
                </div>
                <div className="mt-2 w-20 h-1 bg-[#ffd600] mx-auto rounded-full"></div>
            </footer>
        </div>
    );
}

export default MainPage;