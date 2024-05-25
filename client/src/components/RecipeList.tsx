// src/components/RecipeList.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../features/recipes/recipeSlice';
import { RootState, AppDispatch } from '../app/store';

const RecipeList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { recipes, loading, error } = useSelector((state: RootState) => state.recipes);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);

    const lastRecipeElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    dispatch(fetchRecipes());
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, dispatch]
    );

    return (
        <div>
            {recipes.map((recipe, index) => (
                <div key={recipe._id} ref={index === recipes.length - 1 ? lastRecipeElementRef : null}>
                    <h2>{recipe.details}</h2>
                    <img src={recipe.imageUrl} alt={recipe.details} />
                    <p>{recipe.country}</p>
                    <p>{recipe.category}</p>
                </div>
            ))}
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default RecipeList;
