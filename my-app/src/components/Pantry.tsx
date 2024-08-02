"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Modal,
  Typography,
  IconButton,
  Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/services/firebase";
import { collection, addDoc } from "firebase/firestore";
import PantryCards from "./PantryCards";

const Pantry = () => {
  // handle states for opening/closing modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // states for item description
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [comments, setComments] = useState("");

  // get current user information
  const [user] = useAuthState(auth);

  // Add item to database
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // check if valid user and add item using their id to db
    if (user) {
      try {
        await addDoc(collection(db, "pantry", user.uid, "items"), {
          name: itemName,
          quantity: quantity,
          comments: comments,
          createdAt: new Date(),
        });
        setItemName("");
        setQuantity("");
        setComments("");
        handleClose();
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Search bar */}
        <TextField
          variant="outlined"
          placeholder="Search..."
          sx={{
            flexGrow: 1,
            mr: 2,
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#5074E7",
              },
            },
            backgroundColor: "white",
            boxShadow: 0.5,
            borderRadius: 1,
          }}
        />
        {/* Add item button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            height: "56px",
            py: "14px",
            px: 3,
            backgroundColor: "#5074E7",
            "&:hover": {
              backgroundColor: "rgba(64, 99, 201, 0.9)",
            },
            fontWeight: 500,
          }}
        >
          Add
        </Button>
      </Box>

      {/* Modal for adding item */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
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
            {/* Add item title information*/}
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
                Add Ingredient
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Modal form for adding item information */}
            <Box
              component="form"
              sx={{ mt: 2 }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="item-name"
                label="Item Name"
                name="name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#5074E7",
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="item-quantity"
                label="Quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#5074E7",
                    },
                  },
                }}
              />
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#5074E7",
                    },
                  },
                }}
              />
              {/* Add item modal confirmation */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#5074E7",
                  "&:hover": {
                    backgroundColor: "rgba(64, 99, 201, 0.9)",
                  },
                }}
              >
                Add Ingredient
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {/* Ingredient List */}
      <Box sx={{mt: 3}}>
        <PantryCards />
      </Box>
    </Box>
  );
};

export default Pantry;
