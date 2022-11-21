import React from 'react';

export type ButtonData = {
  content: string;
  type?: 'submit' | 'reset' | 'button';
  classNames?: string;
  onClick?: Function;
};

const PrimaryButton = ({
  content,
  type = 'button',
  classNames = '',
  onClick = () => {},
}: ButtonData) => {
  return (
    <button
      onClick={(e) => {
        onClick(e);
      }}
      type={type}
      className={`inline-flex h-8 justify-center items-center px-4 border border-transparent text-xs leading-4 font-medium shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-sm ${classNames}`}
    >
      {content}
    </button>
  );
};

export default PrimaryButton;
