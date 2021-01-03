import axios from 'axios';


export const polygonApi = axios.create({
  baseURL: `https://api.polygon.io/`,
  timeout: 7000,
  // headers: {'X-Custom-Header': 'foobar'}
});