import React from 'react';
import { FaCircle } from 'react-icons/fa';

const ActiveUsers = ({ users }) => {
    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Active Users</h3>
            <div className="space-y-2">
                {users.map((user) => (
                    <div key={user.userId} className="flex items-center gap-2">
                        <FaCircle className="w-2 h-2 text-green-500" />
                        <span className="text-sm text-gray-600">{user.username}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveUsers; 