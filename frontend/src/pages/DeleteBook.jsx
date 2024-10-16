import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  };

  const handleDeleteBook = () => {
    const token = getCookie('token');

    if (!token) {
      enqueueSnackbar('Error: No token found, please log in.', { variant: 'error' });
      return;
    }
    setLoading(true);
    axios.delete(`https://bookbazaar-backend.onrender.com/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book Deleted Successfully!', { variant: 'success' });
        navigate('/');
      })
      .catch((err) => {
        setLoading(false);
        //alert('An error happened. Please CHeck Console!');
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(err);
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Delete Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3>Are you sure you want to delete this book?</h3>
        <button className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteBook}>
          Yes, Delete it
        </button>
      </div>
    </div>
  )
}

export default DeleteBook;