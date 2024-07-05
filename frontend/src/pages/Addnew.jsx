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
          setNewCandidate({
            name: "",
            style: "中式",
            type: "飯",
            price: "便宜",
            address: ""
        });
      } catch (error) {
          console.error('Error updating new restaurant:', error);
          alert(`Error uploading new candidate: ${error}. Please try again.`);
      }
  };

  return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">投稿餐廳</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                      店名:
                      <input 
                          type="text" 
                          name="name" 
                          value={newCandidate.name} 
                          onChange={handleChange} 
                          required 
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                  </label>
              </div>
              <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                      料理形式:
                      <select 
                          name="style" 
                          value={newCandidate.style} 
                          onChange={handleChange} 
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
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
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                      料理類別:
                      <select 
                          name="type" 
                          value={newCandidate.type} 
                          onChange={handleChange} 
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                          <option value="飯">飯</option>
                          <option value="麵">麵</option>
                          <option value="速食">速食</option>
                          <option value="素食">素食</option>
                          <option value="火鍋">火鍋</option>
                          <option value="拉麵">拉麵</option>
                          <option value="簡餐">簡餐</option>
                          <option value="合菜">合菜</option>
                          <option value="其他">其他</option>
                      </select>
                  </label>
              </div>
              <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                      價格:
                      <select 
                          name="price" 
                          value={newCandidate.price} 
                          onChange={handleChange} 
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                          <option value="便宜">便宜</option>
                          <option value="中等">中等</option>
                          <option value="貴">貴</option>
                      </select>
                  </label>
              </div>
              <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                      地址:
                      <input 
                          type="text" 
                          name="address" 
                          value={newCandidate.address} 
                          onChange={handleChange} 
                          required 
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                  </label>
              </div>
              <div>
                  <button 
                      type="submit" 
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                      投稿餐廳
                  </button>
              </div>
          </form>
      </div>
  );
}

export default Addnew;