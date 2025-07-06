import { defineStore } from "pinia";
import { useRouter } from 'vue-router';
import axios from 'axios';

const ENDPOINT_URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Cria uma instância do axios para autenticação
const $http = axios.create({
    baseURL: ENDPOINT_URL_BASE
});

// Mock para simular o endpoint de login
const mockUsers = [
  {
    "id": "1",
    "profileId": "1",
    "name": "Vitor Gabriel",
    "email": "vitor.gabriel@123.com",
    "password": "senha123"
  },
  {
    "id": "2",
    "profileId": "1",
    "name": "Maria Cristina",
    "email": "maria.cristina@123.com",
    "password": "senha123"
  },
  {
    "id": "3",
    "profileId": "2",
    "name": "Teste Cristina",
    "email": "teste.cristina@123.com",
    "password": "senha123"
  },
  {
    "id": 1,
    "name": "Usuário Teste",
    "email": "teste@email.com",
    "password": "senha123"
  }
];

// Interceptor para simular resposta de login
$http.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se a requisição for para /api/auth/login, simula a resposta
    if (error.config?.url === '/api/auth/login') {
      const { email, password } = error.config?.data ? JSON.parse(error.config.data) : {};

      const user = mockUsers.find(u => u.email === email && u.password === password);

      if (user) {
        console.log('✅ Login realizado com sucesso:', user.name);
        return Promise.resolve({
          data: {
            accessToken: `mock-token-${user.id}-${Date.now()}`,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              profileId: user.profileId
            }
          }
        });
      } else {
        console.log('❌ Credenciais inválidas');
        return Promise.reject({
          response: {
            data: {
              message: 'Credenciais inválidas'
            }
          }
        });
      }
    }

    return Promise.reject(error);
  }
);

export const useAuthStore = defineStore("authStore", {
  state: () => ({
		accessToken: null,
		user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
  actions: {
    async login(email, password) {
      try {
        const response = await $http.post('/api/auth/login', { email, password });
        const data = response?.data;

				if (!data) throw new Error('FAILED_LOGIN - Nenhum dado recebido');

				if (!data.accessToken) {
				  throw new Error('FAILED_LOGIN - Token não encontrado');
				}

				// Define o token diretamente no estado
				this.accessToken = data.accessToken;
				this.user = data.user || null;

        return data;
      } catch (error) {
        console.error('FAILED_LOGIN:', error);
        throw new Error(error.response?.data?.message || error.message || 'FAILED_LOGIN');
      }
    },

    async logout() {
      try {
        await $http.post('/api/auth/logout');
      } catch (error) {
        console.error('ERROR_LOGOUT:', error);
      } finally {
        this.accessToken = null;
        this.user = null;

        const router = useRouter();
        router.push('/login');
      }
    },

    setAccessToken(token) {
      this.accessToken = token;
    },
  },
});
