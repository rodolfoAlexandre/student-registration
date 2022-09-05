import axios, { AxiosInstance } from "axios"

const api: AxiosInstance = axios.create({
    baseURL: 'https://student-registration-test.herokuapp.com'
    //baseURL: 'http://localhost:3000'
});

export default api;