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

    return (
        <>
            <h1>Finder Page</h1>
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

                <button type="submit">Apply Filters</button>
            </form>
            <div>
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
        </>
    );
}

export default Finder;
