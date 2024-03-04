import React, { useState, useEffect, useCallback } from 'react';
import { getAllDocuments } from '../../firebase';

const UsersTable = () => {
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    try {
      const data = await getAllDocuments('users');
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  let tableHead = (
    <thead>
      <tr>
        <th>Name</th>
        <th>Email Address</th>
        <th>Progress</th>
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
          <td>{user.progress}</td>
          <td>{user.certificate}</td>
          <td>{user.walletAddress}</td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className='mt-5'>
      <h4 className='text-center font-bold'>Users</h4>
      <div className='mt-5 p-4'>
        <div className='table table-xs'>
          {tableHead}
          {tableBody}
        </div>
      </div>
    </div>
  );
};

export { UsersTable };
