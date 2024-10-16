import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  };

  const handleSaveBook = () => {
    const token = getCookie('token');

    if (!token) {
      enqueueSnackbar('Error: No token found, please log in.', { variant: 'error' });
      return;
    }
    const data = {
      title,
      author,
      publishYear,
    };
    setLoading(true);
    axios.post(`https://bookbazaar-backend.onrender.com/books`, data, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book Created Successfully!', { variant: 'success' });
        navigate('/');
      }).catch((err) => {
        setLoading(false);
        //alert('An error happened. Please CHeck Console!')
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(err);
      })
  }


  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Create Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input type="text"
            value={title}
            onChange={((e) => setTitle(e.target.value))}
            className='border-2 border-gray-500 px-4 ppy-2 w-full' />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input type="text"
            value={author}
            onChange={((e) => setAuthor(e.target.value))}
            className='border-2 border-gray-500 px-4 ppy-2 w-full' />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
          <input type="text"
            value={publishYear}
            onChange={((e) => setPublishYear(e.target.value))}
            className='border-2 border-gray-500 px-4 ppy-2 w-full' />
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleSaveBook}>
          Save
        </button>
      </div>
    </div>
  )
}

export default CreateBook;
