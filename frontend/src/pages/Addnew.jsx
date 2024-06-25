import React, { Component } from "react";
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import services from "../services";

function Addnew() {
  const [newCandidate, setNewCandidate] = useState({
      name: "",
      style: "中式",
      type: "飯",
      price: "便宜",
      arr_time: "馬上",
      address: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
      const { name, value } = e.target;
      setNewCandidate(prevState => ({
          ...prevState,
          [name]: value
      }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await services.user.createCandidate(newCandidate);
          alert("Upload succeeded! Please wait for verification.");
      } catch (error) {
          console.error('Error updating new restaurant:', error);
          alert('Error uploading new restaurant. Please try again.');
      }
  };

  return (
      <>
          <h2>投稿餐廳</h2>
          <form onSubmit={handleSubmit}>
              <div>
                  <label>
                      店名:
                      <input type="text" name="name" value={newCandidate.name} onChange={handleChange} required />
                  </label>
              </div>
              <div>
                  <label>
                      料理形式:
                      <select name="style" value={newCandidate.style} onChange={handleChange}>
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
                      <select name="type" value={newCandidate.type} onChange={handleChange}>
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
                      <select name="price" value={newCandidate.price} onChange={handleChange}>
                          <option value="便宜">便宜</option>
                          <option value="中等">中等</option>
                          <option value="貴">貴</option>
                      </select>
                  </label>
              </div>
              <div>
                  <label>
                      抵達所需時間:
                      <select name="arr_time" value={newCandidate.arr_time} onChange={handleChange}>
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
                      <input type="text" name="address" value={newCandidate.address} onChange={handleChange} required/>
                  </label>
              </div>
              <button type="submit">新增餐廳</button>
          </form>
      </>
  );
}

export default Addnew;