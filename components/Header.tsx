
import React from 'react';
import { APP_NAME } from '../constants';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-sky-700 text-white p-4 shadow-md sticky top-0 z-50">
      <h1 className="text-xl font-semibold">{title || APP_NAME}</h1>
    </header>
  );
};

export default Header;
