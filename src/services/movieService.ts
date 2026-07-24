import axios from 'axios';
import type { Movie } from '../types/movie';

interface MoviesHttpResponse {
    results: Movie[];
    total_pages: number;
}

export const fetchMovies = async (movieName: string, page: number): Promise<MoviesHttpResponse> => {
    const response = await axios.get<MoviesHttpResponse>(
        'https://api.themoviedb.org/3/search/movie',
        {
            params: {
                query: movieName,
                page,
            },
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            },
        }
    );

    return response.data;
};
