import React, { Component } from "react";
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import services from "../services";

function Finder() {
    const [foods, setFoods] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const food = await services.user.getAll();
                setFoods(food);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            <h1>Finder Page</h1>
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
