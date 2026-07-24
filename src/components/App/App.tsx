import toast, { Toaster } from 'react-hot-toast';
// import SearchBar from '../SearchBar/SearchBar';
// import MovieGrid from '../MovieGrid/MovieGrid';
import { useEffect, useState } from 'react';

// import Loader from '../Loader/Loader';
// import ErrorMessage from '../ErrorMessage/ErrorMessage';
// import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Pagination from '../Pagination/Pagination';
import { fetchNotes } from '../../services/notesService';
import type { Note } from '../../types/note';
import NoteList from '../NoteList/NoteList';

import css from './App.module.css';
import NoteForm from '../NoteForm/NoteForm';

export default function App() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMovie, setModalMovie] = useState<Note | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', currentPage],

    queryFn: () => fetchNotes(currentPage, search),

    // enabled: search !== '',
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data?.notes.length === 0) {
      const notify = () => toast('No notes found for your request.');
      notify();
    }
  }, [isSuccess, data]);

  const handleClick = () => {
    fetchNotes(currentPage, search);
  };

  const totalPages = data?.totalPages ?? 0;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button}>Create note +</button>
      </header>
      {isSuccess && <NoteList notes={data.notes} />}
      <NoteForm />
    </div>
  );

  // const totalPages = data?.total_pages ?? 0;

  // const handleSearch = async (query: string) => {
  //   setQuery(query);
  //   setCurrentPage(1);
  // };

  // const openModal = (selectedMovie: Movie) => {
  //   setModalMovie(selectedMovie);
  // };

  // const closeModal = () => {
  //   setModalMovie(null);
  // };

  // return (
  //   <>
  //     <div>
  //       <Toaster />
  //     </div>

  //     <SearchBar onSubmit={handleSearch} />

  //     {isSuccess && totalPages > 1 && (
  //       <Pagination
  //         totalPages={totalPages}
  //         currentPage={currentPage}
  //         onPageChange={setCurrentPage}
  //       />
  //     )}

  //     {isLoading && <Loader />}
  //     {isError && <ErrorMessage />}

  //     {isSuccess && data.results.length > 0 && (
  //       <MovieGrid movies={data?.results} onSelect={openModal} />
  //     )}
  //     {modalMovie && <MovieModal movie={modalMovie!} onClose={closeModal} />}
  //   </>
  // );
}
