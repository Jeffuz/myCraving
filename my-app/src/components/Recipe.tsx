import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import KitchenIcon from "@mui/icons-material/Kitchen";
import TimerIcon from "@mui/icons-material/Timer";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";

// Schema for prompt
const schema = {
  type: "object",
  properties: {
    Recipe_name: { type: "string" },
    Ingredients_list: {
      type: "array",
      items: { type: "string" },
    },
    Serving_Size: { type: "string" },
    Time_to_prepare_and_cook: { type: "string" },
    Instructions: {
      type: "array",
      items: { type: "string" },
    },
    Nutrition_information: {
      type: "object",
      properties: {
        calories: { type: "string" },
        protein: { type: "string" },
        carbohydrates: { type: "string" },
        Fat: { type: "string" },
      },
      required: ["calories", "protein", "carbohydrates", "Fat"],
    },
  },
  required: [
    "Recipe_name",
    "Ingredients_list",
    "Serving_Size",
    "Time_to_prepare_and_cook",
    "Instructions",
    "Nutrition_information",
  ],
};

const Recipe = () => {
  const { data: session, status } = useSession();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch ingredients from firestore
  useEffect(() => {
    const fetchIngredients = async () => {
      if (session?.user) {
        setLoading(true);
        try {
          const q = query(collection(db, "pantry", session.user.id, "items"));
          const querySnapshot = await getDocs(q);
          const fetchedIngredients = querySnapshot.docs.map(
            (doc) => doc.data().name
          );
          setIngredients(fetchedIngredients);
        } catch (err) {
          setError("Error fetching ingredients from pantry.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === "authenticated") {
      fetchIngredients();
    }
  }, [session, status]);

  // Validate generated json recipe with schhema
  const validateSchema = (data: any) => {
    const Ajv = require("ajv");
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    return validate(data);
  };

  // Generate recipe through chatgpt
  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setError("No ingredients found in your pantry.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      let valid = false;
      let response;
      while (!valid) {
        response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a recipe generator. Generate a recipe in JSON format.",
              },
              {
                role: "user",
                content: `Create a recipe in JSON format using the following ingredients: ${ingredients.join(
                  ", "
                )}. The JSON should have the following structure: { "Recipe_name": "string", "Ingredients_list": ["array of ingredients and quantity"], "Serving_Size": "string", "Time_to_prepare_and_cook": "string", "Instructions": ["array of instructions that are ordered"], "Nutrition_information": { "calories": "string", "protein": "string", "carbohydrates": "string", "Fat": "string" } }`,
              },
            ],
            max_tokens: 500,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            },
          }
        );
        let responseData = response.data.choices[0].message.content.trim();

        // Remove unwanted characters
        responseData = responseData.replace(/```json|```/g, "").trim();

        const data = JSON.parse(responseData);
        valid = validateSchema(data);
        if (valid) {
          setRecipe(data);
        }
      }
    } catch (err) {
      setError("Error generating recipe. Please try again. " + err);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ p: 2, backgroundColor: "#F0F0F0", minHeight: "100vh" }}>
      {/* Title and Generate Recipe Button */}
      <Typography
        variant="h4"
        sx={{ mb: 2, color: "#5074E7", fontWeight: "bold" }}
      >
        Recipe Generator
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateRecipe}
        sx={{
          mb: 2,
          backgroundColor: "#5074E7",
          "&:hover": {
            backgroundColor: "rgba(64, 99, 201, 0.9)",
          },
          fontWeight: "bold",
        }}
      >
        Generate Recipe
      </Button>

      {/* Error Message */}
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      {/* Recipe details when generated*/}
      {recipe && (
        <Grid container spacing={3} alignItems="stretch">
          {/* Name, serving size, time */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={recipe.Recipe_name}
                titleTypographyProps={{ variant: "h5" }}
              />
              <CardContent sx={{ mt: -2 }}>
                <Typography variant="body1" gutterBottom>
                  <RestaurantIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  <strong>Serving Size:</strong> {recipe.Serving_Size}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <TimerIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  <strong>Time to prepare and cook:</strong>{" "}
                  {recipe.Time_to_prepare_and_cook}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Ingredients List */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardHeader
                title="Ingredients"
                titleTypographyProps={{ variant: "h6" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                  {recipe.Ingredients_list.map(
                    (ingredient: string, index: number) => (
                      <Grid item xs={12} key={index}>
                        <Paper sx={{ p: 1, backgroundColor: "#E8F5E9" }}>
                          <KitchenIcon
                            sx={{ verticalAlign: "middle", mr: 1 }}
                          />
                          {ingredient}
                        </Paper>
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Nutrition Information */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardHeader
                title="Nutrition Information"
                titleTypographyProps={{ variant: "h6" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body1" gutterBottom>
                  <EmojiFoodBeverageIcon
                    sx={{ verticalAlign: "middle", mr: 1 }}
                  />
                  <strong>Calories:</strong>{" "}
                  {recipe.Nutrition_information.calories}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <EmojiFoodBeverageIcon
                    sx={{ verticalAlign: "middle", mr: 1 }}
                  />
                  <strong>Protein:</strong>{" "}
                  {recipe.Nutrition_information.protein}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <EmojiFoodBeverageIcon
                    sx={{ verticalAlign: "middle", mr: 1 }}
                  />
                  <strong>Carbohydrates:</strong>{" "}
                  {recipe.Nutrition_information.carbohydrates}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <EmojiFoodBeverageIcon
                    sx={{ verticalAlign: "middle", mr: 1 }}
                  />
                  <strong>Fat:</strong> {recipe.Nutrition_information.Fat}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Instructions */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Instructions"
                titleTypographyProps={{ variant: "h6" }}
              />
              <CardContent>
                <Grid container spacing={1}>
                  {recipe.Instructions.map(
                    (instruction: string, index: number) => (
                      <Grid item xs={12} key={index}>
                        <Paper sx={{ p: 1, backgroundColor: "#FFFDE7" }}>
                          {instruction}
                        </Paper>
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Recipe;
