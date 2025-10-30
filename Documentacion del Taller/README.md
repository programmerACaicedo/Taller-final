# PathFinder - Explorador de Grafos

**PathFinder** es una aplicación web completa para la exploración y análisis de grafos dirigidos con funcionalidades avanzadas de algoritmos de búsqueda. Desarrollado como MVP (Producto Mínimo Viable), permite a los usuarios crear, gestionar y analizar grafos a través de una interfaz web intuitiva con autenticación segura.

## 🎯 Propósito y Contexto

PathFinder está diseñado para resolver problemas de **análisis de rutas y conectividad en grafos**, común en aplicaciones como:

- **Sistemas de navegación y mapas**: Encontrar rutas óptimas entre ciudades
- **Redes de transporte**: Análisis de conectividad y eficiencia de rutas
- **Análisis de redes sociales**: Exploración de conexiones y distancias entre usuarios
- **Sistemas de recomendación**: Búsqueda de elementos relacionados por proximidad
- **Planificación logística**: Optimización de rutas de distribución

## 🚀 Funcionalidades Principales

### 🔐 Sistema de Autenticación
- **Registro y login** de usuarios con validación segura
- **Autenticación JWT** con tokens de 30 minutos de duración
- **Protección de rutas** - acceso restringido a funcionalidades principales
- **Gestión automática de sesiones** con renovación y logout automático

### 📊 Gestión Completa de Grafos
- **CRUD de Nodos**: Crear, listar y eliminar nodos con nombres únicos
- **CRUD de Aristas**: Crear conexiones dirigidas entre nodos con distancias positivos
- **Validaciones automáticas**: Verificación de integridad referencial y unicidad
- **Eliminación en cascada**: Al eliminar un nodo se eliminan todas sus aristas

### 🔍 Algoritmos de Búsqueda Avanzados
- **BFS (Breadth-First Search)**: 
  - Exploración por niveles desde un nodo inicial
  - Control de profundidad máxima configurable
  - Retorna orden de visita y estructura del árbol de búsqueda
- **Dijkstra (Camino Mínimo)**:
  - Encuentra la ruta más corta entre dos nodos específicos
  - Considera distancias de aristas para optimización
  - Garantiza solución óptima en grafos con distancias positivos

### 🎨 Interfaz de Usuario Interactiva
- **Dashboard centralizado** con navegación por pestañas
- **Gestión visual** de nodos y aristas con formularios interactivos
- **Resultados visualizados** de algoritmos con detalles técnicos
- **Feedback en tiempo real** con notificaciones de éxito/error
- **Diseño responsivo** optimizado para diferentes dispositivos

## 📦 Stack Tecnológico

- **Backend**: FastAPI 0.104.1, SQLite, SQLModel 0.0.14, JWT
- **Frontend**: React 19.1.1 con Vite, React Router DOM 7.9.5
- **Autenticación**: python-jose con bcrypt para hashing seguro
- **HTTP Client**: Axios 1.13.1 con interceptores automáticos
- **Base de Datos**: SQLite con migraciones automáticas
- **Estilos**: TailwindCSS 4.1.16 con CSS vanilla como respaldo

## 📁 Estructura del Proyecto

```
Taller_Final/
├── 📋 README.md                    # Documentación principal
├── 📋 DESARROLLO.md                # Guía técnica de desarrollo  
├── 🚀 start.bat                    # Script de inicio automático (Windows)
├── 🚀 start.sh                     # Script de inicio automático (Linux/Mac)
├── 
├── 🔧 backend/                     # API REST con FastAPI
│   ├── 📦 requirements.txt         # Dependencias de Python
│   ├── 🗄️ pathfinder.db            # Base de datos SQLite (generada automáticamente)
│   ├── 
│   ├── 📁 app/                     # Código principal de la aplicación
│   │   ├── 🔧 __init__.py
│   │   ├── 🚀 main.py              # Aplicación FastAPI principal
│   │   ├── 🗄️ database.py          # Configuración de base de datos
│   │   ├── 
│   │   ├── 📁 models/              # Modelos de datos SQLModel
│   │   │   ├── 🔧 __init__.py
│   │   │   └── 📊 models.py        # User, Node, Edge + schemas de request/response
│   │   ├── 
│   │   ├── 📁 routers/             # Endpoints organizados por funcionalidad
│   │   │   ├── 🔧 __init__.py
│   │   │   ├── 🔐 auth.py          # Autenticación (/auth/register, /auth/login, /auth/me)
│   │   │   └── 📊 graph.py         # Gestión de grafos (/graph/nodes, /graph/edges, algoritmos)
│   │   └── 
│   │   └── 📁 services/            # Lógica de negocio
│   │       ├── 🔧 __init__.py
│   │       ├── 🔐 auth.py          # Servicios JWT, hashing, validación
│   │       └── 🔍 algorithms.py    # Implementación BFS y Dijkstra
│   ├── 
│   ├── 📁 data/                    # Datos semilla iniciales
│   │   ├── 📄 nodes.csv            # 20 ciudades españolas
│   │   └── 📄 edges.csv            # 30 rutas con distancias reales
│   └── 
│   └── 📁 scripts/
│       └── 🔄 load_seed.py         # Script idempotente de carga de datos
├── 
└── 🎨 frontend/                    # Aplicación React SPA
    ├── 📦 package.json             # Dependencias de Node.js
    ├── ⚙️ vite.config.js          # Configuración de Vite
    ├── 🎨 tailwind.config.js       # Configuración de TailwindCSS
    ├── 📝 index.html               # Punto de entrada HTML
    ├── 
    ├── 📁 public/                  # Archivos estáticos
    ├── 
    └── 📁 src/                     # Código fuente React
        ├── 🚀 main.jsx             # Punto de entrada de React
        ├── 📱 App.jsx              # Componente principal con routing
        ├── 🎨 App.css              # Estilos globales
        ├── 🎨 index.css            # Estilos base y TailwindCSS
        ├── 
        ├── 📁 components/          # Componentes React reutilizables
        │   ├── 🔐 Login.jsx        # Formulario de login/registro
        │   ├── 🏠 Dashboard.jsx    # Dashboard principal con navegación
        │   ├── 🛡️ ProtectedRoute.jsx # Protección de rutas autenticadas
        │   ├── 📊 NodesSection.jsx # Gestión de nodos del grafo
        │   ├── 🔗 EdgesSection.jsx # Gestión de aristas del grafo
        │   └── 🔍 AlgorithmsSection.jsx # Interfaz para BFS y Dijkstra
        ├── 
        ├── 📁 context/             # Context API de React
        │   └── 🔐 AuthContext.jsx  # Gestión global del estado de autenticación
        ├── 
        ├── 📁 services/            # Servicios de comunicación con API
        │   └── 🌐 api.js           # Cliente HTTP con Axios + interceptores
        └── 
        └── 📁 assets/              # Recursos estáticos (imágenes, iconos)
```

## 🔌 API Endpoints Detallada

### 🔐 Autenticación (`/auth`)
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Registro de nuevo usuario | ❌ No |
| `POST` | `/auth/login` | Inicio de sesión con JWT | ❌ No |
| `GET` | `/auth/me` | Información del usuario actual | ✅ JWT |

**Ejemplo de registro:**
```json
POST /auth/register
{
  "username": "usuario123",
  "password": "mi_password_seguro"
}
```

### 📊 Gestión de Grafo (`/graph`)
Todos los endpoints requieren autenticación JWT

#### 🔵 Nodos
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/graph/nodes` | Listar todos los nodos | - |
| `POST` | `/graph/nodes` | Crear nuevo nodo | `name` (string, único) |
| `DELETE` | `/graph/nodes/{id}` | Eliminar nodo + aristas conectadas | `id` (path parameter) |

#### 🔗 Aristas  
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/graph/edges` | Listar todas las aristas | - |
| `POST` | `/graph/edges` | Crear nueva arista dirigida | `src_id`, `dst_id`, `weight` (>0) |
| `DELETE` | `/graph/edges/{id}` | Eliminar arista | `id` (path parameter) |

