from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class VendorBase(BaseModel):
    vendor_name: str
    item_name: Optional[str] = None
    location: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class VendorResponse(VendorBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class VendorList(BaseModel):
    vendors: List[VendorResponse]

class VendorRequest(BaseModel):
    item: str
    location: str
