from collections import deque, defaultdict
import heapq
from typing import Dict, List, Optional, Tuple
from sqlmodel import Session, select
from ..models.models import Node, Edge


def build_graph(session: Session) -> Dict[int, List[Tuple[int, float]]]:
    """Construir grafo como lista de adyacencia desde la base de datos"""
    graph = defaultdict(list)
    
    # Obtener todas las aristas
    statement = select(Edge)
    edges = session.exec(statement).all()
    
    for edge in edges:
        graph[edge.src_id].append((edge.dst_id, edge.weight))
    
    return dict(graph)


def bfs_algorithm(session: Session, start_id: int, max_depth: int = None) -> dict:
    """
    Algoritmo BFS que retorna el orden de visita y los nodos visitados
    """
    # Verificar que el nodo de inicio existe
    node_statement = select(Node).where(Node.id == start_id)
    start_node = session.exec(node_statement).first()
    if not start_node:
        raise ValueError(f"Node with id {start_id} not found")
    
    graph = build_graph(session)
    
    # Inicializar estructuras
    visited = set()
    queue = deque([(start_id, None, 0)])  # (node_id, parent_id, depth)
    visited_nodes = []
    
    while queue:
        current_id, parent_id, depth = queue.popleft()
        
        if current_id in visited:
            continue
        
        # Respetar la profundidad máxima si se especifica
        if max_depth is not None and depth > max_depth:
            continue
            
        visited.add(current_id)
        visited_nodes.append(current_id)
        
        # Agregar vecinos no visitados a la cola
        if current_id in graph:
            for neighbor_id, _ in graph[current_id]:
                if neighbor_id not in visited:
                    queue.append((neighbor_id, current_id, depth + 1))
    
    return {
        "visited_nodes": visited_nodes,
        "start_node": start_id,
        "max_depth": max_depth if max_depth is not None else -1
    }


def dijkstra_algorithm(session: Session, src_id: int, dst_id: int) -> dict:
    """
    Algoritmo de Dijkstra para encontrar el camino más corto
    """
    # Verificar que los nodos existen
    src_statement = select(Node).where(Node.id == src_id)
    dst_statement = select(Node).where(Node.id == dst_id)
    
    src_node = session.exec(src_statement).first()
    dst_node = session.exec(dst_statement).first()
    
    if not src_node:
        raise ValueError(f"Source node with id {src_id} not found")
    if not dst_node:
        raise ValueError(f"Destination node with id {dst_id} not found")
    
    graph = build_graph(session)
    
    # Inicializar distancias y predecesores
    distances = {src_id: 0}
    predecessors = {}
    visited = set()
    
    # Cola de prioridad: (distancia, nodo_id)
    pq = [(0, src_id)]
    
    while pq:
        current_dist, current_id = heapq.heappop(pq)
        
        if current_id in visited:
            continue
            
        visited.add(current_id)
        
        # Si llegamos al destino, reconstruir el camino
        if current_id == dst_id:
            path = []
            node = dst_id
            while node is not None:
                path.append(node)
                node = predecessors.get(node)
            path.reverse()
            
            return {
                "path": path,
                "distance": distances[dst_id],
                "start_node": src_id,
                "end_node": dst_id
            }
        
        # Explorar vecinos
        if current_id in graph:
            for neighbor_id, weight in graph[current_id]:
                if neighbor_id not in visited:
                    new_dist = current_dist + weight
                    
                    if neighbor_id not in distances or new_dist < distances[neighbor_id]:
                        distances[neighbor_id] = new_dist
                        predecessors[neighbor_id] = current_id
                        heapq.heappush(pq, (new_dist, neighbor_id))
    
    # No se encontró camino - no existe una ruta entre los nodos
    raise ValueError(f"No existe una arista o camino entre los nodos {src_id} y {dst_id}. Verifica que ambos nodos estén conectados en el grafo.")


def get_all_nodes(session: Session) -> List[Node]:
    """Obtener todos los nodos"""
    statement = select(Node)
    return list(session.exec(statement).all())


def get_all_edges(session: Session) -> List[Edge]:
    """Obtener todas las aristas"""
    statement = select(Edge)
    return list(session.exec(statement).all())