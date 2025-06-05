import { Controller, useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormFieldError } from "../forms/FormFieldError";
import { FormError } from "../forms/FormError";
import { FormSuccess } from "../forms/FormSuccess";
import type { Team, EmployeeCreate } from "@/types";

const schema = yup.object().shape({
  name: yup.string().required("Jméno je povinné"),
  surname: yup.string().required("Příjmení je povinné"),
  teamId: yup.string().required("Tým je povinný"),
  position: yup.string().required("Pozice je povinná"),
  startDate: yup.date().required("Datum nástupu je povinné"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "Datum ukončení nemůže být před datem nástupu")
    .nullable(),
});

interface EmployeeAddProps {
  teams: Team[];
  onSuccess?: () => void;
}

export const EmployeeAdd = ({ teams, onSuccess }: EmployeeAddProps) => {
  const [formError, setFormError] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeCreate>({ resolver: yupResolver(schema) });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Chyba při vytváření zaměstnance");
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
        Přidat zaměstnance
      </Typography>
      <form onSubmit={onSubmit}>
        <Stack direction="row" gap={3}>
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
            <Controller
              name="name"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField fullWidth {...field} label="Jméno" />
              )}
            />
            {errors.name && <FormFieldError text={errors.name.message} />}
          </Box>
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
            <FormControl fullWidth>
              <Controller
                name="surname"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <TextField fullWidth {...field} label="Příjmení" />
                )}
              />
            </FormControl>
            {errors.surname && <FormFieldError text={errors.surname.message} />}
          </Box>
        </Stack>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Tým</InputLabel>
          <Controller
            name="teamId"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Select {...field} label="Tým">
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        {errors.teamId && <FormFieldError text={errors.teamId.message} />}

        <Stack direction="row" gap={3} mt={3} flexWrap={{ xs: "wrap", md: "nowrap" }}>
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
            <InputLabel>Datum nástupu</InputLabel>
            <Controller
              name="startDate"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField fullWidth type="date" {...field} />
              )}
            />
            {errors.startDate && <FormFieldError text={errors.startDate.message} />}
          </Box>
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
            <InputLabel>Datum ukončení</InputLabel>
            <Controller
              name="endDate"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField fullWidth type="date" {...field} />
              )}
            />
            {errors.endDate && <FormFieldError text={errors.endDate.message} />}
          </Box>
        </Stack>

        <Box mt={3}>
          <Controller
            name="position"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <TextField fullWidth {...field} label="Pozice" />
            )}
          />
          {errors.position && <FormFieldError text={errors.position.message} />}
        </Box>

        <Button type="submit" variant="contained" sx={{ my: 3 }}>
          Přidat zaměstnance
        </Button>
        {formError && <FormError text="Chyba při vytváření zaměstnance" />}
        {success && <FormSuccess text="Zaměstnanec byl úspěšně vytvořen" />}
      </form>
    </Box>
  );
};
