import React, { useState } from 'react';

const Menu = () => {
  const [showContent, setShowContent] = useState(false);
  const toggleShowContent = () => setShowContent(!showContent);
  return (
    <div className='relative inline-block'>
      <button className='btn btn-secondary' onClick={toggleShowContent}>
        +
      </button>
      <div
        className={` ${
          showContent ? 'block' : 'hidden'
        } absolute inset-x-0 bottom-0 bg-red-500 z-40 max-w-xs`}>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
