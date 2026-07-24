// import toast from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (selectedMovie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  // if (movies.length === 0) {
  //   const notify = () => toast('No movies found for your request.');
  //   notify();
  //   return;
  // }
  return (
    <ul className={css.grid}>
      {/* Набір елементів списку з фільмами */}
      {movies.map(movie => {
        return (
          <li key={movie.id} onClick={() => onSelect(movie)}>
            <div className={css.card}>
              <img
                className={css.image}
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
                loading="lazy"
              />
              <h2 className={css.title}>{movie.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
