import { defineStore } from "pinia";
import { useRouter } from 'vue-router';
import { $http } from '@/plugins/axios';

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

				// Salvar token no localStorage para usar nos interceptors
				localStorage.setItem('accessToken', data.accessToken);

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

				// Limpar token do localStorage
				localStorage.removeItem('accessToken');

        const router = useRouter();
        router.push('/login');
      }
    },

    setAccessToken(token) {
      this.accessToken = token;
			// Sincronizar com localStorage
			if (token) {
				localStorage.setItem('accessToken', token);
			} else {
				localStorage.removeItem('accessToken');
			}
    },

		// Recuperar token do localStorage ao inicializar
		initializeAuth() {
			const token = localStorage.getItem('accessToken');
			if (token) {
				this.accessToken = token;
			}
		}
  },
});
