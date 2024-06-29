import React, { useState, useEffect } from 'react';
import services from '../services';

function AdminDelete() {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        async function fetchRestaurants() {
            try {
                const data = await services.user.getRestaurants();
                setRestaurants(data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        }
        fetchRestaurants();
    }, []);

    const handleDeleteClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await services.user.deleteOne(selectedRestaurant.id);
            setRestaurants(restaurants.filter(r => r.id !== selectedRestaurant.id));
            setShowConfirm(false);
            setSelectedRestaurant(null);
        } catch (error) {
            console.error('Error deleting restaurant:', error);
            alert('Error deleting restaurant. Please try again.');
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">刪除餐廳</h2>
            <div className="grid grid-cols-1 gap-4">
                {restaurants.length > 0 ? (
                    restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="p-4 border rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                            <p>料理形式: {restaurant.style}</p>
                            <p>料理類別: {restaurant.type}</p>
                            <p>價格: {restaurant.price}</p>
                            <p>抵達所需時間: {restaurant.arr_time}</p>
                            <p>地址: {restaurant.address}</p>
                            <button
                                onClick={() => handleDeleteClick(restaurant)}
                                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                刪除
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">沒有餐廳可刪除。</p>
                )}
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">確認刪除</h2>
                        <p className="mb-4">你確定要刪除 {selectedRestaurant.name} 嗎？</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                刪除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminDelete;
