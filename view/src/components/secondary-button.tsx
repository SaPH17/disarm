import React from 'react';

export type ButtonData = {
  content: string;
  type?: 'submit' | 'reset' | 'button';
  classNames?: string;
  onClick?: Function;
};

const SecondaryButton = ({
  content,
  type = 'button',
  classNames = '',
  onClick = () => { },
}: ButtonData) => {
  return (
    <button
      onClick={(e) => {
        onClick(e);
      }}
      type={type}
      className={`
      inline-flex items-center py-2 border border-gray-300 leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 h-8 justify-center px-4 text-xs focus:ring-blue-500 rounded-sm 
      
      ${classNames}`}
    >
      {content}
    </button>
  );
};

export default SecondaryButton;
