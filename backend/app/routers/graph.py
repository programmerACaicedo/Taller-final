from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from ..database import get_session
from ..models.models import Node, Edge, NodeCreate, EdgeCreate, BFSResponse, DijkstraResponse, User
from ..routers.auth import get_current_user
from ..services.algorithms import bfs_algorithm, dijkstra_algorithm

router = APIRouter(prefix="/graph", tags=["Graph"], dependencies=[Depends(get_current_user)])


# Endpoints para Nodos
@router.post("/nodes", response_model=Node, status_code=status.HTTP_201_CREATED)
async def create_node(
    node_data: NodeCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Crear un nuevo nodo"""
    # Verificar si el nombre ya existe
    statement = select(Node).where(Node.name == node_data.name)
    existing_node = session.exec(statement).first()
    
    if existing_node:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Node with name '{node_data.name}' already exists"
        )
    
    db_node = Node(name=node_data.name)
    session.add(db_node)
    session.commit()
    session.refresh(db_node)
    
    return db_node


@router.get("/nodes", response_model=List[Node])
async def get_nodes(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Obtener todos los nodos"""
    statement = select(Node)
    nodes = session.exec(statement).all()
    return list(nodes)


@router.delete("/nodes/{node_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_node(
    node_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Eliminar un nodo y todas sus aristas incidentes"""
    # Verificar que el nodo existe
    node_statement = select(Node).where(Node.id == node_id)
    node = session.exec(node_statement).first()
    
    if not node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Node with id {node_id} not found"
        )
    
    # Eliminar todas las aristas que involucran este nodo
    edges_statement = select(Edge).where(
        (Edge.src_id == node_id) | (Edge.dst_id == node_id)
    )
    edges = session.exec(edges_statement).all()
    
    for edge in edges:
        session.delete(edge)
    
    # Eliminar el nodo
    session.delete(node)
    session.commit()


# Endpoints para Aristas
@router.post("/edges", response_model=Edge, status_code=status.HTTP_201_CREATED)
async def create_edge(
    edge_data: EdgeCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Crear una nueva arista"""
    # Verificar que los nodos existen
    src_statement = select(Node).where(Node.id == edge_data.src_id)
    dst_statement = select(Node).where(Node.id == edge_data.dst_id)
    
    src_node = session.exec(src_statement).first()
    dst_node = session.exec(dst_statement).first()
    
    if not src_node:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Source node with id {edge_data.src_id} not found"
        )
    
    if not dst_node:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Destination node with id {edge_data.dst_id} not found"
        )
    
    # Crear la arista
    db_edge = Edge(
        src_id=edge_data.src_id,
        dst_id=edge_data.dst_id,
        weight=edge_data.weight
    )
    
    session.add(db_edge)
    session.commit()
    session.refresh(db_edge)
    
    return db_edge


@router.get("/edges", response_model=List[Edge])
async def get_edges(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Obtener todas las aristas"""
    statement = select(Edge)
    edges = session.exec(statement).all()
    return list(edges)


@router.delete("/edges/{edge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_edge(
    edge_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Eliminar una arista"""
    statement = select(Edge).where(Edge.id == edge_id)
    edge = session.exec(statement).first()
    
    if not edge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Edge with id {edge_id} not found"
        )
    
    session.delete(edge)
    session.commit()


# Endpoints para Algoritmos
@router.get("/bfs", response_model=BFSResponse)
async def bfs_search(
    start_id: int = Query(..., description="ID del nodo de inicio"),
    max_depth: int = Query(None, description="Profundidad máxima de búsqueda"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Ejecutar búsqueda BFS desde un nodo de inicio"""
    try:
        result = bfs_algorithm(session, start_id, max_depth)
        return BFSResponse(**result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/shortest-path", response_model=DijkstraResponse)
async def shortest_path(
    src_id: int = Query(..., description="ID del nodo origen"),
    dst_id: int = Query(..., description="ID del nodo destino"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Encontrar el camino más corto entre dos nodos usando Dijkstra"""
    try:
        result = dijkstra_algorithm(session, src_id, dst_id)
        return DijkstraResponse(**result)
    except ValueError as e:
        error_msg = str(e)
        if "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg
            )
        elif "no existe una arista o camino" in error_msg.lower() or "no path found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No existe un camino entre los nodos {src_id} y {dst_id}. Verifica que ambos nodos estén conectados por aristas."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )