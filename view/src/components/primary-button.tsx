import React from 'react';

export type ButtonData = {
  content: string;
};

const PrimaryButton = ({ content }: ButtonData) => {
  return (
    <button
      type="button"
      className="inline-flex h-8 items-center px-4 border border-transparent text-xs leading-4 font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {content}
    </button>
  );
};

export default PrimaryButton;
