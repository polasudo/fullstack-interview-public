import React from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

interface EmployeeFormData {
  name: string;
  surname: string;
  position: string;
  start_date?: string;
  end_date?: string;
}

interface EmployeeAddProps {
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
}

export default function EmployeeAdd({ onSubmit, onCancel }: EmployeeAddProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2, mb: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField
            {...register("name", { required: "Jméno je povinné" })}
            label="Jméno"
            error={!!errors.name}
            helperText={errors.name?.message}
            size="small"
          />
          <TextField
            {...register("surname", { required: "Příjmení je povinné" })}
            label="Příjmení"
            error={!!errors.surname}
            helperText={errors.surname?.message}
            size="small"
          />
          <TextField
            {...register("position", { required: "Pozice je povinná" })}
            label="Pozice"
            error={!!errors.position}
            helperText={errors.position?.message}
            size="small"
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            {...register("start_date")}
            label="Datum nástupu"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register("end_date")}
            label="Datum ukončení"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" size="small">
            Přidat
          </Button>
          <Button onClick={onCancel} size="small">
            Zrušit
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
} 