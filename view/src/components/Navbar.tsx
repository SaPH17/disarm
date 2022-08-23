/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { useRecoilState } from "recoil";
import { user as userAtom } from "../states/atoms";
import { Link, useLocation } from "react-router-dom";
import { useRoleStatus } from "../utils/roles";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const leftMenus = [
  {
    name: "Dashboard",
    role: "",
  },
  {
    name: "Team",
    role: "",
  },
  {
    name: "Projects",
    role: "",
  },
  {
    name: "Calendar",
    role: "",
  },
];
const authMenus = [
  {
    name: "Login",
    role: "guest",
  },
  {
    name: "Register",
    role: "guest",
  },
];

export default function Navbar() {
  const role = useRoleStatus();
  const location = useLocation();
  const [user, setUser] = useRecoilState(userAtom);

  function handleLogout(){
    setUser(null);
  }

  return (
    <Disclosure as="nav" className="bg-white shadow fixed w-full">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  DISARM
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}

                  {leftMenus.map((menu) => {
                    return role === menu.role ? (
                      <a
                        key={menu.name}
                        href="#"
                        className={
                          (location.pathname.substring(1) ===
                          menu.name.toLowerCase()
                            ? "border-indigo-500 text-gray-900 "
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 ") +
                          "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        }
                      >
                        {menu.name}
                      </a>
                    ) : (
                      <span key={menu.name}></span>
                    );
                  })}
                </div>
              </div>
              {role !== "guest" ? (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative">
                    {({ open }) => (
                      <>
                        <div>
                          <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          show={open}
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            static
                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Your Profile
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Settings
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/login"
                                  onClick={ handleLogout }
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Logout
                                </Link>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-end">
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}

                    {authMenus.map((menu) => {
                      return role === menu.role ? (
                        <Link
                          key={menu.name}
                          to={"/" + menu.name.toLowerCase()}
                          className={
                            (location.pathname.substring(1) ===
                            menu.name.toLowerCase()
                              ? "border-indigo-500 text-gray-900 "
                              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 ") +
                            "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                          }
                        >
                          <span>{menu.name}</span>
                        </Link>
                      ) : (
                        <span key={menu.name}></span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-4 space-y-1">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              {leftMenus.map((menu) => {
                return role === menu.role ? (
                  <a
                    key={menu.name}
                    href="#"
                    className={
                      (location.pathname.substring(1) ===
                      menu.name.toLowerCase()
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 "
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 ") +
                      "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    }
                  >
                    <span>{menu.name}</span>
                  </a>
                ) : (
                  <span key={menu.name}></span>
                );
              })}
              {authMenus.map((menu) => {
                return role === menu.role ? (
                  <Link
                    key={menu.name}
                    to={"/" + menu.name.toLowerCase()}
                    className={
                      (location.pathname.substring(1) ===
                      menu.name.toLowerCase()
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 "
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 ") +
                      "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    }
                  >
                    <span>{menu.name}</span>
                  </Link>
                ) : (
                  <span key={menu.name}></span>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
