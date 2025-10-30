from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables
from .routers import auth, graph

# Crear aplicación FastAPI
app = FastAPI(
    title="PathFinder API",
    description="API para explorar rutas en grafos con autenticación JWT",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router)
app.include_router(graph.router)


@app.on_event("startup")
def on_startup():
    """Eventos de inicio de la aplicación"""
    create_db_and_tables()


@app.get("/")
def read_root():
    """Endpoint raíz"""
    return {
        "message": "PathFinder API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """Endpoint de verificación de salud"""
    return {"status": "healthy"}