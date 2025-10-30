import React, { useState, useEffect } from 'react';
import { algorithmService, nodeService } from '../services/api';

const AlgorithmsSection = () => {
  const [nodes, setNodes] = useState([]);
  const [bfsConfig, setBfsConfig] = useState({
    start_id: '',
    max_depth: 3
  });
  const [dijkstraConfig, setDijkstraConfig] = useState({
    start_id: '',
    end_id: ''
  });
  const [results, setResults] = useState({
    bfs: null,
    dijkstra: null
  });
  const [loading, setLoading] = useState({
    nodes: false,
    bfs: false,
    dijkstra: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadNodes();
  }, []);

  const loadNodes = async () => {
    try {
      setLoading(prev => ({ ...prev, nodes: true }));
      const nodesData = await nodeService.getAll();
      setNodes(nodesData);
    } catch (err) {
      setError('Error al cargar nodos: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(prev => ({ ...prev, nodes: false }));
    }
  };

  const getNodeName = (nodeId) => {
    const node = nodes.find(n => n.id === parseInt(nodeId));
    return node ? node.name : `Nodo ${nodeId}`;
  };

  const handleBfsSearch = async (e) => {
    e.preventDefault();
    
    if (!bfsConfig.start_id) {
      setError('Selecciona un nodo de inicio para BFS');
      return;
    }

    try {
      setError('');
      setLoading(prev => ({ ...prev, bfs: true }));
      setResults(prev => ({ ...prev, bfs: null }));
      
      const result = await algorithmService.bfs(
        parseInt(bfsConfig.start_id), 
        parseInt(bfsConfig.max_depth)
      );
      setResults(prev => ({ ...prev, bfs: result }));
    } catch (err) {
      setError('Error en BFS: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(prev => ({ ...prev, bfs: false }));
    }
  };

  const handleDijkstraSearch = async (e) => {
    e.preventDefault();
    
    if (!dijkstraConfig.start_id || !dijkstraConfig.end_id) {
      setError('Selecciona nodos de inicio y fin para Dijkstra');
      return;
    }

    if (dijkstraConfig.start_id === dijkstraConfig.end_id) {
      setError('Los nodos de inicio y fin deben ser diferentes');
      return;
    }

    try {
      setError('');
      setLoading(prev => ({ ...prev, dijkstra: true }));
      setResults(prev => ({ ...prev, dijkstra: null }));
      
      const result = await algorithmService.dijkstra(
        parseInt(dijkstraConfig.start_id), 
        parseInt(dijkstraConfig.end_id)
      );
      setResults(prev => ({ ...prev, dijkstra: result }));
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      
      // Personalizar mensajes de error para el usuario
      if (errorMessage.includes('No existe una arista o camino') || 
          errorMessage.includes('No path found')) {
        setError('No existe un camino entre los nodos seleccionados. Verifica que ambos nodos estén conectados.');
      } else if (errorMessage.includes('not found')) {
        setError('Uno o ambos nodos seleccionados no existen. Por favor, verifica los IDs.');
      } else {
        setError('Error al calcular el camino mínimo: ' + errorMessage);
      }
    } finally {
      setLoading(prev => ({ ...prev, dijkstra: false }));
    }
  };

  const renderPath = (path) => {
    if (!path || path.length === 0) return 'Sin ruta';
    
    return path.map((nodeId, index) => (
      <span key={nodeId}>
        <span style={{ 
          background: '#e0e7ff', 
          color: '#3730a3', 
          padding: '0.125rem 0.375rem', 
          borderRadius: '0.25rem', 
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {getNodeName(nodeId)} ({nodeId})
        </span>
        {index < path.length - 1 && (
          <span style={{ margin: '0 0.5rem', color: '#6b7280' }}>→</span>
        )}
      </span>
    ));
  };

  const renderBfsResult = () => {
    if (!results.bfs) return null;

    return (
      <div className="card">
        <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem', color: '#059669' }}>
          Resultado BFS (Búsqueda en Anchura)
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
              Nodo inicio:
            </span>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
              {getNodeName(results.bfs.start_node)} (ID: {results.bfs.start_node})
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
              Profundidad máxima:
            </span>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
              {results.bfs.max_depth}
            </p>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
            Nodos visitados:
          </span>
          <div style={{ 
            marginTop: '0.5rem', 
            padding: '0.75rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.375rem' 
          }}>
            {results.bfs.visited_nodes && results.bfs.visited_nodes.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {results.bfs.visited_nodes.map((nodeId) => (
                  <span
                    key={nodeId}
                    style={{
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {getNodeName(nodeId)} ({nodeId})
                  </span>
                ))}
              </div>
            ) : (
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                No se encontraron nodos
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDijkstraResult = () => {
    if (!results.dijkstra) return null;

    return (
      <div className="card">
        <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem', color: '#7c3aed' }}>
          Resultado Dijkstra (Camino Mínimo)
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
              Nodo inicio:
            </span>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
              {getNodeName(results.dijkstra.start_node)} (ID: {results.dijkstra.start_node})
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
              Nodo destino:
            </span>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
              {getNodeName(results.dijkstra.end_node)} (ID: {results.dijkstra.end_node})
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
              Distancia total:
            </span>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', fontWeight: '600' }}>
              {results.dijkstra.distance}
            </p>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
            Camino encontrado:
          </span>
          <div style={{ 
            marginTop: '0.5rem', 
            padding: '0.75rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.375rem' 
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              {renderPath(results.dijkstra.path)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          Algoritmos de Búsqueda
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Ejecutar algoritmos BFS y Dijkstra en el grafo
        </p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {nodes.length === 0 && !loading.nodes ? (
        <div className="alert alert-warning">
          No hay nodos disponibles. Crea algunos nodos primero para usar los algoritmos.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* BFS */}
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem', color: '#059669' }}>
              BFS (Búsqueda en Anchura)
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Explora nodos en forma de árbol hasta cierta profundidad
            </p>
            
            <form onSubmit={handleBfsSearch} className="space-y-4">
              <div>
                <label className="form-label">Nodo de Inicio</label>
                <select
                  value={bfsConfig.start_id}
                  onChange={(e) => setBfsConfig({ ...bfsConfig, start_id: e.target.value })}
                  className="select"
                  required
                  disabled={loading.bfs}
                >
                  <option value="">Seleccionar nodo</option>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name} (ID: {node.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Profundidad Máxima</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={bfsConfig.max_depth}
                  onChange={(e) => setBfsConfig({ ...bfsConfig, max_depth: parseInt(e.target.value) || 1 })}
                  className="input"
                  disabled={loading.bfs}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading.bfs || nodes.length === 0}
                style={{ width: '100%' }}
              >
                {loading.bfs ? 'Ejecutando BFS...' : 'Ejecutar BFS'}
              </button>
            </form>
          </div>

          {/* Dijkstra */}
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem', color: '#7c3aed' }}>
              Dijkstra (Camino Mínimo)
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Encuentra el camino más corto entre dos nodos
            </p>
            
            <form onSubmit={handleDijkstraSearch} className="space-y-4">
              <div>
                <label className="form-label">Nodo de Inicio</label>
                <select
                  value={dijkstraConfig.start_id}
                  onChange={(e) => setDijkstraConfig({ ...dijkstraConfig, start_id: e.target.value })}
                  className="select"
                  required
                  disabled={loading.dijkstra}
                >
                  <option value="">Seleccionar inicio</option>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name} (ID: {node.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Nodo de Destino</label>
                <select
                  value={dijkstraConfig.end_id}
                  onChange={(e) => setDijkstraConfig({ ...dijkstraConfig, end_id: e.target.value })}
                  className="select"
                  required
                  disabled={loading.dijkstra}
                >
                  <option value="">Seleccionar destino</option>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name} (ID: {node.id})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading.dijkstra || nodes.length < 2}
                style={{ width: '100%' }}
              >
                {loading.dijkstra ? 'Ejecutando Dijkstra...' : 'Ejecutar Dijkstra'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="space-y-6">
        {renderBfsResult()}
        {renderDijkstraResult()}
      </div>
    </div>
  );
};

export default AlgorithmsSection;