import React from 'react';
import { dashboardAccordionList } from '../utils/constants';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  return (
    <div className='p-5'>
      {dashboardAccordionList.map((module) => (
        <div key={module.id} className='collapse collapse-arrow bg-base-200 my-2 md:w-[500px]'>
          <input type='radio' name='my-accordion-3' />
          <div className='collapse-title text-xl font-medium'>{module.title}</div>
          <div className='collapse-content bg-white'>
            <ul>
              <li className='m-2 rounded-lg p-2 hover:bg-base-300'>
                <a href={module.content.metaverse} target='_blank'>
                  Take Metaverse Class
                </a>
              </li>
              <li className='m-2 rounded-lg p-2 hover:bg-base-300'>
                <Link to={module.content.path}>Take module quiz</Link>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardHome;
