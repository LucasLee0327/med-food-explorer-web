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

    useEffect(() => {
        async function fetchData() {
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
        }

        fetchData();
    }, [filters]);

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

    return (
        <>
            <h1>Finder Page</h1>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Style:</legend>
                    <label>
                        <input type="checkbox" name="style" value="中式" onChange={handleCheckboxChange} checked={filters.style.includes("中式")} />
                        中式
                    </label>
                    <label>
                        <input type="checkbox" name="style" value="西式" onChange={handleCheckboxChange} checked={filters.style.includes("西式")} />
                        西式
                    </label>
                    <label>
                        <input type="checkbox" name="style" value="日式" onChange={handleCheckboxChange} checked={filters.style.includes("日式")} />
                        日式
                    </label>
                    <label>
                        <input type="checkbox" name="style" value="韓式" onChange={handleCheckboxChange} checked={filters.style.includes("韓式")} />
                        韓式
                    </label>
                    <label>
                        <input type="checkbox" name="style" value="台式" onChange={handleCheckboxChange} checked={filters.style.includes("台式")} />
                        台式
                    </label>
                    <label>
                        <input type="checkbox" name="style" value="其他" onChange={handleCheckboxChange} checked={filters.style.includes("其他")} />
                        其他
                    </label>
                </fieldset>

                <fieldset>
                    <legend>Type:</legend>
                    <label>
                        <input type="checkbox" name="type" value="飯" onChange={handleCheckboxChange} checked={filters.type.includes("飯")} />
                        飯
                    </label>
                    <label>
                        <input type="checkbox" name="type" value="麵" onChange={handleCheckboxChange} checked={filters.type.includes("麵")} />
                        麵
                    </label>
                    <label>
                        <input type="checkbox" name="type" value="麵包" onChange={handleCheckboxChange} checked={filters.type.includes("麵包")} />
                        麵包
                    </label>
                    <label>
                        <input type="checkbox" name="type" value="其他" onChange={handleCheckboxChange} checked={filters.type.includes("其他")} />
                        其他
                    </label>
                </fieldset>

                <fieldset>
                    <legend>Price:</legend>
                    <label>
                        <input type="checkbox" name="price" value="便宜" onChange={handleCheckboxChange} checked={filters.price.includes("便宜")} />
                        便宜
                    </label>
                    <label>
                        <input type="checkbox" name="price" value="中等" onChange={handleCheckboxChange} checked={filters.price.includes("中等")} />
                        中等
                    </label>
                    <label>
                        <input type="checkbox" name="price" value="貴" onChange={handleCheckboxChange} checked={filters.price.includes("貴")} />
                        貴
                    </label>
                </fieldset>

                <fieldset>
                    <legend>Arrival Time:</legend>
                    <label>
                        <input type="checkbox" name="arr_time" value="馬上" onChange={handleCheckboxChange} checked={filters.arr_time.includes("馬上")} />
                        馬上
                    </label>
                    <label>
                        <input type="checkbox" name="arr_time" value="5分" onChange={handleCheckboxChange} checked={filters.arr_time.includes("5分")} />
                        5分
                    </label>
                    <label>
                        <input type="checkbox" name="arr_time" value="10分" onChange={handleCheckboxChange} checked={filters.arr_time.includes("10分")} />
                        10分
                    </label>
                    <label>
                        <input type="checkbox" name="arr_time" value="20分" onChange={handleCheckboxChange} checked={filters.arr_time.includes("20分")} />
                        20分
                    </label>
                    <label>
                        <input type="checkbox" name="arr_time" value="30分以上" onChange={handleCheckboxChange} checked={filters.arr_time.includes("30分以上")} />
                        30分以上
                    </label>
                </fieldset>
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
