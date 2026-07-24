import axios from "axios";
import type { Note } from "../types/note";

const notehubApi = axios.create({
    baseURL: 'https://notehub-public.goit.study/api'
})

interface NotesHttpResponse {
    notes: Note[];
    totalPages: number;
}

export async function fetchNotes(page: number, userInput: string): Promise<NotesHttpResponse> {

    const response = await notehubApi.get<NotesHttpResponse>('/notes', {
        params: {
            search: userInput,
            page,
            perPage: 12
        },
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
        },

    })
    console.log(response.data)
    return response.data

}


