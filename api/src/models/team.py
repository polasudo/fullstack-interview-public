import uuid
from typing import List, Dict, Any

from sqlalchemy import Column, String, ForeignKey, text
from sqlalchemy.orm import Session, relationship

from src.database import Base


class Team(Base):
    __tablename__ = "team"

    id = Column(String, primary_key=True, default=str(uuid.uuid4))
    name = Column(String, nullable=False)
    parent_team_id = Column(String, ForeignKey("team.id"), nullable=True)
    
    # Define the parent relationship (many-to-one)
    parent = relationship("Team", remote_side=[id], backref="children", foreign_keys=[parent_team_id])


class TeamService:
    def __init__(self, session: Session):
        self.model = Team
        self.session = session

    def create(self, **values):
        team = self.model(**values)
        self.session.add(team)
        self.session.commit()
        self.session.refresh(team)
        return team

    def read(self, team_id: str) -> Dict[str, Any]:
        team = self.session.query(self.model).filter(self.model.id == team_id).first()
        if not team:
            return None
        return {
            "id": str(team.id),
            "name": team.name,
            "parent_team_id": str(team.parent_team_id) if team.parent_team_id else None
        }

    def read_all(self) -> List[Dict[str, Any]]:
        teams = self.session.query(self.model).all()
        return [{
            "id": str(team.id),
            "name": team.name,
            "parent_team_id": str(team.parent_team_id) if team.parent_team_id else None
        } for team in teams]

    def build_team_tree(self, teams: List[Dict[str, Any]], employees_by_team: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
        # Create a mapping of team ID to team data
        team_map = {str(team["id"]): {
            "id": str(team["id"]),
            "name": team["name"],
            "parentTeamId": team["parent_team_id"],
            "employees": employees_by_team.get(str(team["id"]), []),
            "children": []
        } for team in teams}
        
        # Build the tree structure
        root_teams = []
        for team_id, team in team_map.items():
            if team["parentTeamId"]:
                parent = team_map.get(team["parentTeamId"])
                if parent:
                    parent["children"].append(team)
            else:
                root_teams.append(team)
        
        return root_teams

    def get_team_tree(self, employee_service) -> List[Dict[str, Any]]:
        teams = self.read_all()
        employees_by_team = {}
        
        for team in teams:
            employees = employee_service.read_all_by_team_id(team["id"])
            if employees:
                employees_by_team[str(team["id"])] = [
                    {
                        "id": str(emp.id),
                        "name": emp.name,
                        "surname": emp.surname,
                        "position": emp.position,
                        "startDate": emp.start_date.isoformat() if emp.start_date else None,
                        "endDate": emp.end_date.isoformat() if emp.end_date else None,
                        "teamId": str(emp.team_id)
                    }
                    for emp in employees
                ]
        
        return self.build_team_tree(teams, employees_by_team)

    def update(self, team_id: str, **values) -> Dict[str, Any]:
        team = self.session.query(self.model).filter(self.model.id == team_id).first()
        if not team:
            return None
        
        for key, value in values.items():
            setattr(team, key, value)
        
        self.session.commit()
        self.session.refresh(team)
        return self.read(team.id)

    def delete(self, team_id: str) -> bool:
        team = self.session.query(self.model).filter(self.model.id == team_id).first()
        if team:
            self.session.delete(team)
            self.session.commit()
            return True
        return False
