import { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        unreadOnly: false,
        types: {
            task_assigned: true,
            deadline: true,
            completion: true,
            urgent: true,
            comment: true,
            overdue: true,
            meeting: true,
            report: true
        }
    });

    const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'oldest'

    return (
        <NotificationContext.Provider value={{ filters, setFilters, sortBy, setSortBy }}>
            {children}
        </NotificationContext.Provider>
    );
};