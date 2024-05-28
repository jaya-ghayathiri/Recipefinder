import React, { useEffect, useState } from "react";
import "../styles/RecipeStyle.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = () => {
    fetch("http://localhost:2000/auth/recipe", {
      method: "GET",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch recipe data");
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(
        `http://localhost:2000/auth/recipe/${recipeId}`,
        {
          method: "DELETE",
        }
      );
      toast.success("Recipe deleted successfully");
      getRecipes();
    } catch (error) {
      toast.error("An error occurred while deleting the recipe:" + error.message);

      setTimeout(() => {
        window.location.href = "/recipes";
      }, 3000);
    }
  };

  const SearchRecipes = async (e) => {
    try {
      if (e.target.value) {
        // Construct the search query based on the input value
        const searchQuery = encodeURIComponent(e.target.value);
        
        // Send a GET request to search recipes by day
        const searchedRecipes = await fetch(
          `http://localhost:2000/auth/searchRecipes/${searchQuery}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${localStorage.getItem('token')}`,
            },
          }
        );
  
        if (searchedRecipes.ok) {
          const data = await searchedRecipes.json();
          setRecipes(data);
        } else {
          const data = await searchedRecipes.json();
          toast.error(data.error);
        }
      } else {
        getRecipes();
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  
    

  return (
    <div className="Recipes">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes by day"
          onChange={(e) => SearchRecipes(e)}
        />
      </div>

      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div key={recipe._id} className="Recipe">
            <h2>{recipe.title}</h2>
            <img src={recipe.imageUrl} alt={recipe.title} />
            <h3>Ingredients:</h3>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <div className="instructions-container">
              <h3>Instructions:</h3>
              <ol>
                {recipe.instructions.split("\n").map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <button
              className="delete-button"
              onClick={() => handleDeleteRecipe(recipe._id)}
            >
              Delete
            </button>
            <Link to={"/addRecipe"}>Add more recipes</Link>
          </div>
        ))
      ) : (
        <h2 className="no-recipes">No Recipes Found</h2>
      )}
      <ToastContainer />
    </div>
  );
};

export default Recipes;