#### 🔍 Algoritmos
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/graph/bfs` | Búsqueda en anchura (BFS) | `start_id` (requerido), `max_depth` (opcional) |
| `GET` | `/graph/shortest-path` | Camino mínimo (Dijkstra) | `src_id`, `dst_id` (ambos requeridos) |

**Ejemplo BFS:**
```json
GET /graph/bfs?start_id=1&max_depth=3
{
  "visited_nodes": [1, 2, 3, 5, 7],
  "start_node": 1,
  "max_depth": 3
}
```

**Ejemplo Dijkstra:**
```json
GET /graph/shortest-path?src_id=1&dst_id=5
{
  "path": [1, 2, 4, 5],
  "distance": 125.7,
  "start_node": 1,
  "end_node": 5
}
```

## ⚡ Instalación y Ejecución Rápida

### 🛠️ Requisitos Previos
- **Python 3.8+** (recomendado 3.10+)
- **Node.js 16+** con npm
- **Git** (para clonar el repositorio)

### 🚀 Inicio Automático (Recomendado)

#### En Windows:
```cmd
# Desde el directorio raíz del proyecto
.\start.bat
```

#### En Linux/Mac:
```bash
# Desde el directorio raíz del proyecto
chmod +x start.sh
./start.sh
```

El script automático:
1. ✅ Verifica la estructura del proyecto
2. 📦 Carga datos iniciales en la base de datos
3. 🚀 Inicia el backend en http://localhost:8000
4. 🌐 Inicia el frontend en http://localhost:5173
5. 📊 Muestra enlaces útiles (API docs, aplicación)

### 🔧 Instalación Manual

#### Backend (FastAPI)
```bash
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requirements.txt

# Cargar datos iniciales (ejecutar una sola vez)
python scripts/load_seed.py

# Ejecutar servidor de desarrollo
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend (React + Vite)
```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

### 🔗 URLs de Acceso
- **🌐 Aplicación Web**: http://localhost:5173
- **📡 API Backend**: http://localhost:8000  
- **📖 Documentación API**: http://localhost:8000/docs
- **📚 Redoc**: http://localhost:8000/redoc
- **❤️ Health Check**: http://localhost:8000/health

## ⚙️ Configuración

### 🔐 Variables de Entorno

#### Backend (crear `backend/.env`)
```bash
# Seguridad JWT - ¡CAMBIAR EN PRODUCCIÓN!
SECRET_KEY=tu_secreto_super_seguro_aqui_cambiar_en_produccion_2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Base de datos
DATABASE_URL=sqlite:///./pathfinder.db

# CORS (opcional)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Frontend (crear `frontend/.env`)
```bash
# URL del backend
VITE_API_URL=http://localhost:8000

# Configuración adicional
VITE_APP_NAME=PathFinder
VITE_APP_VERSION=1.0.0
```

### 🏗️ Datos Iniciales

El proyecto incluye datos semilla con **20 ciudades españolas** y **30 rutas reales**:

**Ciudades incluidas:** Madrid, Barcelona, Valencia, Sevilla, Bilbao, Zaragoza, Málaga, Murcia, Palma, Las Palmas, Valladolid, Córdoba, Vigo, Gijón, Santander, Alicante, Granada, Vitoria, Badajoz, Salamanca.

**Rutas:** Conexiones dirigidas con distancias reales en kilómetros entre ciudades principales.

El script `load_seed.py` es **idempotente** - puede ejecutarse múltiples veces sin duplicar datos.

## 💻 Guía de Uso de la Aplicación

### 1️⃣ **Acceso y Autenticación**
1. Abrir http://localhost:5173 en el navegador
2. **Registrarse**: Crear una cuenta nueva con username y password
3. **Iniciar sesión**: Usar las credenciales para obtener acceso
4. El sistema mantiene la sesión activa por 30 minutos

### 2️⃣ **Gestión de Nodos**
- **Crear nodo**: Introducir nombre único en el formulario
- **Ver nodos**: Lista completa de nodos existentes con IDs
- **Eliminar nodo**: Click en "Eliminar" (⚠️ elimina también todas las aristas conectadas)

### 3️⃣ **Gestión de Aristas**  
- **Crear arista**: Seleccionar nodo origen, destino y Distancia(>0)
- **Ver aristas**: Lista de todas las conexiones con origen → destino
- **Eliminar arista**: Click en "Eliminar" para una conexión específica

### 4️⃣ **Ejecutar Algoritmos**

#### 🔍 BFS (Búsqueda en Anchura)
- Seleccionar **nodo de inicio** 
- Configurar **profundidad máxima** (opcional)
- Resultado: Lista de nodos visitados en orden de exploración

#### 🛣️ Dijkstra (Camino Mínimo)
- Seleccionar **nodo origen** y **nodo destino**
- Resultado: Ruta más corta y distancia total

### 5️⃣ **Navegación**
- **Dashboard**: Vista principal con pestañas
- **Pestañas**: Nodos, Aristas, Algoritmos
- **Logout**: Cerrar sesión desde el header

## 🧪 Pruebas y Testing

### 🔧 Testing con cURL

#### Flujo completo de autenticación y uso:

```bash
# 1. Registro de usuario
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# 2. Login y obtener token
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' | \
  jq -r .access_token)

echo "Token obtenido: $TOKEN"

# 3. Verificar usuario actual
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/auth/me

# 4. Crear nodo
curl -X POST http://localhost:8000/graph/nodes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ciudad Prueba"}'

# 5. Listar nodos
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/graph/nodes

# 6. Crear arista (usando IDs de nodos existentes)
curl -X POST http://localhost:8000/graph/edges \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"src_id":1,"dst_id":2,"weight":100.5}'

# 7. Ejecutar BFS desde nodo 1
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/graph/bfs?start_id=1&max_depth=3"

# 8. Ejecutar Dijkstra entre nodos 1 y 3
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/graph/shortest-path?src_id=1&dst_id=3"
```

### 🐛 Casos de Prueba de Error

```bash
# Error 401: Sin autenticación
curl http://localhost:8000/graph/nodes

# Error 400: Nodo duplicado
curl -X POST http://localhost:8000/graph/nodes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Madrid"}'  # Ya existe en datos semilla

# Error 404: Nodo no encontrado para BFS
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/graph/bfs?start_id=999"

# Error 404: Sin camino en Dijkstra
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/graph/shortest-path?src_id=1&dst_id=999"
```

### 📊 Testing de Performance

```bash
# Verificar tiempo de respuesta
time curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/graph/bfs?start_id=1"

# Health check
curl http://localhost:8000/health
```

## 🏗️ Arquitectura y Decisiones Técnicas

### 🎯 Decisiones de Diseño

#### **Grafo Dirigido**
- Las aristas tienen **dirección específica** (src → dst)
- Permite modelar rutas unidireccionales (calles de una vía, flujos de red)
- Algoritmos optimizados para grafos dirigidos

#### **distancias Positivos**
- **Validación estricta** de Distancia> 0 para todas las aristas
- Garantiza compatibilidad con **algoritmo de Dijkstra**
- Representa distancias, costos o tiempos realistas

#### **Autenticación JWT**
- **Tokens stateless** con expiración de 30 minutos
- **bcrypt** para hashing seguro de contraseñas
- **Interceptores automáticos** en frontend para renovación

#### **Base de Datos Relacional**
- **SQLite** para simplicidad en desarrollo y demo
- **SQLModel** para type safety y validaciones automáticas
- **Migraciones automáticas** en startup

#### **SPA con React**
- **Aplicación de una sola página** con routing client-side
- **Context API** para gestión global de estado de autenticación
- **Componentes reutilizables** con separación de responsabilidades

### 🔧 Patrones Implementados

#### Backend (FastAPI)
- **Repository Pattern**: Separación de lógica de acceso a datos
- **Service Layer**: Lógica de negocio separada de controladores
- **Dependency Injection**: Gestión automática de dependencias
- **Error Handling**: Manejo consistente de errores HTTP

#### Frontend (React)
- **Component Composition**: Componentes pequeños y reutilizables
- **Custom Hooks**: Lógica reutilizable (useAuth)
- **Service Layer**: Abstracción de llamadas API
- **Protected Routes**: Control de acceso basado en autenticación

### 📊 Algoritmos Implementados

