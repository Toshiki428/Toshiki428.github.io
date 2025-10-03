import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-center space-x-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-white font-bold underline' : 'text-gray-300 hover:text-white'
            }
          >
            Home
          </NavLink>
        </li>
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
    </nav>
  );
};

export default Navbar
