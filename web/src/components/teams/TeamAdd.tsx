import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormFieldError } from "../forms/FormFieldError";
import { FormSuccess } from "../forms/FormSuccess";
import { FormError } from "../forms/FormError";
import type { Team, TeamCreate } from "@/types";

const schema = yup.object().shape({
  name: yup.string().required("Název je povinný"),
  parentTeamId: yup.string(),
});

interface TeamAddProps {
  teams: Team[];
  onSuccess?: () => void;
}

export const TeamAdd = ({ teams, onSuccess }: TeamAddProps) => {
  const [formError, setFormError] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamCreate>({ resolver: yupResolver(schema) });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Chyba při vytváření týmu");
      }

      setSuccess(true);
      reset();
      onSuccess?.();
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setFormError(true);
      setTimeout(() => setFormError(false), 2000);
    }
  });

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Přidat tým
      </Typography>
      <form onSubmit={onSubmit}>
        <Controller
          name="name"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <TextField fullWidth {...field} label="Název" />
          )}
        />

        {errors.name && <FormFieldError text={errors.name.message} />}

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Nadřazený tým</InputLabel>
          <Controller
            name="parentTeamId"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Select {...field} label="Nadřazený tým">
                <MenuItem value="">Žádný</MenuItem>
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        {errors.parentTeamId && (
          <FormFieldError text={errors.parentTeamId.message} />
        )}

        <Button type="submit" variant="contained" sx={{ my: 3 }}>
          Přidat tým
        </Button>
        {formError && <FormError text="Chyba při vytváření týmu" />}
        {success && <FormSuccess text="Tým byl úspěšně vytvořen" />}
      </form>
    </Box>
  );
};
