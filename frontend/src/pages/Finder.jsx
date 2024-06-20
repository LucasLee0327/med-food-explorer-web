import React, { Component } from "react";
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import services from "../services";

function Finder() {
    const [foods, setFoods] = useState([]);
    const [filters, setFilters] = useState({
        style: [],
        type: [],
        price: [],
        arr_time: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const fetchedFoods = await services.user.getAll(filters);
            setFoods(fetchedFoods);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    const handleFilterChange = (event) => {
        const { name, options } = event.target;
        const selectedOptions = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);

        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: selectedOptions
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const filteredFoods = await services.user.getAll(filters);
            setFoods(filteredFoods);
        } catch (error) {
            console.error('Error filtering restaurants:', error);
        }
    };

    return (
        <>
            <h1>Finder Page</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Style:
                    <select name="style" multiple value={filters.style} onChange={handleFilterChange}>
                        <option value="中式">中式</option>
                        <option value="西式">西式</option>
                        <option value="日式">日式</option>
                        <option value="韓式">韓式</option>
                        <option value="台式">台式</option>
                        <option value="其他">其他</option>
                    </select>
                </label>
                <label>
                    Type:
                    <select name="type" multiple value={filters.type} onChange={handleFilterChange}>
                        <option value="飯">飯</option>
                        <option value="麵">麵</option>
                        <option value="麵包">麵包</option>
                        <option value="其他">其他</option>
                    </select>
                </label>
                <label>
                    Price:
                    <select name="price" multiple value={filters.price} onChange={handleFilterChange}>
                        <option value="便宜">便宜</option>
                        <option value="中等">中等</option>
                        <option value="貴">貴</option>
                    </select>
                </label>
                <label>
                    Arrival Time:
                    <select name="arr_time" multiple value={filters.arr_time} onChange={handleFilterChange}>
                        <option value="馬上">馬上</option>
                        <option value="5分">5分</option>
                        <option value="10分">10分</option>
                        <option value="20分">20分</option>
                        <option value="30以上">30以上</option>
                    </select>
                </label>
                <button type="submit">Apply Filters</button>
            </form>
            <div>
                {foods.length > 0 ? (
                    foods.map(food => (
                        <div key={food.id}>
                            <h2>{food.name}</h2>
                            <p>Style: {food.style}</p>
                            <p>Type: {food.type}</p>
                            <p>Price: {food.price}</p>
                            <p>Arrival Time: {food.arr_time}</p>
                        </div>
                    ))
                ) : (
                    <p>No food items available.</p>
                )}
            </div>
        </>
    );
}

export default Finder;
