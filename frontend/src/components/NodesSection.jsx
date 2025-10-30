import React, { useState, useEffect } from 'react';
import { nodeService } from '../services/api';

const NodesSection = () => {
  const [nodes, setNodes] = useState([]);
  const [newNodeName, setNewNodeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadNodes();
  }, []);

  const loadNodes = async () => {
    try {
      setLoading(true);
      const data = await nodeService.getAll();
      setNodes(data);
    } catch (err) {
      setError('Error al cargar nodos: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNode = async (e) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    try {
      setError('');
      setSuccess('');
      await nodeService.create(newNodeName.trim());
      setNewNodeName('');
      setSuccess('Nodo creado exitosamente');
      await loadNodes();
    } catch (err) {
      setError('Error al crear nodo: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteNode = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de eliminar el nodo "${name}"? Esto también eliminará todas las aristas conectadas.`)) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await nodeService.delete(id);
      setSuccess('Nodo eliminado exitosamente');
      await loadNodes();
    } catch (err) {
      setError('Error al eliminar nodo: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          Gestión de Nodos
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Crear y gestionar nodos del grafo
        </p>
      </div>

      {/* Crear nuevo nodo */}
      <div className="card">
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>
          Crear Nuevo Nodo
        </h3>
        <form onSubmit={handleCreateNode} className="flex" style={{ gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              placeholder="Nombre del nodo (ej: Ciudad A)"
              className="input"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Crear Nodo
          </button>
        </form>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* Lista de nodos */}
      <div className="item-list">
        <div className="item-header">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500' }}>
            Nodos Existentes ({nodes.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="loading-message">
            Cargando nodos...
          </div>
        ) : nodes.length === 0 ? (
          <div className="empty-message">
            No hay nodos creados
          </div>
        ) : (
          <div>
            {nodes.map((node) => (
              <div key={node.id} className="item">
                <div className="flex items-center">
                  <div className="item-icon item-icon-blue">
                    {node.id}
                  </div>
                  <div className="item-content">
                    <div className="item-title">{node.name}</div>
                    <div className="item-subtitle">ID: {node.id}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNode(node.id, node.name)}
                  className="btn btn-danger"
                  style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodesSection;