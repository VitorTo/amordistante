import axios from 'axios';

const $http = axios.create({
  baseURL: 'http://192.168.12.5:3000',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' }
});

export default $http;
