import React from 'react';
import LayoutAdmin from './layout/LayoutAdmin';
import './Home.css';

function Home() {
  return (
    <LayoutAdmin>
      <div className='cards'>
        <div className='card__box'>
          <div>
            <div className='card__box--numbers'>342</div>
            <div className='card__box--name'>Assets</div>
          </div>
          <div className='card__box--icon'>
            <i className='bx bxs-package' />
          </div>
        </div>
        <div className='card__box'>
          <div>
            <div className='card__box--numbers'>204</div>
            <div className='card__box--name'>Users</div>
          </div>
          <div className='card__box--icon'>
            <i className='bx bxs-user' />
          </div>
        </div>
        <div className='card__box'>
          <div>
            <div className='card__box--numbers'>13</div>
            <div className='card__box--name'>Requests for Returning</div>
          </div>
          <div className='card__box--icon'>
            <i className='bx bxs-message-rounded-check'></i>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}

export default Home;
