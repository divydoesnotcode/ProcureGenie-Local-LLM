from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.vendor_schema import VendorCreate, VendorResponse, VendorList, VendorRequest
from app.models.vendor import Vendor
from app.repositories.vendor_repo import VendorRepository
from app.services.ollama_service import generate_vendors_llm

router = APIRouter()

@router.get("/", response_model=VendorList)
async def get_vendors(db: AsyncSession = Depends(get_db)):
    repo = VendorRepository(db)
    vendors = await repo.get_all_vendors()
    return {"vendors": vendors}

@router.post("/", response_model=VendorResponse)
async def create_vendor(vendor: VendorCreate, db: AsyncSession = Depends(get_db)):
    repo = VendorRepository(db)
    new_vendor = Vendor(
        vendor_name=vendor.vendor_name,
        item_name=vendor.item_name,
        location=vendor.location,
        address=vendor.address,
        phone=vendor.phone,
        email=vendor.email,
        website=vendor.website
    )
    db.add(new_vendor)
    await db.commit()
    await db.refresh(new_vendor)
    return new_vendor

@router.post("/generate-vendors-flow")
async def generate_vendors_flow(req: VendorRequest, db: AsyncSession = Depends(get_db)):
    repo = VendorRepository(db)
    
    # STEP 1: Check database first
    db_vendors = await repo.get_vendors(req.item, req.location)

    if db_vendors:
        return {
            "source": "database",
            "count": len(db_vendors),
            "vendors": db_vendors
        }

    # STEP 2: Generate from LLM
    try:
        llm_response = await generate_vendors_llm(req.item, req.location)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Generation failed: {str(e)}")

    vendors_data = llm_response.get("vendors", [])   

    # STEP 3: Save to DB
    saved_count = await repo.save_vendors(
        req.item,
        req.location,
        vendors_data
    )

    # Fetch recently saved vendors to return full records with IDs
    final_vendors = await repo.get_vendors(req.item, req.location)

    return {
        "source": "llm",
        "generated": len(vendors_data),
        "saved": saved_count,
        "vendors": final_vendors
    }

@router.delete("/{vendor_id}")
async def delete_vendor(vendor_id: int, db: AsyncSession = Depends(get_db)):
    repo = VendorRepository(db)
    vendor = await repo.get_vendor_by_id(vendor_id)
    if vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    await repo.delete_vendor(vendor)
    return {"message": "Vendor deleted successfully"}
