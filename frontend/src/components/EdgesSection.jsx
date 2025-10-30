import React, { useState, useEffect } from 'react';
import { edgeService, nodeService } from '../services/api';

const EdgesSection = () => {
  const [edges, setEdges] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [newEdge, setNewEdge] = useState({
    src_id: '',
    dst_id: '',
    distancia: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [edgesData, nodesData] = await Promise.all([
        edgeService.getAll(),
        nodeService.getAll()
      ]);
      setEdges(edgesData);
      setNodes(nodesData);
    } catch (err) {
      setError('Error al cargar datos: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getNodeName = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.name : `Nodo ${nodeId}`;
  };

  const handleCreateEdge = async (e) => {
    e.preventDefault();
    
    const srcId = parseInt(newEdge.src_id);
    const dstId = parseInt(newEdge.dst_id);
    const distancia = parseFloat(newEdge.distancia);

    if (!srcId || !dstId || !distancia || distancia <= 0) {
      setError('Todos los campos son requeridos y la distancia debe ser mayor a 0');
      return;
    }

    if (srcId === dstId) {
      setError('El nodo origen y destino deben ser diferentes');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await edgeService.create(srcId, dstId, distancia);
      setNewEdge({ src_id: '', dst_id: '', distancia: '' });
      setSuccess('Arista creada exitosamente');
      await loadData();
    } catch (err) {
      setError('Error al crear arista: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteEdge = async (id, srcName, dstName) => {
    if (!window.confirm(`¿Estás seguro de eliminar la arista ${srcName} → ${dstName}?`)) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await edgeService.delete(id);
      setSuccess('Arista eliminada exitosamente');
      await loadData();
    } catch (err) {
      setError('Error al eliminar arista: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          Gestión de Aristas
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Crear y gestionar conexiones entre nodos
        </p>
      </div>

      {/* Crear nueva arista */}
      <div className="card">
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>
          Crear Nueva Arista
        </h3>
        
        {nodes.length < 2 ? (
          <div className="alert alert-warning">
            Se necesitan al menos 2 nodos para crear una arista. 
            Ve a la sección de nodos para crear más nodos.
          </div>
        ) : (
          <form onSubmit={handleCreateEdge} className="grid grid-cols-4 gap-4">
            <div>
              <label className="form-label">Nodo Origen</label>
              <select
                value={newEdge.src_id}
                onChange={(e) => setNewEdge({ ...newEdge, src_id: e.target.value })}
                className="select"
                required
              >
                <option value="">Seleccionar origen</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name} (ID: {node.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Nodo Destino</label>
              <select
                value={newEdge.dst_id}
                onChange={(e) => setNewEdge({ ...newEdge, dst_id: e.target.value })}
                className="select"
                required
              >
                <option value="">Seleccionar destino</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name} (ID: {node.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Distancia</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={newEdge.distancia}
                onChange={(e) => setNewEdge({ ...newEdge, distancia: e.target.value })}
                placeholder="Ej: 10.5"
                className="input"
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Crear Arista
              </button>
            </div>
          </form>
        )}
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

      {/* Lista de aristas */}
      <div className="item-list">
        <div className="item-header">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500' }}>
            Aristas Existentes ({edges.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="loading-message">
            Cargando aristas...
          </div>
        ) : edges.length === 0 ? (
          <div className="empty-message">
            No hay aristas creadas
          </div>
        ) : (
          <div>
            {edges.map((edge) => (
              <div key={edge.id} className="item">
                <div className="flex items-center">
                  <div className="item-icon item-icon-green">
                    {edge.id}
                  </div>
                  <div className="item-content">
                    <div className="item-title">
                      {getNodeName(edge.src_id)} → {getNodeName(edge.dst_id)}
                    </div>
                    <div className="item-subtitle">
                      Distancia: {edge.weight} | IDs: {edge.src_id} → {edge.dst_id}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEdge(edge.id, getNodeName(edge.src_id), getNodeName(edge.dst_id))}
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

export default EdgesSection;