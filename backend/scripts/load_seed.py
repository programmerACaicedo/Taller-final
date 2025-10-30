"""
Script para cargar datos semilla desde archivos CSV de forma idempotente.
Este script puede ejecutarse múltiples veces sin duplicar datos.
"""

import csv
import os
import sys
from pathlib import Path

# Agregar el directorio padre al path para importar módulos de la app
sys.path.append(str(Path(__file__).parent.parent))

from app.database import create_db_and_tables, get_session
from app.models.models import Node, Edge
from sqlmodel import select


def load_nodes_from_csv(session, csv_file_path: str):
    """Cargar nodos desde archivo CSV"""
    nodes_loaded = 0
    nodes_skipped = 0
    
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        
        for row in reader:
            if not row or not row[0].strip():  # Saltar filas vacías
                continue
                
            node_name = row[0].strip()
            
            # Verificar si el nodo ya existe
            statement = select(Node).where(Node.name == node_name)
            existing_node = session.exec(statement).first()
            
            if existing_node:
                nodes_skipped += 1
                print(f"  - Nodo '{node_name}' ya existe, saltando...")
                continue
            
            # Crear nuevo nodo
            new_node = Node(name=node_name)
            session.add(new_node)
            nodes_loaded += 1
            print(f"  + Nodo '{node_name}' creado")
    
    session.commit()
    return nodes_loaded, nodes_skipped


def load_edges_from_csv(session, csv_file_path: str):
    """Cargar aristas desde archivo CSV"""
    edges_loaded = 0
    edges_skipped = 0
    edges_error = 0
    
    # Crear un mapeo de nombres de nodos a IDs
    nodes_statement = select(Node)
    nodes = session.exec(nodes_statement).all()
    name_to_id = {node.name: node.id for node in nodes}
    
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            src_name = row['src_name'].strip()
            dst_name = row['dst_name'].strip()
            
            try:
                weight = float(row['weight'])
            except ValueError:
                print(f"  ! Error: peso inválido en arista {src_name} -> {dst_name}")
                edges_error += 1
                continue
            
            # Verificar que los nodos existen
            if src_name not in name_to_id:
                print(f"  ! Error: nodo origen '{src_name}' no encontrado")
                edges_error += 1
                continue
                
            if dst_name not in name_to_id:
                print(f"  ! Error: nodo destino '{dst_name}' no encontrado")
                edges_error += 1
                continue
            
            src_id = name_to_id[src_name]
            dst_id = name_to_id[dst_name]
            
            # Verificar si la arista ya existe
            statement = select(Edge).where(
                (Edge.src_id == src_id) & 
                (Edge.dst_id == dst_id)
            )
            existing_edge = session.exec(statement).first()
            
            if existing_edge:
                edges_skipped += 1
                print(f"  - Arista {src_name} -> {dst_name} ya existe, saltando...")
                continue
            
            # Crear nueva arista
            new_edge = Edge(src_id=src_id, dst_id=dst_id, weight=weight)
            session.add(new_edge)
            edges_loaded += 1
            print(f"  + Arista {src_name} -> {dst_name} (peso: {weight}) creada")
    
    session.commit()
    return edges_loaded, edges_skipped, edges_error


def main():
    """Función principal del script"""
    print("=== PathFinder - Carga de Datos Semilla ===\n")
    
    # Crear base de datos y tablas
    print("1. Creando base de datos y tablas...")
    create_db_and_tables()
    print("   ✓ Base de datos inicializada\n")
    
    # Definir rutas de archivos CSV
    current_dir = Path(__file__).parent
    data_dir = current_dir.parent / "data"
    nodes_csv = data_dir / "nodes.csv"
    edges_csv = data_dir / "edges.csv"
    
    # Verificar que los archivos existen
    if not nodes_csv.exists():
        print(f"❌ Error: No se encontró el archivo {nodes_csv}")
        return
        
    if not edges_csv.exists():
        print(f"❌ Error: No se encontró el archivo {edges_csv}")
        return
    
    # Obtener sesión de base de datos
    session_generator = get_session()
    session = next(session_generator)
    
    try:
        # Cargar nodos
        print("2. Cargando nodos...")
        nodes_loaded, nodes_skipped = load_nodes_from_csv(session, str(nodes_csv))
        print(f"   ✓ Nodos procesados: {nodes_loaded} nuevos, {nodes_skipped} existentes\n")
        
        # Cargar aristas
        print("3. Cargando aristas...")
        edges_loaded, edges_skipped, edges_error = load_edges_from_csv(session, str(edges_csv))
        print(f"   ✓ Aristas procesadas: {edges_loaded} nuevas, {edges_skipped} existentes, {edges_error} errores\n")
        
        # Resumen final
        print("=== Resumen de Carga ===")
        print(f"Nodos: {nodes_loaded} nuevos, {nodes_skipped} ya existían")
        print(f"Aristas: {edges_loaded} nuevas, {edges_skipped} ya existían, {edges_error} con errores")
        print("\n✅ Carga de datos completada exitosamente!")
        
    except Exception as e:
        print(f"❌ Error durante la carga: {e}")
        session.rollback()
    finally:
        session.close()


if __name__ == "__main__":
    main()