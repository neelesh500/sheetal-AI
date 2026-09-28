import React from 'react';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

export default function MainLayout({ children }) {
    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: '#020617' }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: '260px', position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
                {children}
            </div>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#09090b',
                        border: '1px solid #27272a',
                        color: '#ededed',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#000',
                        },
                    },
                }}
            />
        </div>
    );
}
