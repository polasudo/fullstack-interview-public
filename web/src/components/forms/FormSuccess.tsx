import Typography from "@mui/material/Typography";

export const FormSuccess = ({ text }: { text?: string }) => (
  <Typography component="div" color="green" variant="subtitle2">
    {text}
  </Typography>
);
