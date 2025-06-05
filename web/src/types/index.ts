export interface Employee {
  id: string;
  name: string;
  surname: string;
  position: string;
  startDate: string;
  endDate?: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  parentTeamId?: string;
  employees?: Employee[];
  children?: Team[];
}

export interface TeamCreate {
  name: string;
  parentTeamId?: string;
}

export interface EmployeeCreate {
  name: string;
  surname: string;
  position: string;
  startDate: string;
  endDate?: string;
  teamId: string;
} 