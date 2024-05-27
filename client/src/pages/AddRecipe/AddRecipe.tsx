// @ts-nocheck
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Ensure this is the correct import for your axios instance
import axiosClient from '../../axios/axiosClient';
import axios from 'axios';
import toast from 'react-hot-toast';
import { refetchedUserData } from '../../services/refetchedUserData';
import { saveState } from '../../middleware/sessionStorage';
import { loginUserSuccess } from '../../actions/actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  imageUrl: z.instanceof(FileList).refine((files) => files.length === 1, "Image is required."),
  details: z.string().min(1, "Details are required."),
  country: z.string().min(1, "Country is required."),
  youtubeLink: z.string().url().optional(),
  category: z.enum(['Beef', 'Chicken', 'Rice', 'Vegetables'], {
    required_error: "Category is required."
  }),
  recipeName: z.string().min(1, "Recipe name is required."),
});

const AddRecipe = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate()


  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const createRecipe = async ({ recipeData, token }) => {
    console.log(recipeData, token)
    const { data } = await axiosClient.post("recipes/", recipeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };


  const mutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      toast.success("recipe created successfully")
      const response = refetchedUserData(user?.accessToken)
      console.log(response)
      saveState({ user?.data });
      dispatch(loginUserSuccess(response?.data));
      navigate('/recipe')
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });

  const onSubmit = async (data) => {
    if (user?.accessToken) {

      const imageformData = new FormData();
      imageformData.append('image', data.imageUrl[0]);
      try {
        const imgBBApiKey = import.meta.env.VITE_IMGBBAPIKEY;
        console.log(data.imageUrl[0])
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgBBApiKey}`, imageformData);
        if (response?.data?.data?.display_url) {
          // const formData = new FormData();
          const updatedData = {
            ...data,
            imageUrl?.data?.data?.display_url,
          }

          mutation.mutate({ recipeData: updatedData, token: user.accessToken });
        }

      } catch (error) {
        console.log(error)
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Image URL</label>
        <input type='file' {...register('imageUrl')} />
        {errors.imageUrl && <p>{errors.imageUrl.message}</p>}
      </div>
      <div>
        <label>Details</label>
        <textarea {...register('details')} />
        {errors.details && <p>{errors.details.message}</p>}
      </div>
      <div>
        <label>Country</label>
        <input {...register('country')} />
        {errors.country && <p>{errors.country.message}</p>}
      </div>
      <div>
        <label>YouTube Link</label>
        <input {...register('youtubeLink')} />
        {errors.youtubeLink && <p>{errors.youtubeLink.message}</p>}
      </div>
      <div>
        <label>Category</label>
        <select {...register('category')}>
          <option value="Beef">Beef</option>
          <option value="Chicken">Chicken</option>
          <option value="Rice">Rice</option>
          <option value="Vegetables">Vegetables</option>
        </select>
        {errors.category && <p>{errors.category.message}</p>}
      </div>
      <div>
        <label>Recipe Name</label>
        <input {...register('recipeName')} />
        {errors.recipeName && <p>{errors.recipeName.message}</p>}
      </div>
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Creating...' : 'Create Recipe'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Recipe created successfully!</p>}
    </form>
  );
};

export default AddRecipe;
