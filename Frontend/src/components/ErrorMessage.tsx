import React from 'react';

type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 border border-red-200">
      {message}
    </div>
  );
} 