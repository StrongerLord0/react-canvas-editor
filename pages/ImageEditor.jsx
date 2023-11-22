import React from 'react';

export default function ImageEditor({ onClose }) {
  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50`}>
      <div className={`flex w-3/5 h-4/5 bg-purple-500 p-2 rounded-xl text-white text-center`}>
        <div className={`w-1/6 h-full bg-red-500`}>
            A
        </div>
        <div className={`w-5/6 h-full bg-blue-400`}>
            <button onClick={() => onClose(false)} className={`mt-6 rounded-full bg-blue-300 w-6`}>
                X
            </button>
        </div>
      </div>
    </div>
  );
}
