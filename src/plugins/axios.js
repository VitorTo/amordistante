import axios from 'axios'

const ENDPOINT_URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Cria uma instância do axios centralizada
export const $http = axios.create({
    baseURL: ENDPOINT_URL_BASE,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor para adicionar token nas requisições
$http.interceptors.request.use(
    (config) => {
        // Verificar se existe token no localStorage ou em store
        const token = localStorage.getItem('accessToken')
        if (token && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor para tratar respostas
$http.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Limpar token inválido
            localStorage.removeItem('accessToken')
            // Redirecionar para login se necessário
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Plugin para Vue (opcional)
export default {
    install(app) {
        app.config.globalProperties.$http = $http
    }
}
