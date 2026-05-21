"""
init_db.py — One-shot database initialisation script.

Usage:
    venv/bin/python3 init_db.py

For PostgreSQL:  Creates the target database if it doesn't exist, then
                 creates all SQLAlchemy-mapped tables.
For SQLite:      Just creates all tables (the DB file is created
                 automatically by SQLAlchemy).
"""
import asyncio
from app.core.config import settings
from app.db.database import engine, Base
from app.models.vendor import Vendor  # noqa: F401  — registers model with Base metadata


async def _create_postgres_database_if_missing() -> None:
    """
    Connect to the default 'postgres' system DB and create the target
    database if it doesn't already exist.  Only called for PostgreSQL URLs.
    """
    import asyncpg
    from urllib.parse import urlparse, urlunparse

    url_str = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    parsed = urlparse(url_str)
    dbname = parsed.path.lstrip("/")

    # Connect to the maintenance 'postgres' database to issue CREATE DATABASE
    postgres_url = urlunparse(parsed._replace(path="/postgres"))

    conn = await asyncpg.connect(postgres_url)
    try:
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", dbname
        )
        if not exists:
            # CREATE DATABASE cannot run inside a transaction; asyncpg
            # does not use a transaction by default, so this is safe.
            await conn.execute(f'CREATE DATABASE "{dbname}"')
            print(f"  ✓ Database '{dbname}' created.")
        else:
            print(f"  ✓ Database '{dbname}' already exists.")
    finally:
        await conn.close()


async def init_models() -> None:
    db_url = settings.DATABASE_URL

    if "postgresql" in db_url:
        print("→ Ensuring PostgreSQL database exists …")
        await _create_postgres_database_if_missing()
    else:
        print("→ SQLite mode — database file will be created automatically.")

    print("→ Creating tables …")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("  ✓ All tables ready.")


if __name__ == "__main__":
    asyncio.run(init_models())
