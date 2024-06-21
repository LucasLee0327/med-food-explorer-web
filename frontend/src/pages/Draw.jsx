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
                    values.forEach(value => acc.append(key, value));
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
            <h1>Draw page for difficult-chooser</h1>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Style:</legend>
                    <label>
                        <input type="checkbox" name="style" value="中式" onChange={e => handleCheckboxChange(e, "style")} checked={filters.style.includes("中式")} />
                        中式
                    </label>
                    <label>
                        <input type="checkbox" name="style" value="西式" onChange={e => handleCheckboxChange(e, "style")} checked={filters.style.includes("西式")} />
                        西式
                    </label>
                    <label>
                        <input type="checkbox" name="style" value="日式" onChange={e => handleCheckboxChange(e, "style")} checked={filters.style.includes("日式")} />
                        日式
                    </label>
                    <label>
                        <input type="checkbox" name="style" value="韓式" onChange={e => handleCheckboxChange(e, "style")} checked={filters.style.includes("韓式")} />
                        韓式
                    </label>
                    <label>
                        <input type="checkbox" name="style" value="台式" onChange={e => handleCheckboxChange(e, "style")} checked={filters.style.includes("台式")} />
                        台式
                    </label>
                    <label>
                        <input type="checkbox" name="style" value="其他" onChange={e => handleCheckboxChange(e, "style")} checked={filters.style.includes("其他")} />
                        其他
                    </label>
                </fieldset>

                <fieldset>
                    <legend>Type:</legend>
                    <label>
                        <input type="checkbox" name="type" value="飯" onChange={e => handleCheckboxChange(e, "type")} checked={filters.type.includes("飯")} />
                        飯
                    </label>
                    <label>
                        <input type="checkbox" name="type" value="麵" onChange={e => handleCheckboxChange(e, "type")} checked={filters.type.includes("麵")} />
                        麵
                    </label>
                    <label>
                        <input type="checkbox" name="type" value="麵包" onChange={e => handleCheckboxChange(e, "type")} checked={filters.type.includes("麵包")} />
                        麵包
                    </label>
                    <label>
                        <input type="checkbox" name="type" value="其他" onChange={e => handleCheckboxChange(e, "type")} checked={filters.type.includes("其他")} />
                        其他
                    </label>
                </fieldset>

                <fieldset>
                    <legend>Price:</legend>
                    <label>
                        <input type="checkbox" name="price" value="便宜" onChange={e => handleCheckboxChange(e, "price")} checked={filters.price.includes("便宜")} />
                        便宜
                    </label>
                    <label>
                        <input type="checkbox" name="price" value="中等" onChange={e => handleCheckboxChange(e, "price")} checked={filters.price.includes("中等")} />
                        中等
                    </label>
                    <label>
                        <input type="checkbox" name="price" value="貴" onChange={e => handleCheckboxChange(e, "price")} checked={filters.price.includes("貴")} />
                        貴
                    </label>
                </fieldset>

                <fieldset>
                    <legend>Arrival Time:</legend>
                    <label>
                        <input type="checkbox" name="arr_time" value="馬上" onChange={e => handleCheckboxChange(e, "arr_time")} checked={filters.arr_time.includes("馬上")} />
                        馬上
                    </label>
                    <label>
                        <input type="checkbox" name="arr_time" value="5分" onChange={e => handleCheckboxChange(e, "arr_time")} checked={filters.arr_time.includes("5分")} />
                        5分
                    </label>
                    <label>
                        <input type="checkbox" name="arr_time" value="10分" onChange={e => handleCheckboxChange(e, "arr_time")} checked={filters.arr_time.includes("10分")} />
                        10分
                    </label>
                    <label>
                        <input type="checkbox" name="arr_time" value="20分" onChange={e => handleCheckboxChange(e, "arr_time")} checked={filters.arr_time.includes("20分")} />
                        20分
                    </label>
                    <label>
                        <input type="checkbox" name="arr_time" value="30分以上" onChange={e => handleCheckboxChange(e, "arr_time")} checked={filters.arr_time.includes("30分以上")} />
                        30分以上
                    </label>
                </fieldset>

                <label>
                    Number of restaurants to draw:
                    <input type="number" value={numRestaurants} onChange={handleNumRestaurantsChange} min="1" />
                </label>
                
                <button type="submit">Draw Restaurants</button>
            </form>
            <div>
                {drawnRestaurants.length > 0 ? (
                    drawnRestaurants.map(restaurant => (
                        <div key={restaurant.id}>
                            <h2>{restaurant.name}</h2>
                            <p>Style: {restaurant.style}</p>
                            <p>Type: {restaurant.type}</p>
                            <p>Price: {restaurant.price}</p>
                            <p>Arrival Time: {restaurant.arr_time}</p>
                        </div>
                    ))
                ) : (
                    <p>No restaurants drawn.</p>
                )}
            </div>
        </>
    );
}

export default Draw;