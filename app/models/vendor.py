from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, index=True)
    location = Column(String, index=True)
    vendor_name = Column(String, nullable=False)
    address = Column(String)
    phone = Column(String)
    email = Column(String)
    website = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
