import axios from 'axios';

const api = axios.create({
    baseURL: 'https://bejobber-backend.herokuapp.com/'
})

export default api;