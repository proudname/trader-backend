import axios from "axios";


export const polygonApi = axios.create({
  baseURL: 'https://api.polygon.io/',
  timeout: 7000,
  validateStatus: () => true
})