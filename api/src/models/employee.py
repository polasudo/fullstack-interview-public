import uuid
from datetime import timezone, datetime
from typing import List, Dict, Any, Optional

from sqlalchemy import Column, DateTime, String, ForeignKey, text
from sqlalchemy.orm import Session, relationship

from src.database import Base


class Employee(Base):
    __tablename__ = "employee"

    id = Column(String, primary_key=True, default=str(uuid.uuid4))
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    position = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    team_id = Column(String, ForeignKey("team.id"), nullable=False)

    team = relationship("Team", foreign_keys=[team_id])


class EmployeeService:
    def __init__(self, session: Session):
        self.model = Employee
        self.session = session

    def _format_employee(self, employee: Employee) -> Dict[str, Any]:
        return {
            "id": str(employee.id),
            "name": employee.name,
            "surname": employee.surname,
            "position": employee.position,
            "startDate": employee.start_date.isoformat() if employee.start_date else None,
            "endDate": employee.end_date.isoformat() if employee.end_date else None,
            "teamId": str(employee.team_id),
            "createdAt": employee.created_at.isoformat()
        }

    def create(self, **values) -> Dict[str, Any]:
        created_at = datetime.now(timezone.utc)
        
        # Convert string dates to datetime objects
        if "start_date" in values and values["start_date"]:
            values["start_date"] = datetime.fromisoformat(values["start_date"])
        if "end_date" in values and values["end_date"]:
            values["end_date"] = datetime.fromisoformat(values["end_date"])
            
        employee = self.model(created_at=created_at, **values)
        self.session.add(employee)
        self.session.commit()
        self.session.refresh(employee)
        return self._format_employee(employee)

    def read(self, employee_id: str) -> Optional[Dict[str, Any]]:
        employee = self.session.query(self.model).filter(self.model.id == employee_id).first()
        if not employee:
            return None
        return self._format_employee(employee)

    def read_all(self) -> List[Dict[str, Any]]:
        employees = self.session.query(self.model).all()
        return [self._format_employee(emp) for emp in employees]

    def read_all_by_team_id(self, team_id: str) -> List[Employee]:
        return self.session.query(self.model).filter(self.model.team_id == team_id).all()

    def update(self, employee_id: str, **values) -> Optional[Dict[str, Any]]:
        employee = self.session.query(self.model).filter(self.model.id == employee_id).first()
        if not employee:
            return None
            
        # Convert string dates to datetime objects
        if "start_date" in values and values["start_date"]:
            values["start_date"] = datetime.fromisoformat(values["start_date"])
        if "end_date" in values and values["end_date"]:
            values["end_date"] = datetime.fromisoformat(values["end_date"])
            
        for key, value in values.items():
            setattr(employee, key, value)
            
        self.session.commit()
        self.session.refresh(employee)
        return self._format_employee(employee)

    def delete(self, employee_id: str) -> bool:
        employee = self.session.query(self.model).filter(self.model.id == employee_id).first()
        if employee:
            self.session.delete(employee)
            self.session.commit()
            return True
        return False

    def delete_many(self, employee_ids: List[str]) -> bool:
        self.session.query(self.model).filter(self.model.id.in_(employee_ids)).delete(synchronize_session=False)
        self.session.commit()
        return True
