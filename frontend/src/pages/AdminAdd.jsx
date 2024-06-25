import React, { Component } from "react";
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import services from "../services";

function AdminAdd() {
    const [newRestaurant, setNewRestaurant] = useState({
        name: "",
        style: "中式",
        type: "飯",
        price: "便宜",
        arr_time: "馬上",
        address: ""
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
        setNewRestaurant(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await services.user.createOne(newRestaurant);
            alert("Update new restaurant succeeded!");
            if (selectedCandidateId) {
                await services.user.deleteCandidate(selectedCandidateId); // Remove candidate
                setCandidates(candidates.filter(c => c.id !== selectedCandidateId)); // Update candidates list
                setSelectedCandidateId(null); // Reset selected candidate ID
            }
        } catch (error) {
            console.error('Error updating new restaurant:', error);
            alert('Error updating new restaurant. Please try again.');
        }
    };

    return (
        <>
            <div>
                <h2>Add New Restaurant</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            店名:
                            <input type="text" name="name" value={newRestaurant.name} onChange={handleChange} required />
                        </label>
                    </div>
                    <div>
                        <label>
                            料理形式:
                            <select name="style" value={newRestaurant.style} onChange={handleChange}>
                                <option value="中式">中式</option>
                                <option value="西式">西式</option>
                                <option value="日式">日式</option>
                                <option value="韓式">韓式</option>
                                <option value="台式">台式</option>
                                <option value="其他">其他</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            料理類別:
                            <select name="type" value={newRestaurant.type} onChange={handleChange}>
                                <option value="飯">飯</option>
                                <option value="麵">麵</option>
                                <option value="麵包">麵包</option>
                                <option value="其他">其他</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            價格:
                            <select name="price" value={newRestaurant.price} onChange={handleChange}>
                                <option value="便宜">便宜</option>
                                <option value="中等">中等</option>
                                <option value="貴">貴</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            抵達所需時間:
                            <select name="arr_time" value={newRestaurant.arr_time} onChange={handleChange}>
                                <option value="馬上">馬上</option>
                                <option value="5分">5分</option>
                                <option value="10分">10分</option>
                                <option value="20分">20分</option>
                                <option value="30以上">30以上</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            地址:
                            <input type="text" name="address" value={newRestaurant.address} onChange={handleChange} />
                        </label>
                    </div>
                    <button type="submit">新增餐廳</button>
                </form>
            </div>
            <div>
                <h2>投稿餐廳</h2>
                {candidates.length > 0 ? (
                    candidates.map(candidate => (
                    <div key={candidate.id}>
                        <h3>{candidate.name}</h3>
                        <p>料理形式: {candidate.style}</p>
                        <p>料理類別: {candidate.type}</p>
                        <p>價格: {candidate.price}</p>
                        <p>抵達所需時間: {candidate.arr_time}</p>
                        <p>地址: {candidate.address}</p>
                        <button onClick={() => handleCandidateClick(candidate)}>準備上傳</button>
                        <p></p>
                    </div>
                    ))
                ) : (
                    <p>No candidates available.</p>
                )}
            </div>
        </>
    );
}

export default AdminAdd;