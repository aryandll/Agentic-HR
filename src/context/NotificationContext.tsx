import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string; // ISO string or relative time description
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
    link?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error', link?: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [
            // Default mock notifications if empty, just so it's not barren initially
            {
                id: '1',
                title: 'Welcome back!',
                message: 'System updated to version 2.0',
                time: new Date().toISOString(),
                read: false,
                type: 'info'
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', link?: string) => {
        const newNotif: Notification = {
            id: Date.now().toString(),
            title,
            message,
            time: new Date().toISOString(),
            read: false,
            type,
            link
        };
        setNotifications(prev => [newNotif, ...prev]);

        // Optional: Show toast as well for immediate feedback
        if (type === 'success') toast.success(title);
        else if (type === 'error') toast.error(title);
        else toast(title, { icon: '🔔' });
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
