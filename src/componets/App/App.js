import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArticleConteiner } from './App.styled';
import Modal from '../Modal';
import ImageGallery from '../ImageGallery';
import Searchbar from '../Searchbar';
import ImagesAPI from '../../services/ImagesAPI';
import ButtonLoad from '../Button';
import Loader from '../Loader';

export default function App() {
  const [images, setImages] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const [activeImage, setActiveImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(true);
  const [tags, setTags] = useState('');

  useEffect(() => {
    setImages([]);
  }, [query]);

  useEffect(() => {
    if (query === '') {
      return;
    }
    setVisible(true);
    setStatus('pending');
    ImagesAPI.fetchImages(query, page)
      .then(({ hits }) => {
        if (!query) {
          setStatus('idle');
          return toast.error(`There are no matching images: "${query}"!`);
        }
        if (hits.length === 0) {
          setStatus('resolved');
          setVisible(false);
          return toast.error(`There are no matching images for: "${query}"!`);
        }
        setImages(prevImages => [...prevImages, ...hits]);
        setStatus('resolved');
      })
      .finally(() => {
        if (page > 1) {
          scrollTo();
        }
      })
      .catch(error => {
        setError(error);
        setStatus('rejected');
        return toast.error(`There are no matching images for: "${query}"!`);
      });
  }, [query, page]);

  const scrollTo = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleClickLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleSubmitUserQuery = query => {
    setQuery(query.trim());
    setPage(1);
  };

  const onClickImage = (activeImge, tags) => {
    setActiveImage(activeImge);
    setTags(tags);
    setShowModal(prevShowModal => !prevShowModal);
  };

  const toggleModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
  };

  if (status === 'idle') {
    return (
      <ArticleConteiner>
        <ToastContainer position="top-right" autoClose={3000} />
        <Searchbar onSubmit={handleSubmitUserQuery} />
      </ArticleConteiner>
    );
  }

  if (status === 'rejected') {
    return (
      <ArticleConteiner>
        <Searchbar onSubmit={handleSubmitUserQuery} />
        <h2>{error.message}</h2>
      </ArticleConteiner>
    );
  }

  if (status === 'pending') {
    return (
      <ArticleConteiner>
        <ToastContainer position="top-right" autoClose={3000} />
        <Searchbar onSubmit={handleSubmitUserQuery} />
        <ImageGallery userImages={images} onClick={onClickImage} />
        <Loader />
      </ArticleConteiner>
    );
  }

  if (status === 'resolved') {
    return (
      <ArticleConteiner>
        <ToastContainer position="top-right" autoClose={3000} />
        <Searchbar onSubmit={handleSubmitUserQuery} />
        <ImageGallery userImages={images} onClick={onClickImage} />
        {images.length && visible && (
          <ButtonLoad onClick={handleClickLoadMore} />
        )}
        {showModal && (
          <Modal image={activeImage} tags={tags} onModalClose={toggleModal} />
        )}
      </ArticleConteiner>
    );
  }
}
