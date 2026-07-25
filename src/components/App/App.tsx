import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Pagination from '../Pagination/Pagination';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import css from './App.module.css';
import NoteForm from '../NoteForm/NoteForm';
import { useDebouncedCallback } from 'use-debounce';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';

export default function App() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModal, setIsModal] = useState(false);

  const { data, isError, isSuccess, isLoading } = useQuery({
    queryKey: ['notes', currentPage, search],
    queryFn: () => fetchNotes(currentPage, search),
    // enabled: search !== '',
    placeholderData: keepPreviousData,
  });

  const handleSearch = useDebouncedCallback(searchText => {
    setSearch(searchText);
    setCurrentPage(1);
  }, 500);

  const openModal = () => {
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
  };

  const totalPages = data?.totalPages ?? 0;
  return (
    <div className={css.app}>
      <div>
        <Toaster
          toastOptions={{
            className: '',
            duration: 1000,
            removeDelay: 1000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isSuccess && data.notes.length === 0 && (
        <p className={css.text_no_results}>Not found posts for your search</p>
      )}
      {isModal && (
        <Modal
          onClose={closeModal}
          children={<NoteForm onClose={closeModal} />}
        />
      )}
    </div>
  );
}
