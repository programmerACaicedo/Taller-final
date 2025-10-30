import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import NodesSection from './NodesSection';
import EdgesSection from './EdgesSection';
import AlgorithmsSection from './AlgorithmsSection';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('nodes');

  const tabs = [
    { id: 'nodes', label: 'Nodos', icon: '●' },
    { id: 'edges', label: 'Aristas', icon: '→' },
    { id: 'algorithms', label: 'Algoritmos', icon: '🔍' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                PathFinder
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Explorador de Grafos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Bienvenido, <span style={{ fontWeight: '500' }}>{user?.username}</span>
              </span>
              <button
                onClick={logout}
                className="btn btn-danger"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container">
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {activeTab === 'nodes' && <NodesSection />}
        {activeTab === 'edges' && <EdgesSection />}
        {activeTab === 'algorithms' && <AlgorithmsSection />}
      </main>
    </div>
  );
};

export default Dashboard;