import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Stack,
  Chip,
  Button,
  Checkbox,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TeamAdd from "../components/TeamAdd";
import EmployeeAdd from "../components/EmployeeAdd";

interface Employee {
  id: string;
  name: string;
  surname: string;
  position: string;
  startDate: string | null;
  endDate: string | null;
  teamId: string;
}

interface Team {
  id: string;
  name: string;
  employees: Employee[];
  children: Team[];
}

// Helper to check if employee is active
function isActiveEmployee(employee: Employee): boolean {
  if (!employee.endDate) return true;
  return new Date(employee.endDate) >= new Date();
}

// Recursive Team Tree
function TeamTree({ team, onEmployeeSelect, selectedEmployees }: { 
  team: Team; 
  onEmployeeSelect: (employeeId: string) => void;
  selectedEmployees: string[];
}) {
  const [open, setOpen] = useState<boolean>(true);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  const handleAddTeam = async (data: any) => {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, parent_team_id: team.id }),
      });
      if (!response.ok) throw new Error("Chyba při vytváření týmu");
      setShowAddTeam(false);
      window.location.reload(); // Pro jednoduchost znovu načteme stránku
    } catch (error) {
      console.error("Chyba:", error);
    }
  };

  const handleAddEmployee = async (data: any) => {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, team_id: team.id }),
      });
      if (!response.ok) throw new Error("Chyba při vytváření zaměstnance");
      setShowAddEmployee(false);
      window.location.reload();
    } catch (error) {
      console.error("Chyba:", error);
    }
  };

  return (
    <Box ml={2} mb={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton size="small" onClick={() => setOpen((o) => !o)}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <Typography variant="h6">{team.name}</Typography>
        <IconButton size="small" onClick={() => setShowAddTeam(true)}>
          <AddIcon /> Tým
        </IconButton>
        <IconButton size="small" onClick={() => setShowAddEmployee(true)}>
          <AddIcon /> Zaměstnanec
        </IconButton>
      </Stack>

      {showAddTeam && (
        <TeamAdd onSubmit={handleAddTeam} onCancel={() => setShowAddTeam(false)} />
      )}
      
      {showAddEmployee && (
        <EmployeeAdd onSubmit={handleAddEmployee} onCancel={() => setShowAddEmployee(false)} />
      )}

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense>
          {team.employees?.map((emp) => (
            <ListItem 
              key={emp.id} 
              sx={{ opacity: isActiveEmployee(emp) ? 1 : 0.5 }}
            >
              <Checkbox
                checked={selectedEmployees.includes(emp.id)}
                onChange={() => onEmployeeSelect(emp.id)}
              />
              <ListItemIcon>
                <Avatar>{emp.name[0]}</Avatar>
              </ListItemIcon>
              <ListItemText
                primary={`${emp.name} ${emp.surname}`}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2">
                      Pozice: {emp.position}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Pracuje: {emp.startDate || "nespecifikováno"} - {emp.endDate || "současnost"}
                    </Typography>
                  </React.Fragment>
                }
              />
              {!isActiveEmployee(emp) && <Chip label="Ukončen" color="error" size="small" />}
            </ListItem>
          ))}
        </List>
        {team.children?.map((child) => (
          <TeamTree 
            key={child.id} 
            team={child} 
            onEmployeeSelect={onEmployeeSelect}
            selectedEmployees={selectedEmployees}
          />
        ))}
      </Collapse>
    </Box>
  );
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showAddTeam, setShowAddTeam] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams/tree", {
          headers: {
            "Authorization": "Bearer mysecrettoken123"
          }
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || "Chyba při načítání dat");
        }
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setError(error instanceof Error ? error.message : "Neznámá chyba");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedEmployees.length) return;

    try {
      const response = await fetch("/api/employees/delete-many", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_ids: selectedEmployees }),
      });

      if (!response.ok) throw new Error("Chyba při mazání zaměstnanců");
      
      setSelectedEmployees([]);
      window.location.reload(); // Pro jednoduchost znovu načteme stránku
    } catch (error) {
      console.error("Chyba:", error);
    }
  };

  const handleAddRootTeam = async (data: any) => {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Chyba při vytváření týmu");
      setShowAddTeam(false);
      window.location.reload();
    } catch (error) {
      console.error("Chyba:", error);
    }
  };

  if (loading) return <Typography>Načítání...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box p={3}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Typography variant="h4">Týmy a zaměstnanci</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setShowAddTeam(true)}
        >
          Přidat tým
        </Button>
        {selectedEmployees.length > 0 && (
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
          >
            Smazat vybrané ({selectedEmployees.length})
          </Button>
        )}
      </Stack>

      {showAddTeam && (
        <Box mb={3}>
          <TeamAdd onSubmit={handleAddRootTeam} onCancel={() => setShowAddTeam(false)} />
        </Box>
      )}

      {teams.length === 0 ? (
        <Typography>Žádné týmy</Typography>
      ) : (
        teams.map((team) => (
          <TeamTree 
            key={team.id} 
            team={team} 
            onEmployeeSelect={handleEmployeeSelect}
            selectedEmployees={selectedEmployees}
          />
        ))
      )}
    </Box>
  );
} 