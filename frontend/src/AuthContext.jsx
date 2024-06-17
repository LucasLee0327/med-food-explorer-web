// 登入系統技術支援: ChatGPT

import React, { createContext, useState, useEffect, useContext } from 'react';
import services from "./services"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  useEffect(() => {
    // 在组件加载时检查会话状态
    const checkSessionStatus = async () => {
      try {
        const { sessionStatus } = await services.auth.statusOK();
        if(sessionStatus) {
          console.log("Logged in!");
          setIsLoggedIn(sessionStatus);
        }      
      } catch (error) {
        console.log("Not logged in yet.");
        setIsLoggedIn(false);
      }
    };

    checkSessionStatus(); // 调用检查会话状态的函数

  }, [updateTrigger]);

  const login = async (credentials) => {
    try {
      // 發送登入請求給後端並確認登入狀態
      // services.auth.login函數會返回一個布爾值，表示登入成功與否
      await services.auth.login(credentials);
      setUpdateTrigger(prev => !prev);
    } catch (error) {
      console.error('登入失敗：', error);
    }
  };
  const logout = async () => {
    try {
      await services.auth.logout();
      setUpdateTrigger(prev => !prev);
    } catch (error) {
      console.error('登出失敗：', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};