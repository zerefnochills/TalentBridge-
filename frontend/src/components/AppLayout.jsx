import React from 'react';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="main-wrapper">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
