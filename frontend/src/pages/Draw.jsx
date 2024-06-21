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
            <h1>Draw page for difficult-chooser</h1>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Style:</legend>
                    {['中式', '西式', '日式', '韓式', '台式', '其他'].map(style => (
                        <label key={style}>
                            <input
                                type="checkbox"
                                name="style"
                                value={style}
                                onChange={e => handleCheckboxChange(e, "style")}
                                checked={filters.style.includes(style)}
                            />
                            {style}
                        </label>
                    ))}
                </fieldset>

                <fieldset>
                    <legend>Type:</legend>
                    {['飯', '麵', '麵包', '其他'].map(type => (
                        <label key={type}>
                            <input
                                type="checkbox"
                                name="type"
                                value={type}
                                onChange={e => handleCheckboxChange(e, "type")}
                                checked={filters.type.includes(type)}
                            />
                            {type}
                        </label>
                    ))}
                </fieldset>

                <fieldset>
                    <legend>Price:</legend>
                    {['便宜', '中等', '貴'].map(price => (
                        <label key={price}>
                            <input
                                type="checkbox"
                                name="price"
                                value={price}
                                onChange={e => handleCheckboxChange(e, "price")}
                                checked={filters.price.includes(price)}
                            />
                            {price}
                        </label>
                    ))}
                </fieldset>

                <fieldset>
                    <legend>Arrival Time:</legend>
                    {['馬上', '5分', '10分', '20分', '30分以上'].map(time => (
                        <label key={time}>
                            <input
                                type="checkbox"
                                name="arr_time"
                                value={time}
                                onChange={e => handleCheckboxChange(e, "arr_time")}
                                checked={filters.arr_time.includes(time)}
                            />
                            {time}
                        </label>
                    ))}
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