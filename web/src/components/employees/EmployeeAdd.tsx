import { Controller, useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  InputLabel,
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

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  surname: yup.string().required("Surname is required"),
  team: yup.string(),
  position: yup.string(),
  startDate: yup.date(),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date can't be before start date"),
});

export const EmployeeAdd = (
  {
    /* teams */
  }
) => {
  const [formError, setFormError] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Add employee
      </Typography>
      <form onSubmit={onSubmit}>
        <Stack direction="row" gap={3}>
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
            <Controller
              name="name"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField fullWidth {...field} label="Name" />
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
                  <TextField fullWidth {...field} label="Last Name" />
                )}
              />
            </FormControl>

            {errors.surname && <FormFieldError text={errors.surname.message} />}
          </Box>
        </Stack>
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Team</InputLabel>
          <Controller
            name="team"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Select {...field} label="Team">
                {/*                 {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))} */}
              </Select>
            )}
          />
        </FormControl>

        {errors.team && <FormFieldError text={errors.team.message} />}

        <Stack
          direction="row"
          gap={3}
          mt={3}
          flexWrap={{ xs: "wrap", md: "nowrap" }}
        >
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
            <InputLabel>Start Date </InputLabel>
            <Controller
              defaultValue={undefined}
              name="startDate"
              control={control}
              render={({ field }) => (
                <TextField fullWidth type="date" {...field} />
              )}
            />

            {errors.startDate && (
              <FormFieldError text={errors.startDate.message} />
            )}
          </Box>
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
            <InputLabel>End Date </InputLabel>
            <Controller
              defaultValue={undefined}
              name="endDate"
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
            defaultValue=""
            name="position"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField fullWidth {...field} label="Position" />
            )}
          />
          {errors.position && <FormFieldError text={errors.position.message} />}
        </Box>

        <Button type="submit" variant="contained" sx={{ my: 3 }}>
          Add employee
        </Button>
        {formError && <FormError text="Please fill out the form correctly" />}
        {success && <FormSuccess text="Employee Added" />}
      </form>
    </Box>
  );
};
