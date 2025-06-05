import React from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

interface TeamFormData {
  name: string;
}

interface TeamAddProps {
  onSubmit: (data: TeamFormData) => void;
  onCancel: () => void;
}

export default function TeamAdd({ onSubmit, onCancel }: TeamAddProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TeamFormData>();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2, mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          {...register("name", { required: "Název týmu je povinný" })}
          label="Název týmu"
          error={!!errors.name}
          helperText={errors.name?.message}
          size="small"
        />
        <Button type="submit" variant="contained" size="small">
          Přidat
        </Button>
        <Button onClick={onCancel} size="small">
          Zrušit
        </Button>
      </Stack>
    </Box>
  );
} 