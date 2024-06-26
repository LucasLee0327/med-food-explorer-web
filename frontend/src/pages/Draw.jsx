import React, { Component } from "react";
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import services from "../services";

function Draw() {
    const [filters, setFilters] = useState({
        style: [],
        type: [],
        price: [],
        arr_time: []
    });
    const [numRestaurants, setNumRestaurants] = useState(1);
    const [drawnRestaurants, setDrawnRestaurants] = useState([]);

    const handleCheckboxChange = (event, category) => {
        const { value, checked } = event.target;
        if (checked) {
            setFilters(prevFilters => ({
                ...prevFilters,
                [category]: [...prevFilters[category], value]
            }));
        } else {
            setFilters(prevFilters => ({
                ...prevFilters,
                [category]: prevFilters[category].filter(item => item !== value)
            }));
        }
    };

    const handleNumRestaurantsChange = (event) => {
        setNumRestaurants(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const queryString = new URLSearchParams(
                Object.entries(filters).reduce((acc, [key, values]) => {
                    if (values.length) {
                        values.forEach(value => acc.append(key, value));
                    } else {
                        acc.append(key, '');
                    }
                    return acc;
                }, new URLSearchParams())
            );
            queryString.append('numRestaurants', numRestaurants);

            const result = await services.user.draw(queryString.toString());
            setDrawnRestaurants(result);
        } catch (error) {
            console.error('Error drawing restaurants:', error);
        }
    };

    return (
        <>
            <div className="flex h-screen">
                {/* 左側篩選表單區塊 */}
                <div className="w-1/3 p-4 border-r border-gray-300 bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">篩選條件</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset className="border p-4 rounded-lg">
                        <legend className="text-lg font-bold mb-2">料理形式:</legend>
                        <div className="grid grid-cols-3 gap-2">
                            {['中式', '西式', '日式', '韓式', '台式', '其他'].map(style => (
                            <label key={style} className="block mb-2">
                                <input
                                type="checkbox"
                                name="style"
                                value={style}
                                onChange={e => handleCheckboxChange(e, "style")}
                                checked={filters.style.includes(style)}
                                className="mr-2"
                                />
                                {style}
                            </label>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="border p-4 rounded-lg">
                        <legend className="text-lg font-bold mb-2">料理類別:</legend>
                        <div className="grid grid-cols-3 gap-2">
                            {['飯', '麵', '麵包', '其他'].map(type => (
                            <label key={type} className="block mb-2">
                                <input
                                type="checkbox"
                                name="type"
                                value={type}
                                onChange={e => handleCheckboxChange(e, "type")}
                                checked={filters.type.includes(type)}
                                className="mr-2"
                                />
                                {type}
                            </label>
                            ))}
                        </div>
                        
                    </fieldset>

                    <fieldset className="border p-4 rounded-lg">
                        <legend className="text-lg font-bold mb-2">價格:</legend>
                        <div className="grid grid-cols-3 gap-2">
                            {['便宜', '中等', '貴'].map(price => (
                            <label key={price} className="block mb-2">
                                <input
                                type="checkbox"
                                name="price"
                                value={price}
                                onChange={e => handleCheckboxChange(e, "price")}
                                checked={filters.price.includes(price)}
                                className="mr-2"
                                />
                                {price}
                            </label>
                            ))}
                        </div>
                        
                    </fieldset>

                    <fieldset className="border p-4 rounded-lg">
                        <legend className="text-lg font-bold mb-2">抵達所需時間:</legend>
                        <div className="grid grid-cols-3 gap-2">
                            {['馬上', '5分', '10分', '20分', '30分以上'].map(time => (
                            <label key={time} className="block mb-2">
                                <input
                                type="checkbox"
                                name="arr_time"
                                value={time}
                                onChange={e => handleCheckboxChange(e, "arr_time")}
                                checked={filters.arr_time.includes(time)}
                                className="mr-2"
                                />
                                {time}
                            </label>
                            ))}
                        </div>
                        
                    </fieldset>

                    <div className="border p-4 rounded-lg">
                        <label className="block mb-2 font-bold">
                        想抽幾個餐廳?
                        <input
                            type="number"
                            value={numRestaurants}
                            onChange={handleNumRestaurantsChange}
                            min="1"
                            className="ml-2 p-1 border rounded"
                        />
                        </label>
                    </div>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">抽獎</button>
                    </form>
                </div>

                {/* 右側抽獎結果區塊 */}
                <div className="w-2/3 p-4 overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-4">抽獎結果</h1>
                    <div>
                    {drawnRestaurants.length > 0 ? (
                        drawnRestaurants.map(restaurant => (
                        <div key={restaurant.id} className="mb-4 p-4 bg-white shadow rounded">
                            <h2 className="text-xl font-bold">{restaurant.name}</h2>
                            <p>料理形式: {restaurant.style}</p>
                            <p>料理類別: {restaurant.type}</p>
                            <p>價格: {restaurant.price}</p>
                            <p>抵達所需時間: {restaurant.arr_time}</p>
                            <p>地址: {restaurant.address}</p>
                        </div>
                        ))
                    ) : (
                        <p>No restaurants drawn.</p>
                    )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Draw;