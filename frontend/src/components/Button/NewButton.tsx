import { Button } from "@mui/material";
import React from "react";

const NewButton = ({ onClick }: { onClick: () => void }) => {
  return <Button variant="contained" onClick={onClick}>Mới</Button>;
};

export default NewButton;
