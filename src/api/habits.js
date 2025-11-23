import apiClient from './client';

export async function getHabits(sort) {
  try {
    const res = await apiClient.get('/habits', { params: { sort } });
    return res.data;
  } catch (err) {
    console.error('getHabits error', err);
    throw err;
  }
}

export async function createHabit(name) {
  try {
    const res = await apiClient.post('/habits', { name });
    return res.data;
  } catch (err) {
    console.error('createHabit error', err);
    throw err;
  }
}

export async function toggleHabit(id) {
  try {
    const res = await apiClient.post(`/habits/${id}/toggle`);
    return res.data;
  } catch (err) {
    console.error('toggleHabit error', err);
    throw err;
  }
}

export async function deleteHabit(id) {
  try {
    const res = await apiClient.delete(`/habits/${id}`);
    return res.data;
  } catch (err) {
    console.error('deleteHabit error', err);
    throw err;
  }
}
