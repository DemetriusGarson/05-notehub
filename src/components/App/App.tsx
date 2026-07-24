import toast, { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import { useEffect, useState } from 'react';
import type { Movie } from '../../types/movie';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Pagination from '../Pagination/Pagination';

// import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, currentPage],

    queryFn: () => fetchMovies(query, currentPage),

    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      const notify = () => toast('No movies found for your request.');
      notify();
    }
  }, [isSuccess, data]);

  const totalPages = data?.total_pages ?? 0;

  const handleSearch = async (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  const openModal = (selectedMovie: Movie) => {
    setModalMovie(selectedMovie);
  };

  const closeModal = () => {
    setModalMovie(null);
  };

  return (
    <>
      <div>
        <Toaster />
      </div>

      <SearchBar onSubmit={handleSearch} />

      {isSuccess && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && data.results.length > 0 && (
        <MovieGrid movies={data?.results} onSelect={openModal} />
      )}
      {modalMovie && <MovieModal movie={modalMovie!} onClose={closeModal} />}
    </>
  );
}
