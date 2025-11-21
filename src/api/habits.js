import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/habits',
  headers: { 'Content-Type': 'application/json' }
});

export async function getHabits(sort) {
  try {
    const res = await api.get('/', { params: { sort } });
    return res.data;
  } catch (err) {
    console.error('getHabits error', err);
    throw err;
  }
}

export async function createHabit(name) {
  try {
    const res = await api.post('/', { name });
    return res.data;
  } catch (err) {
    console.error('createHabit error', err);
    throw err;
  }
}

export async function toggleHabit(id) {
  try {
    const res = await api.post(`/${id}/toggle`);
    return res.data;
  } catch (err) {
    console.error('toggleHabit error', err);
    throw err;
  }
}

export async function deleteHabit(id) {
  try {
    const res = await api.delete(`/${id}`);
    return res.data;
  } catch (err) {
    console.error('deleteHabit error', err);
    throw err;
  }
}
