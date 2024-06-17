import { NavLink, Outlet } from "react-router-dom";
import { Fragment } from "react";
import React, { useContext } from 'react'
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AuthContext } from '../AuthContext';
import myicon from "./pikachu.png"
import homegif from "./starburst-yay.gif"


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RootLayout() {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext? authContext.isLoggedIn : false
  const navigation = isLoggedIn
  ? [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
      { name: 'Chatboard', href: '/Chatboard' },
      { name: 'ChatGPT', href: '/chatGPT'},
      { name: 'My Profile', href: '/myprofile'},
      { name: 'Log out', href: '/logout'}
      // 其他已登入後需要顯示的連結
    ]
  : [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
      { name: 'Log in', href: '/Login' },
      { name: 'Sign up', href: '/Signup' },
      // 其他未登入時需要顯示的連結
    ];

  return (
    <div>    
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
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
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
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
      <div>
        <Outlet />
      </div>   
    </div>
  );
}

export function RootIndex() {
  return (
    <div className="my-16 text-center">
      <div className="flex justify-center my-4">
        <h1 className="text-4xl block">Lucas Lee's Website</h1>
      </div>
      <div className="flex justify-center">
        <a href="https://www.youtube.com/watch?v=yQgN0A0WCzE" target="_blank">
          <img src={homegif} className="w-52 logo" />
        </a>
      </div>
      <div className="flex justify-center items-center">
        <p className="text-xl block">
          更換使用者頭貼、留言板等功能，請登入後使用。
          <br/>
          API回應速度較慢，留言板、登入功能可能需約5秒回應時間，請友善對待按鈕不要一直點擊QwQ
          <br/>

          <br/>
          由於部分功能登入後方可使用，重新載入可能導致登入狀態更新未完全。
          <br/>
          若遇到留言板、個人頁面沒有正常加載，請嘗試切換頁面後再回原本頁面，謝謝!
        </p>
      </div>
    </div>
  );
}