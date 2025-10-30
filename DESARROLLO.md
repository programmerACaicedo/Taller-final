# PathFinder - Guía de Desarrollo

## Arquitectura del Proyecto

### Backend (FastAPI)
- **Autenticación**: JWT con bcrypt para hashing de contraseñas
- **Base de datos**: SQLite con SQLModel (ORM)
- **Validación**: Pydantic para validación de datos
- **API REST**: Endpoints organizados por funcionalidad

### Frontend (React + Vite)
- **Autenticación**: Contexto React con localStorage
- **Routing**: React Router con protección de rutas
- **HTTP Client**: Axios con interceptores automáticos
- **UI**: TailwindCSS para estilos

## Estructura de la Base de Datos

### Tabla Users
```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL
);
```

### Tabla Nodes
```sql
CREATE TABLE node (
    id INTEGER PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
);
```

### Tabla Edges
```sql
CREATE TABLE edge (
    id INTEGER PRIMARY KEY,
    src_id INTEGER NOT NULL,
    dst_id INTEGER NOT NULL,
    weight FLOAT NOT NULL,
    FOREIGN KEY(src_id) REFERENCES node(id),
    FOREIGN KEY(dst_id) REFERENCES node(id)
);
```

## Algoritmos Implementados

### BFS (Breadth-First Search)
```python
def bfs_algorithm(session: Session, start_id: int) -> dict:
    # Retorna:
    # {
    #   "order": [1, 2, 5, 3],  # Orden de visita
    #   "tree": [
    #     {"node_id": 1, "parent_id": null, "depth": 0},
    #     {"node_id": 2, "parent_id": 1, "depth": 1}
    #   ]
    # }
```

### Dijkstra
```python
def dijkstra_algorithm(session: Session, src_id: int, dst_id: int) -> dict:
    # Retorna:
    # {
    #   "path": [1, 5, 7, 9],    # Camino más corto
    #   "distance": 42.0         # Distancia total
    # }
```

## Flujo de Autenticación

1. **Registro**: POST `/auth/register` con username/password
2. **Login**: POST `/auth/login` retorna JWT token
3. **Acceso protegido**: Header `Authorization: Bearer <token>`
4. **Validación**: Middleware verifica token en cada request
5. **Expiración**: Token válido por 30 minutos

## Manejo de Errores

### Backend
- `400 Bad Request`: Datos inválidos o violación de reglas de negocio
- `401 Unauthorized`: Token inválido o expirado
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Error de validación de Pydantic

### Frontend
- Interceptor axios maneja 401 automáticamente
- Redirección a login si token expira
- Mensajes de error visibles al usuario

## Datos de Prueba

El script `load_seed.py` carga 20 ciudades españolas y 30 conexiones:

```csv
# nodes.csv
Madrid
Barcelona
Valencia
Sevilla
...

# edges.csv
src_name,dst_name,weight
Madrid,Barcelona,620.5
Madrid,Valencia,350.8
...
```

## Comandos Útiles

### Desarrollo Backend
```bash
# Instalar dependencias
pip install -r requirements.txt

# Cargar datos (idempotente)
python scripts/load_seed.py

# Ejecutar con reload automático
uvicorn app.main:app --reload

# Ver logs detallados
uvicorn app.main:app --reload --log-level debug
```

### Desarrollo Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Testing Manual

### Flujo Completo
1. Registrar usuario en `/login`
2. Iniciar sesión
3. Crear algunos nodos en pestaña "Nodos"
4. Crear aristas entre nodos en pestaña "Aristas"
5. Ejecutar BFS desde un nodo en pestaña "Algoritmos"
6. Ejecutar Dijkstra entre dos nodos conectados

### API Testing con cURL
```bash
# Variables
API_URL="http://localhost:8000"
USERNAME="testuser"
PASSWORD="testpass"

# Registro
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}"

# Login y capturar token
TOKEN=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" \
  | jq -r .access_token)

# Usar token en requests
curl -H "Authorization: Bearer $TOKEN" $API_URL/auth/me
```

## Posibles Mejoras (Extras)

1. **Visualización del Grafo**: Librería como D3.js o Cytoscape.js
2. **Export de Resultados**: Descargar resultados en JSON/CSV
3. **Historial de Búsquedas**: Guardar y revisar búsquedas anteriores
4. **Tests Automatizados**: pytest para backend, Jest para frontend
5. **Validación Avanzada**: Detección de ciclos, componentes conectados
6. **WebSocket**: Actualizaciones en tiempo real
7. **Dockerización**: Containers para desarrollo y producción

## Troubleshooting

### Error: ModuleNotFoundError
```bash
# Verificar que estás en el directorio correcto
cd backend
python -c "import app.main"
```

### Error: CORS
- Verificar que el frontend está en puerto 5173
- Comprobar configuración en `app/main.py`

### Error: 401 en requests
- Verificar que el token no ha expirado
- Comprobar formato del header: `Bearer <token>`

### Error: Base de datos
```bash
# Regenerar base de datos
rm backend/pathfinder.db
python backend/scripts/load_seed.py
```