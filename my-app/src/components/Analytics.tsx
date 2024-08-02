"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useSession } from "next-auth/react";
import { collection, query, getDocs } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import Loading from "./Loading";

// register with chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Schema
interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  comments: string;
  category: string;
}

const Analytics = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [chartData, setChartData] = useState<any>({});
  const [totalItems, setTotalItems] = useState<number>(0);
  const [mostCommonCategory, setMostCommonCategory] = useState<string>("");
  const [leastCommonCategory, setLeastCommonCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (user) {
      // Fetch pantry items from Firestore
      const fetchItems = async () => {
        setLoading(true);
        const q = query(collection(db, "pantry", user.id, "items"));
        const querySnapshot = await getDocs(q);
        const itemsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PantryItem[];
        setItems(itemsList);
        const categoryCount: { [key: string]: number } = {};
        itemsList.forEach((item) => {
          categoryCount[item.category] =
            (categoryCount[item.category] || 0) + 1;
        });
        const data = {
          labels: Object.keys(categoryCount),
          datasets: [
            {
              data: Object.values(categoryCount),
              backgroundColor: [
                "#FF6384", // Red
                "#36A2EB", // Blue
                "#FFCE56", // Yellow
                "#4BC0C0", // Teal
                "#9966FF", // Purple
                "#FF9F40", // Orange
                "#FF6384", // Red
                "#36A2EB", // Blue
                "#FFCE56", // Yellow
              ],
            },
          ],
        };

        setLoading(false);


        // Update chart data
        setChartData(data);

        // Total items
        setTotalItems(itemsList.length);

        // Most common + least
        const sortedCategories = Object.entries(categoryCount).sort(
          (a, b) => b[1] - a[1]
        );
        setMostCommonCategory(sortedCategories[0]?.[0] || "");
        setLeastCommonCategory(
          sortedCategories[sortedCategories.length - 1]?.[0] || ""
        );
      };
      fetchItems();
    }
  }, [user]);

  // Loading until ingredients are fetched from db
  if (loading) {
    return <Loading />;
  }

  // Display message if pantry is empty
  if (items.length === 0) {
    return (
      <div>
        Your pantry is empty. Please add some items to view analytics here.
      </div>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {/* Pie Chart on category amount */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              {/* Render or load */}
              {chartData.labels ? (
                <Pie
                  data={chartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                  height={200}
                />
              ) : (
                <Loading />
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* Most + Least + Total Data */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">
                Total Ingredients:
              </Typography>
              <Typography variant="body1">{totalItems}</Typography>
              <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                Most Common Category:
              </Typography>
              <Typography variant="body1">{mostCommonCategory}</Typography>
              <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                Least Common Category:
              </Typography>
              <Typography variant="body1">{leastCommonCategory}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Table for ingredient information */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity.split(" ")[0]}</TableCell>
                    <TableCell>{item.quantity.split(" ")[1]}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.comments}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
