import React, { useState, useEffect, useCallback } from 'react';
import { getUsersData } from '../../firebase';
import { FaCheck } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';


const UsersTable = () => {
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    try {
      const data = await getUsersData()
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const renderModules = (count) => {
    const modules = [];

    for (let i = 0; i < 9; i++) {
      modules.push(i < count);
    }

    return modules;
  };

  let tableHead = (
    <thead>
      <tr>
        <th>Name</th>
        <th>Email Address</th>
        <th>Modules</th>
        <th>Received Certificate</th>
        <th>Wallet Address</th>
      </tr>
    </thead>
  );

  let tableBody = (
    <tbody>
      {users.map((user) => (
        <tr key={user.email}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>
            <tr>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>6</th>
              <th>7</th>
              <th>8</th>
              <th>9</th>
            </tr>
            <tr>
              {renderModules(user.moduleNumber).map((completed, index) => (
                <td key={index}>
                  {completed ? (
                    <input type='checkbox' checked className='bg-green-700' />
                  ) : (
                    <IoClose className='text-red-700 text-lg' />
                  )}
                </td>
              ))}
            </tr>
          </td>
          <td>{user.certificate ? <FaCheck /> : <IoClose className='text-red-700 text-lg' />}</td>
          <td>{user.walletAddress}</td>
        </tr>
      ))}
    </tbody>
  );

  // {user.progress}

  return (
    <div className='mt-5'>
      <h4 className='text-center font-bold text-2xl'>Users</h4>
      <div className='mt-5 p-4 overflow-x-auto'>
        <div className='table table-xs'>
          {tableHead}
          {tableBody}
        </div>
      </div>
    </div>
  );
};

export { UsersTable };
