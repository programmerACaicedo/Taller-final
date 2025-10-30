from sqlmodel import SQLModel, Field
from typing import Optional


class User(SQLModel, table=True):
    """Modelo para usuarios del sistema"""
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str


class Node(SQLModel, table=True):
    """Modelo para nodos del grafo"""
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)


class Edge(SQLModel, table=True):
    """Modelo para aristas del grafo"""
    id: Optional[int] = Field(default=None, primary_key=True)
    src_id: int = Field(foreign_key="node.id")
    dst_id: int = Field(foreign_key="node.id")
    weight: float = Field(gt=0)  # weight > 0


# Schemas para requests y responses
class UserCreate(SQLModel):
    username: str
    password: str


class UserResponse(SQLModel):
    id: int
    username: str


class Token(SQLModel):
    access_token: str
    token_type: str


class NodeCreate(SQLModel):
    name: str


class EdgeCreate(SQLModel):
    src_id: int
    dst_id: int
    weight: float = Field(gt=0)


class BFSResponse(SQLModel):
    visited_nodes: list[int]
    start_node: int
    max_depth: int


class DijkstraResponse(SQLModel):
    path: list[int]
    distance: float
    start_node: int
    end_node: int