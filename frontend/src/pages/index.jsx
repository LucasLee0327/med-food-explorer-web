import { NavLink, Outlet } from "react-router-dom";
import { Fragment } from "react";
import React, { useContext } from 'react'
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import myicon from "./pikachu.png"
import homeicon from "./what-to-eat.gif"


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
                  </div>
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
                      <button 
                        className="text-gray-300 hover:bg-red-800 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <span className="sr-only">使用說明</span>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h0m0-4h0m0-6h0m6 6h0M6 12h0m12-4h0M6 8h0m6 12h0m6-10h0M6 16h0" />
                        </svg>
                      </button>
                    </div>
                  </div>
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
            <p className="mb-2">首頁：顯示網站的主要功能和介紹。</p>
            <p className="mb-2">關於本站：介紹網站的背景和目的。</p>
            <p className="mb-2">尋找美食：根據不同的條件篩選並顯示美食餐廳。</p>
            <p className="mb-2">美食抽獎：隨機選擇一個美食餐廳。</p>
            <p className="mb-2">投稿餐廳：用戶可以提交新的餐廳資料。</p>
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