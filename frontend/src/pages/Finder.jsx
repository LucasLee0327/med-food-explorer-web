import React, { Component } from "react";
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import services from "../services";

const containerStyle = {
    width: '100%',
    height: '600px'
};
const libraries = ['places'];

function Finder() {
    const [foods, setFoods] = useState([]);
    const [filters, setFilters] = useState({
        style: [],
        type: [],
        price: [],
        arr_time: []
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const apiKey = import.meta.env.VITE_GOOGLEMAP_API_KEY;
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        id: 'google-map-script'
    });

    useEffect(() => {
        // Fetch initial data
        async function fetchData() {
            try {
                const food = await services.user.getAll("");
                setFoods(food);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        }
        fetchData();
    }, []);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const queryString = new URLSearchParams(
                Object.entries(filters).reduce((acc, [key, values]) => {
                    values.forEach(value => acc.append(key, value));
                    return acc;
                }, new URLSearchParams())
            ).toString();

            const food = await services.user.getAll(queryString);
            setFoods(food);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1>Finder Page</h1>
            <button onClick={toggleFilterMenu}>
                {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
            {isFilterOpen && (
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
                        {['馬上', '5分', '10分', '20分', '30分以上'].map(arr_time => (
                            <label key={arr_time}>
                                <input
                                    type="checkbox"
                                    name="arr_time"
                                    value={arr_time}
                                    onChange={e => handleCheckboxChange(e, "arr_time")}
                                    checked={filters.arr_time.includes(arr_time)}
                                />
                                {arr_time}
                            </label>
                        ))}
                    </fieldset>

                    <button type="submit">Apply Filters</button>
                </form>
            )}
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    {foods.length > 0 ? (
                        foods.map(food => (
                            <div key={food.id}>
                                <h2>{food.name}</h2>
                                <p>料理形式: {food.style}</p>
                                <p>料理類別: {food.type}</p>
                                <p>價格: {food.price}</p>
                                <p>抵達所需時間: {food.arr_time}</p>
                                <p>地址: {food.address}</p>
                            </div>
                        ))
                    ) : (
                        <p>No food items available.</p>
                    )}
                </div>
                <div style={{ flex: 1 }}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={{ lat: 25.0330, lng: 121.5654 }}
                        zoom={12}
                    >
                        {foods.map(food => (
                            food.latitude && food.longitude && (
                                <Marker
                                    key={food.id}
                                    position={{
                                        lat: food.latitude,
                                        lng: food.longitude
                                    }}
                                    label={food.name}
                                />
                            )
                        ))}
                    </GoogleMap>
                </div>
            </div>
        </>
    );
}

export default Finder;
