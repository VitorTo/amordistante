import { computed, provide } from 'vue'
import axios from 'axios'

const ENDPOINT_URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Cria uma instância direta do axios
const httpInstance = axios.create({
    baseURL: ENDPOINT_URL_BASE
});

export const useConfigProvides = () => {
    provide('$http', httpInstance);
    provide('token', computed(() => null));
}
