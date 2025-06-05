from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from starlette import status
from typing import List, Optional

from src.dependencies import (
    team_service_factory,
    verify_token,
    employee_service_factory,
)
from src.models.employee import EmployeeService
from src.models.team import TeamService


class TeamBaseSchema(BaseModel):
    name: str


class TeamResponseSchema(TeamBaseSchema):
    id: str
    parent_team_id: Optional[str] = None


class TeamCreateSchema(TeamBaseSchema):
    parent_team_id: Optional[str] = Field(default=None)


class TeamUpdateSchema(TeamBaseSchema):
    parent_team_id: Optional[str] = None


router = APIRouter(prefix="/teams", tags=["Teams"])


@router.get(
    "/tree",
    dependencies=[Depends(verify_token)],
    operation_id="get_team_tree",
)
async def get_team_tree(
    team_service: TeamService = Depends(team_service_factory),
    employee_service: EmployeeService = Depends(employee_service_factory),
):
    """Získá hierarchickou strukturu týmů včetně zaměstnanců"""
    return team_service.get_team_tree(employee_service)


@router.get(
    "",
    dependencies=[Depends(verify_token)],
    operation_id="list_teams",
    response_model=List[TeamResponseSchema],
)
async def list_teams(
    team_service: TeamService = Depends(team_service_factory),
):
    """Získá seznam všech týmů"""
    return team_service.read_all()


@router.post(
    "",
    dependencies=[Depends(verify_token)],
    operation_id="create_team",
    response_model=TeamResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def create_team(
    data: TeamCreateSchema,
    team_service: TeamService = Depends(team_service_factory),
):
    """Vytvoří nový tým"""
    return team_service.create(**data.model_dump())


@router.get(
    "/{team_id}",
    dependencies=[Depends(verify_token)],
    operation_id="get_team",
    response_model=TeamResponseSchema,
)
async def get_team(
    team_id: str,
    team_service: TeamService = Depends(team_service_factory),
):
    """Získá detail týmu"""
    team = team_service.read(team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    return team


@router.put(
    "/{team_id}",
    dependencies=[Depends(verify_token)],
    operation_id="update_team",
    response_model=TeamResponseSchema,
)
async def update_team(
    team_id: str,
    data: TeamUpdateSchema,
    team_service: TeamService = Depends(team_service_factory),
):
    """Aktualizuje tým"""
    team = team_service.update(team_id, **data.model_dump())
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    return team


@router.delete(
    "/{team_id}",
    dependencies=[Depends(verify_token)],
    operation_id="delete_team",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_team(
    team_id: str,
    team_service: TeamService = Depends(team_service_factory),
):
    """Smaže tým"""
    if not team_service.delete(team_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
