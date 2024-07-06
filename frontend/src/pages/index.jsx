import { NavLink, Outlet } from "react-router-dom";
import { Fragment } from "react";
import React, { useContext, useState } from 'react'
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import myicon from "./pikachu.png"
import homeicon from "./what-to-eat.gif"
import infoIcon from "./info.png"


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RootLayout() {
  const navigation = [
      { name: '首頁', href: '/' },
      { name: '關於本站', href: '/About' },
      { name: '尋找美食', href: '/Finder'},
      { name: '美食抽獎', href: '/Draw'},
      { name: '投稿餐廳', href: '/Addnew'}
    ];
  
  const [isModalOpen, setIsModalOpen] = useState(false); // 新增的部分

  return (
    <div className="flex flex-col min-h-screen">    
      <Disclosure as="nav" className="bg-red-600">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  {/*
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src={myicon}
                      alt="Your Company"
                    />
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src={myicon}
                      alt="Your Company"
                    />
                  </div>*/
                  }
                  
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? "bg-red-600 text-white"
                                : "text-gray-300 hover:bg-red-800 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )
                          }
                        >
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    className="bg-red-600 rounded-full p-2"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <img src={infoIcon} alt="Info" className="h-6 w-6"/>
                  </button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              {({ close }) => (
                <div className="space-y-1 px-2 pt-2 pb-3">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      as={NavLink}
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-red-600 text-white"
                            : "text-gray-300 hover:bg-red-800 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium"
                        )
                      }
                      onClick={close}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <div className="flex-grow">
        <Outlet />
      </div>   

      <footer className="bg-red-600 text-center py-4 text-white">
        &copy; 2024 Lee Cheng-Yang. All rights reserved.
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 relative z-10">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              <span className="sr-only">關閉</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">網站使用說明</h2>
            <p className="text-xl font-bold mb-2">尋找美食</p>
            <p className="mb-2">左側(上方)為餐廳列表，點擊餐廳可將地圖移動至餐廳位置。</p>
            <p className="mb-2">地圖上標示表示餐廳形式與料理類別，點擊可查看餐廳名與地址。</p>
            <p className="mb-2">右側按鈕點擊可篩選特定條件餐廳，勾選條件後按篩選即可。</p>
            <p className="text-xl font-bold mb-2">美食抽獎</p>
            <p className="mb-2">左側(上方)為篩選表，可調整需求與想抽選的數量，點選最下方抽選即可。</p>
            <p className="mb-2">右側(下方)顯示抽獎結果。點選可顯示更多餐廳資訊與地圖。</p>
            <p className="text-xl font-bold mb-2">投稿餐廳</p>
            <p className="mb-2">請依要求填寫。若有缺乏的選項歡迎反應，但我不一定有空看OwO。</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function RootIndex() {
  return (
    <div className="my-16 text-center">
      <div className="flex justify-center my-4">
        <h1 className="text-4xl block font-bold">給迷茫吃什麼的你</h1>
      </div>
      <div className="flex justify-center">
        <a href="https://www.youtube.com/watch?v=t_KdbASIkB8" target="_blank">
          <img src={homeicon} className="w-80 logo" />
        </a>
      </div>
    </div>
  );
}