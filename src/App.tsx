import { useState } from "react";
import type { FormEvent } from "react";
import "./App.css";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { Button, Flex, Heading, Text, TextField, View } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRecipe = async (event: FormEvent) => {
    event.preventDefault();

    if (!ingredients.trim()) {
      setRecipe("Please enter at least one ingredient.");
      return;
    }

    setLoading(true);
    setRecipe("");

    try {
      const ingredientList = ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const response = await client.queries.generateRecipe({
        ingredients: ingredientList,
      });

      setRecipe(response.data || "No recipe generated. Try different ingredients.");
    } catch (error) {
      console.error(error);
      setRecipe("Something went wrong while generating the recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="app-container">
      <Flex direction="column" alignItems="center">
        <View className="header-container">
          <Heading level={1} className="main-header">
            AI-Powered <span className="highlight">Recipe Generator</span>
          </Heading>

          <Text className="description">
            Enter ingredients you already have, and this app will generate a recipe idea using AI.
          </Text>

          <Text fontWeight="bold" color="#2563eb" marginTop="1rem">
            Created by Richard Brooks
          </Text>
        </View>

        <View as="form" className="form-container" onSubmit={generateRecipe}>
          <Flex className="search-container">
            <TextField
              label="Ingredients"
              placeholder="chicken, rice, broccoli"
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              className="wide-input"
            />

            <Button type="submit" variation="primary" className="search-button">
              Generate Recipe
            </Button>
          </Flex>
        </View>

        <View className="result-container">
          {loading && (
            <View className="loader-container">
              <Text>Generating recipe...</Text>
            </View>
          )}

          {recipe && <View className="result">{recipe}</View>}
        </View>
      </Flex>
    </View>
  );
}

export default App;