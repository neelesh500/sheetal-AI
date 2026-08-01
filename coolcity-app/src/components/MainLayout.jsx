import React from 'react';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

export default function MainLayout({ children }) {
    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: '#020617' }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: '260px', position: 'relative' }}>
                {children}
            </div>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'rgba(4, 13, 33, 0.9)',
                        border: '1px solid rgba(0, 240, 255, 0.4)',
                        color: '#fff',
                        backdropFilter: 'blur(10px)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#00f0ff',
                            secondary: '#000',
                        },
                    },
                }}
            />
        </div>
    );
}
