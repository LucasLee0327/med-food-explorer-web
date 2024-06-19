import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import services from "../services";

function myprofile() {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext? authContext.isLoggedIn : false

  const [selectedFile, setSelectedFile] = useState(null);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const allowedTypes = ['image/jpeg', 'image/png'];

  useEffect(() => {
    async function fetchUserData() {
      try {
        // 从服务器获取当前用户的用户名
        if (isLoggedIn) {
          const response = await services.user.getName();
          if (response) {
            const name = response.Username;
            setUsername(name);
          } else {
            console.error('Error fetching user data: Invalid response format');
          }
          const userData = await services.user.getOne(username);
          setAvatar(userData.avatar);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    // 加载用户数据
    fetchUserData();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    // 檢查檔案類型是否為 JPEG 或 PNG
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Please select a JPEG or PNG file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;
      try {
        await services.user.uploadImage({ avatar: base64Image });
        // Handle success
        console.log('Image uploaded successfully.');
        // 更新頭像
        setAvatar(base64Image);
      } catch (error) {
        // Handle error
        alert("Some error occured. Please change another photo.")
        console.error('Error uploading image:', error);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <>
      {isLoggedIn ? (
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
            <img className="w-200 h-200 object-cover rounded" alt="avatar" src={avatar} />
            <div className="text-center lg:w-2/3 w-full">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{username}</h1>
              <div className="flex justify-center">
                <form onSubmit={handleSubmit}>
                  <input type="file" onChange={handleFileChange} accept="image/jpeg, image/png" />
                  <button type="submit" className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Upload Avatar</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-3xl font-bold">請登入後使用。</p>
        </div>
      )}
    </>
  );
  
}

export default myprofile