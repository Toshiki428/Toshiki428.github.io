import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '/logo.svg';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-3">
          <img src={logo} alt="logo" className="h-8 w-8" />
          <span className="text-white font-bold text-xl">Toshiki's Portfolio & Blog</span>
        </NavLink>
        <ul className="flex space-x-6">
          <li>
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                isActive ? 'text-white font-bold underline' : 'text-gray-300 hover:text-white'
              }
            >
              Portfolio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                isActive ? 'text-white font-bold underline' : 'text-gray-300 hover:text-white'
              }
            >
              Blog
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar
