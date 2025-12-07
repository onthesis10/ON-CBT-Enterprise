from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# STRATEGI DATABASE:
# 1. Coba cari settingan PostgreSQL di environment variable (buat Production nanti)
# 2. Kalau gak ada, otomatis pakai SQLite (buat Development di laptop kamu biar gampang)

# Cek apakah ada URL database Postgres?
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Kalau gak ada (lokal), kita pakai SQLite
    # file 'oncbt.db' bakal muncul otomatis di folder backend
    DATABASE_URL = "sqlite:///./oncbt.db"
    
    # Khusus SQLite butuh setting ini biar bisa multithread di FastAPI
    connect_args = {"check_same_thread": False}
    print("⚠️  Mode Development: Menggunakan Database SQLite (oncbt.db)")
else:
    # Kalau ada (Production), pakai settingan Postgres
    connect_args = {}
    print("🚀 Mode Production: Menggunakan Database PostgreSQL")

# 1. Buat Engine (Mesin Database)
engine = create_engine(
    DATABASE_URL, 
    connect_args=connect_args
)

# 2. Buat Session (Sesi komunikasi ke DB)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Base Model (Cetakan dasar untuk tabel-tabel nanti)
Base = declarative_base()

# Dependency Injection (Fungsi pembantu buat ambil koneksi di tiap request API)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()