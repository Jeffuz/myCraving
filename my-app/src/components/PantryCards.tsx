"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Modal,
  Button,
  IconButton,
  TextField,
  Fade,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import Loading from "./Loading";

// schema
interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  comments: string;
  unit: string;
}

// Units for amount selection
const units = ["kg", "g", "lb", "oz", "l", "ml", "cup", "tbsp", "tsp", "piece"];

const PantryCards = ({ items, setItems }: any) => {
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [comments, setComments] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Set states for item when selecting an ingredient + Modal
  const handleOpen = (item: PantryItem) => {
    setSelectedItem(item);
    setItemName(item.name);
    setQuantity(item.quantity.split(' ')[0]); // Extract quantity
    setUnit(item.quantity.split(' ')[1]); // Extract unit
    setComments(item.comments);
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setIsEditing(false);
  };

  // Edit items
  const handleEdit = async () => {
    if (selectedItem) {
      const itemRef = doc(db, "pantry", auth.currentUser!.uid, "items", selectedItem.id);
      await updateDoc(itemRef, {
        name: itemName,
        quantity: `${quantity} ${unit}`, // Save quantity with unit
        comments: comments,
      });
      setItems((prevItems:any) =>
        prevItems.map((item:any) =>
          item.id === selectedItem.id
            ? {
                ...item,
                name: itemName,
                quantity: `${quantity} ${unit}`,
                comments: comments,
              }
            : item
        )
      );
      handleClose();
    }
  };

  // Delete Item
  const handleDelete = async () => {
    if (selectedItem) {
      const itemRef = doc(db, "pantry", auth.currentUser!.uid, "items", selectedItem.id);
      await deleteDoc(itemRef);
      setItems((prevItems:any) =>
        prevItems.filter((item:any) => item.id !== selectedItem.id)
      );
      handleClose();
      setConfirmDelete(false);
    }
  };

  // Load until all items are fetched
  if (!items.length) {
    return <Loading />;
  }

  return (
    <Box>
      {/* Display ingredients as cards in grid format */}
      <Grid container spacing={2}>
        {items.map((item:any) => (
          <Grid item xs={12} sm={6} key={item.id}>
            <Card
              sx={{
                mb: 2,
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              onClick={() => handleOpen(item)}
            >
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">
                  Quantity: {item.quantity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal after clicking on ingredient */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Open modal for individual ingredient */}
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                id="modal-title"
                variant="h6"
                component="h2"
                fontWeight="bold"
              >
                {isEditing ? "Edit Ingredient" : "Ingredient Details"}
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
              {/* Textfield for item name */}
              <TextField
                margin="normal"
                fullWidth
                id="item-name"
                label="Item Name"
                name="name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                disabled={!isEditing}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#5074E7",
                    },
                  },
                }}
              />
              {/* Amount selection including units */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* Amount */}
                <TextField
                  margin="normal"
                  required
                  id="item-quantity"
                  label="Quantity"
                  name="quantity"
                  value={quantity}
                  type="number"
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#5074E7",
                      },
                    },
                    mr: 2,
                    flexGrow: 1,
                    height: "56px",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                  }}
                />
                {/* Units */}
                <TextField
                  margin="normal"
                  select
                  label="Unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  disabled={!isEditing}
                  sx={{
                    flexBasis: "30%",
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#5074E7",
                      },
                    },
                    height: "56px",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                  }}
                >
                  {units.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              {/* Textfield for comments */}
              <TextField
                margin="normal"
                fullWidth
                id="item-comments"
                label="Comments"
                name="comments"
                multiline
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={!isEditing}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#5074E7",
                    },
                  },
                }}
              />
              {/* Editing Mode for editing ingredient */}
              {isEditing ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEdit}
                    sx={{
                      backgroundColor: "#5074E7",
                      "&:hover": {
                        backgroundColor: "rgba(64, 99, 201, 0.9)",
                      },
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  {/* Edit Ingredient Information */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                    startIcon={<EditIcon />}
                    sx={{
                      backgroundColor: "#5074E7",
                      "&:hover": {
                        backgroundColor: "rgba(64, 99, 201, 0.9)",
                      },
                    }}
                  >
                    Edit
                  </Button>
                  {/* Delete Ingredient */}
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#ff0033",
                      "&:hover": {
                        backgroundColor: "darkred",
                      },
                    }}
                    onClick={() => setConfirmDelete(true)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Confirmation for deleting item */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontWeight="bold">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} sx={{ color: "#ff0033" }} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PantryCards;
