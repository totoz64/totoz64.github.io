
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListBulletIcon, PlusIcon } from '../constants';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Liste', icon: <ListBulletIcon className="w-6 h-6" /> },
    { path: '/new', label: 'Nouveau', icon: <PlusIcon className="w-6 h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-300 shadow-top z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full p-2 text-sm ${
                isActive ? 'text-sky-600' : 'text-slate-600 hover:text-sky-500'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
