import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    accept: 'application/json,',
    Authorization: null,
  },
});

export const getData = async (search: string) => {
  return await api.get(`/sick?q=${encodeURIComponent(`${search}`)}`);
};
