import api from '../api';

export const fetchSuggestions = async () => {
    const { data } = await api.get('/suggestions/');
    return data;
};