#### **BFS (Breadth-First Search)**
- **Complejidad**: O(V + E) donde V=nodos, E=aristas
- **Uso**: Exploración por niveles, encontrar componentes conectados
- **Optimización**: Control de profundidad para grafos grandes

#### **Dijkstra (Shortest Path)**
- **Complejidad**: O((V + E) log V) con heap binario
- **Uso**: Camino mínimo en grafos con distancias positivos
- **Garantía**: Solución óptima global

### 🚀 Optimizaciones de Performance

- **Lazy Loading**: Carga de datos bajo demanda
- **Memoización**: Cache de resultados de algoritmos
- **Interceptores HTTP**: Manejo automático de tokens
- **Validación client-side**: Reducción de llamadas innecesarias

## 🔮 Extensiones Futuras

### 🚀 Funcionalidades Planeadas

#### **Algoritmos Avanzados**
- **A* (A-Star)**: Búsqueda heurística para grafos con coordenadas
- **Floyd-Warshall**: Todos los caminos mínimos entre todos los pares
- **Kruskal/Prim**: Árboles de expansión mínima
- **Detección de ciclos**: Análisis de ciclos en grafos dirigidos

#### **Visualización Interactiva**
- **Canvas 2D/WebGL**: Renderizado de grafos con D3.js o Three.js
- **Drag & Drop**: Manipulación visual de nodos
- **Animaciones**: Visualización paso a paso de algoritmos
- **Layouts automáticos**: Force-directed, circular, hierarchical

#### **Gestión Avanzada de Datos**
- **Importación masiva**: CSV, JSON, GraphML
- **Exportación**: Múltiples formatos (DOT, GEXF, JSON)
- **Versionado**: Historial de cambios en el grafo
- **Backup/Restore**: Snapshots de grafos

#### **Performance y Escalabilidad**
- **PostgreSQL**: Migración para grafos grandes (>10K nodos)
- **Redis**: Cache de resultados de algoritmos costosos
- **Paginación**: Manejo eficiente de listados grandes
- **GraphQL**: API más eficiente para consultas complejas

#### **Colaboración y Productividad**
- **Multi-usuario**: Grafos compartidos entre usuarios
- **Comentarios**: Anotaciones en nodos y aristas  
- **Templates**: Grafos predefinidos (redes sociales, mapas, etc.)
- **API pública**: Integración con sistemas externos

### 🛠️ Mejoras Técnicas

#### **DevOps y Deployment**
- **Docker**: Containerización completa
- **CI/CD**: Pipeline automatizado con GitHub Actions
- **Testing**: Suite completa de tests unitarios e integración
- **Monitoring**: Métricas y logging con Prometheus/Grafana

#### **Seguridad**
- **OAuth2**: Integración con Google, GitHub, Microsoft
- **RBAC**: Control de acceso basado en roles
- **Rate Limiting**: Protección contra ataques
- **Audit Logs**: Trazabilidad de cambios

#### **UX/UI**
- **PWA**: Aplicación web progresiva offline-first
- **Temas**: Modo oscuro/claro
- **Internacionalización**: Soporte multi-idioma
- **Accesibilidad**: WCAG 2.1 compliance

## 📚 Recursos Adicionales

### 📖 Documentación Técnica
- **DESARROLLO.md**: Guía detallada para desarrolladores
- **API Docs**: http://localhost:8000/docs (Swagger)
- **Redoc**: http://localhost:8000/redoc (Documentación alternativa)

### 🧑‍💻 Para Desarrolladores
```bash
# Análisis de código
cd backend && python -m pytest
cd frontend && npm run lint

# Construcción para producción  
cd frontend && npm run build
```

### 🏫 Contexto Académico
Este proyecto ha sido desarrollado como parte del **Taller de Desarrollo de Software** con enfoque en:
- Arquitecturas web modernas (REST API + SPA)
- Algoritmos de grafos aplicados
- Patrones de diseño en aplicaciones full-stack
- Buenas prácticas de desarrollo y documentación

## 📅 Entrega
**Fecha límite**: Martes, 4 de noviembre de 2025, 23:59

---

⭐ **PathFinder** - Explorando rutas, conectando nodos, encontrando caminos ⭐