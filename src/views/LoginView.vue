<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Seu email"
          />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Sua senha"
          />
        </div>
        <button
          type="submit"
          class="btn-primary"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { HOME_PAGE_URL } from '@/utils/consts';

export default {
	name: 'LoginView',
	setup() {
		const router = useRouter();
		const authStore = useAuthStore();

		return {
			router,
			authStore
		}
	},
	data() {
		return {
			email: '',
			password: '',
			errorMessage: '',
			isLoading: false,
		};
	},
	methods: {
		async handleLogin() {
			if (!this.email || !this.password) {
				this.errorMessage = 'Por favor, preencha todos os campos.';
				return;
			}

			try {
				this.isLoading = true;
				this.errorMessage = '';

				await this.authStore.login(this.email, this.password);
				this.router.push(HOME_PAGE_URL);
			} catch (error) {
				this.errorMessage = error.message || 'Falha ao fazer login. Verifique suas credenciais.';
			} finally {
				this.isLoading = false;
			}
		}
	}
};

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 24px;
  color: var(--color-primary);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
