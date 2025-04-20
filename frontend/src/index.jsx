// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './styles/global.css';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

import Home from './pages/Home';
import SubmitEvent from './pages/SubmitEvent';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Imprint from './pages/Imprint';

import RequireAuth from './components/Auth/RequireAuth';
import RequireAdmin from './components/Auth/RequireAdmin';

function App() {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    <Routes>
                        {/* Öffentlich */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Geschützt: nur angemeldete Nutzer */}
                        <Route
                            path="/submit"
                            element={
                                <RequireAuth>
                                    <SubmitEvent />
                                </RequireAuth>
                            }
                        />

                        {/* Nur Admins */}
                        <Route
                            path="/admin"
                            element={
                                <RequireAdmin>
                                    <AdminPanel />
                                </RequireAdmin>
                            }
                        />

                        {/* Impressum / Datenschutz */}
                        <Route path="/imprint" element={<Imprint />} />
                        <Route path="/privacy" element={<Privacy />} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

function Privacy() {
    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Datenschutzerklärung</h2>
            <p>Hier kommt deine Datenschutzerklärung.</p>
        </div>
    );
}

createRoot(document.getElementById('root')).render(<App />);
