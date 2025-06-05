from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from src.dependencies import employee_service_factory, verify_token
from src.models.employee import EmployeeService


class EmployeeBaseSchema(BaseModel):
    name: str
    surname: str
    position: str
    team_id: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class EmployeeResponseSchema(BaseModel):
    id: str
    name: str
    surname: str
    position: str
    team_id: str
    created_at: datetime
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

    class Config:
        from_attributes = True


class EmployeeCreateSchema(EmployeeBaseSchema):
    pass


class EmployeeUpdateSchema(EmployeeBaseSchema):
    name: Optional[str] = None
    surname: Optional[str] = None
    position: Optional[str] = None
    team_id: Optional[str] = None


class DeleteEmployeesSchema(BaseModel):
    employee_ids: List[str]


router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get(
    "",
    dependencies=[Depends(verify_token)],
    operation_id="list_employees",
    response_model=List[EmployeeResponseSchema],
)
async def list_employees(
    employee_service: EmployeeService = Depends(employee_service_factory),
):
    """Získá seznam všech zaměstnanců"""
    return employee_service.read_all()


@router.post(
    "",
    dependencies=[Depends(verify_token)],
    operation_id="create_employee",
    response_model=EmployeeResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def create_employee(
    data: EmployeeCreateSchema,
    employee_service: EmployeeService = Depends(employee_service_factory),
):
    """Vytvoří nového zaměstnance"""
    return employee_service.create(**data.model_dump())


@router.get(
    "/{employee_id}",
    dependencies=[Depends(verify_token)],
    operation_id="get_employee",
    response_model=EmployeeResponseSchema,
)
async def get_employee(
    employee_id: str,
    employee_service: EmployeeService = Depends(employee_service_factory),
):
    """Získá detail zaměstnance"""
    employee = employee_service.read(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    return employee


@router.put(
    "/{employee_id}",
    dependencies=[Depends(verify_token)],
    operation_id="update_employee",
    response_model=EmployeeResponseSchema,
)
async def update_employee(
    employee_id: str,
    data: EmployeeUpdateSchema,
    employee_service: EmployeeService = Depends(employee_service_factory),
):
    """Aktualizuje zaměstnance"""
    # Remove None values from update data
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    employee = employee_service.update(employee_id, **update_data)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    return employee


@router.delete(
    "/{employee_id}",
    dependencies=[Depends(verify_token)],
    operation_id="delete_employee",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_employee(
    employee_id: str,
    employee_service: EmployeeService = Depends(employee_service_factory),
):
    """Smaže zaměstnance"""
    if not employee_service.delete(employee_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )


@router.post(
    "/delete-many",
    dependencies=[Depends(verify_token)],
    operation_id="delete_employees",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_employees(
    data: DeleteEmployeesSchema,
    employee_service: EmployeeService = Depends(employee_service_factory),
):
    """Hromadně smaže zaměstnance"""
    employee_service.delete_many(data.employee_ids)
