
'use client';

import type { UserCredentials } from "@/lib/types";

const USERS_KEY = 'users';

const initialUsers: UserCredentials[] = [
    { id: 1, username: 'admin', role: 'admin', password: 'adminpassword' },
    { id: 2, username: 'cashier', role: 'cashier', password: 'cashierpassword' },
];

export const getUsers = (): UserCredentials[] => {
    if (typeof window === 'undefined') {
        return initialUsers;
    }
    const storedUsers = localStorage.getItem(USERS_KEY);
    if (storedUsers) {
        return JSON.parse(storedUsers);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
};

export const saveUsers = (users: UserCredentials[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('storage'));
};
