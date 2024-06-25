import { NavLink, Outlet } from "react-router-dom";
import { Fragment } from "react";
import React, { useContext } from 'react'
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import myicon from "./pikachu.png"
import homeicon from "./what-to-eat.jpg"


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RootLayout() {
  const navigation = [
      { name: '首頁', href: '/' },
      { name: '關於本站', href: '/About' },
      { name: '尋找美食', href: '/Finder'},
      { name: '美食抽獎', href: '/Draw'},
      { name: '新增美食', href: '/Addnew'}
    ];

  return (
    <div>    
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
        <h1 className="text-4xl block">給迷茫晚餐吃什麼的你</h1>
      </div>
      <div className="flex justify-center">
        <a href="https://www.youtube.com/watch?v=yQgN0A0WCzE" target="_blank">
          <img src={homeicon} className="w-52 logo" />
        </a>
      </div>
    </div>
  );
}