// src/components/RecipeForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipeSchema } from '../utils/validation';
import { z } from 'zod';
import axios from 'axios';

type RecipeFormValues = z.infer<typeof recipeSchema>;

const RecipeForm = () => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RecipeFormValues>({
        resolver: zodResolver(recipeSchema),
    });

    const onSubmit = async (data: RecipeFormValues) => {
        try {
            const response = await axios.post('/api/recipes', { ...data, imageUrl });
            ;
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.url);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Email:</label>
                <input {...register('creatorEmail')} />
                {errors.creatorEmail && <p>{errors.creatorEmail.message}</p>}
            </div>
            <div>
                <label>Image:</label>
                <input type="file" onChange={handleImageUpload} />
                {imageUrl && <img src={imageUrl} alt="Uploaded" />}
            </div>
            <div>
                <label>Image URL:</label>
                <input {...register('imageUrl')} value={imageUrl} readOnly />
                {errors.imageUrl && <p>{errors.imageUrl.message}</p>}
            </div>
            <div>
                <label>Details:</label>
                <textarea {...register('details')} />
                {errors.details && <p>{errors.details.message}</p>}
            </div>
            <div>
                <label>Country:</label>
                <input {...register('country')} />
                {errors.country && <p>{errors.country.message}</p>}
            </div>
            <div>
                <label>YouTube Link:</label>
                <input {...register('youtubeLink')} />
                {errors.youtubeLink && <p>{errors.youtubeLink.message}</p>}
            </div>
            <div>
                <label>Category:</label>
                <input {...register('category')} />
                {errors.category && <p>{errors.category.message}</p>}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default RecipeForm;
