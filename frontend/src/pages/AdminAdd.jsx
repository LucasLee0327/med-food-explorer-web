import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../services';

function AdminAdd() {
    const [newRestaurant, setNewRestaurant] = useState({
        name: '',
        style: '中式',
        type: '飯',
        price: '便宜',
        arr_time: '馬上',
        address: ''
    });
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);

    useEffect(() => {
        async function fetchCandidates() {
            try {
                const data = await services.user.getCandidates();
                setCandidates(data);
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        }
        fetchCandidates();
    }, []);

    const handleCandidateClick = (candidate) => {
        setNewRestaurant({
            name: candidate.name,
            style: candidate.style,
            type: candidate.type,
            price: candidate.price,
            arr_time: candidate.arr_time,
            address: candidate.address
        });
        setSelectedCandidateId(candidate.id);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRestaurant((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await services.user.createOne(newRestaurant);
            alert('Update new restaurant succeeded!');
            if (selectedCandidateId) {
                await services.user.deleteCandidate(selectedCandidateId); // Remove candidate
                setCandidates(candidates.filter((c) => c.id !== selectedCandidateId)); // Update candidates list
                setSelectedCandidateId(null); // Reset selected candidate ID
            }
        } catch (error) {
            console.error('Error updating new restaurant:', error);
            alert('Error updating new restaurant. Please try again.');
        }
    };

    const handleRemoveCandidate = async (candidateId) => {
        try {
            await services.user.deleteCandidate(candidateId);
            setCandidates(candidates.filter((c) => c.id !== candidateId));
            alert('Remove candidate succeeded!');
        } catch (error) {
            console.error('Error removing candidate:', error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
            <div className="md:w-1/2 bg-gray-100 p-4 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">新增餐廳</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">
                            店名:
                            <input
                                type="text"
                                name="name"
                                value={newRestaurant.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">
                            料理形式:
                            <select
                                name="style"
                                value={newRestaurant.style}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="中式">中式</option>
                                <option value="西式">西式</option>
                                <option value="日式">日式</option>
                                <option value="韓式">韓式</option>
                                <option value="台式">台式</option>
                                <option value="其他">其他</option>
                            </select>
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">
                            料理類別:
                            <select
                                name="type"
                                value={newRestaurant.type}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="飯">飯</option>
                                <option value="麵">麵</option>
                                <option value="速食">速食</option>
                                <option value="素食">素食</option>
                                <option value="火鍋">火鍋</option>
                                <option value="拉麵">拉麵</option>
                                <option value="簡餐">簡餐</option>
                                <option value="合菜">合菜</option>
                                <option value="其他">其他</option>
                            </select>
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">
                            價格:
                            <select
                                name="price"
                                value={newRestaurant.price}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="便宜">便宜</option>
                                <option value="中等">中等</option>
                                <option value="貴">貴</option>
                            </select>
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">
                            抵達所需時間:
                            <select
                                name="arr_time"
                                value={newRestaurant.arr_time}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="馬上">馬上</option>
                                <option value="5分">5分</option>
                                <option value="10分">10分</option>
                                <option value="20分">20分</option>
                                <option value="30以上">30以上</option>
                            </select>
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">
                            地址:
                            <input
                                type="text"
                                name="address"
                                value={newRestaurant.address}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </label>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        新增餐廳
                    </button>
                </form>
            </div>
            <div className="md:w-1/2 bg-gray-100 p-4 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">投稿餐廳</h2>
                {candidates.length > 0 ? (
                    candidates.map((candidate) => (
                        <div key={candidate.id} className="mb-4 p-4 bg-white rounded shadow">
                            <h3 className="text-lg font-bold">{candidate.name}</h3>
                            <p>料理形式: {candidate.style}</p>
                            <p>料理類別: {candidate.type}</p>
                            <p>價格: {candidate.price}</p>
                            <p>抵達所需時間: {candidate.arr_time}</p>
                            <p>地址: {candidate.address}</p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleCandidateClick(candidate)}
                                    className="bg-green-600 text-white p-2 rounded"
                                >
                                    準備上傳
                                </button>
                                <button
                                    onClick={() => handleRemoveCandidate(candidate.id)}
                                    className="bg-red-500 text-white p-2 rounded"
                                >
                                    移除
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xl font-bold">No candidates available.</p>
                )}
            </div>
        </div>
    );
}

export default AdminAdd;
