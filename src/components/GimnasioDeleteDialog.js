import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

function GimnasioDeleteDialog({ open, handleClose, handleDelete }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Eliminar Gimnasio</DialogTitle>
      <DialogContent>
        <Typography>¿Estás seguro de que deseas eliminar este gimnasio? Esta acción no se puede deshacer.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button onClick={handleDelete} color="error">Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default GimnasioDeleteDialog;