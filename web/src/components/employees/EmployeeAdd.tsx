import React from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export interface EmployeeFormData {
  name: string;
  surname: string;
  position: string;
  teamId: string;
  startDate: string | null;
  endDate: string | null;
}

const schema = yup.object({
  name: yup.string().required("Jméno je povinné"),
  surname: yup.string().required("Příjmení je povinné"),
  position: yup.string().required("Pozice je povinná"),
  teamId: yup.string().required("Tým je povinný"),
  startDate: yup.string().nullable().default(null),
  endDate: yup.string().nullable().default(null)
}).required();

interface EmployeeAddProps {
  teamId?: string;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
}

export default function EmployeeAdd({ teamId, onSubmit, onCancel }: EmployeeAddProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      teamId: teamId ?? "",
      name: "",
      surname: "",
      position: "",
      startDate: null,
      endDate: null
    }
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2, mb: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField
            {...register("name")}
            label="Jméno"
            error={!!errors.name}
            helperText={errors.name?.message}
            size="small"
            required
          />
          <TextField
            {...register("surname")}
            label="Příjmení"
            error={!!errors.surname}
            helperText={errors.surname?.message}
            size="small"
            required
          />
          <TextField
            {...register("position")}
            label="Pozice"
            error={!!errors.position}
            helperText={errors.position?.message}
            size="small"
            required
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            {...register("startDate")}
            label="Datum nástupu"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register("endDate")}
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
