from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.vendor import Vendor
from app.schemas.vendor_schema import VendorCreate
from typing import List

class VendorRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_vendors(self, item_name: str, location: str) -> List[Vendor]:
        query = select(Vendor).where(
            Vendor.item_name == item_name.strip().lower(),
            Vendor.location == location.strip().lower()
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def save_vendors(self, item_name: str, location: str, vendors_data: List[dict]) -> int:
        saved_count = 0
        normalized_item = item_name.strip().lower()
        normalized_location = location.strip().lower()

        for data in vendors_data:
            vendor_name = data.get("name", "").strip().lower()
            if not vendor_name:
                continue

            # Check if vendor already exists to prevent duplicates
            existing_query = select(Vendor).where(
                Vendor.item_name == normalized_item,
                Vendor.location == normalized_location,
                Vendor.vendor_name == vendor_name
            )
            existing_result = await self.db.execute(existing_query)
            if existing_result.scalar_one_or_none():
                continue

            new_vendor = Vendor(
                item_name=normalized_item,
                location=normalized_location,
                vendor_name=vendor_name,
                address=data.get("address", "").strip(),
                phone=data.get("phone", "").strip(),
                email=data.get("email", "").strip(),
                website=data.get("website", "").strip()
            )
            self.db.add(new_vendor)
            saved_count += 1
        
        await self.db.commit()
        return saved_count

    async def get_all_vendors(self) -> List[Vendor]:
        result = await self.db.execute(select(Vendor).order_by(Vendor.id))
        return result.scalars().all()

    async def get_vendor_by_id(self, vendor_id: int) -> Vendor:
        result = await self.db.execute(select(Vendor).where(Vendor.id == vendor_id))
        return result.scalar_one_or_none()

    async def delete_vendor(self, vendor: Vendor):
        await self.db.delete(vendor)
        await self.db.commit()
