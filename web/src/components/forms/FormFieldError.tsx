import Typography from "@mui/material/Typography";

export const FormFieldError = ({ text }: { text?: string }) => (
  <Typography color="error" variant="caption" sx={{ mt: 1 }}>
    {text}
  </Typography>
);
