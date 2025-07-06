import axios from 'axios'

const ENDPOINT_URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const instance = {
    options: null,
    value: null,
    provides: null,
    emit: null
}

function interceptorRequest(config) {
    if (config.includeAppAuthorization != false
        && instance.provides.token.value
        && !config.headers['Authorization']) {

			config.headers['Authorization'] = `Bearer ${instance.provides.token.value}`
    }

    return config
}

function interceptorRequestError(error) {
    return Promise.reject(error)
}

function interceptorResponse(response) {
    return response;
}

function interceptorResponseError(error) {
    if (error.response && error.response.status === 401) {
        instance.emit('unauthorized-error')
    }

    return Promise.reject(error);
}

export default {
    install(app, options) {
			console.log("APP", app.config.globalProperties)
			console.log("OPTIONS", options)
        if (app.config.globalProperties.$http) return

        instance.options = options
        instance.value = axios.create({
            baseURL: ENDPOINT_URL_BASE
        })
        instance.value.interceptors.request.use(interceptorRequest, interceptorRequestError)
        instance.value.interceptors.response.use(interceptorResponse, interceptorResponseError)

        app.config.globalProperties.$http = instance.value
    },
    useProvides(vueInstance) {
        instance.provides = vueInstance.provides
        instance.emit = vueInstance.emit
    }
}


// import axios from 'axios';
// import { useAuthStore } from '@/stores/auth';

// // TODO PASSAR PARA .ENV
// const ENDPOINT_API_URL = 'http://localhost:3000'

// const $http = axios.create({
//   // baseURL: 'http://192.168.12.5:3000',
//   baseURL: ENDPOINT_API_URL,
//   timeout: 1000,
//   headers: { 'Content-Type': 'application/json' },
//   withCredentials: true, // para cookies HttpOnly
// });

// function setupInterceptors(store) {
// 	const authStore = store;
// 	// Interceptor de requisições: adiciona access token
// 	$http.interceptors.request.use(config => {
// 		const token = authStore().accessToken;
// 		if (token) config.headers.Authorization = `Bearer ${token}`;
// 		return config;
// 	});

// 	// Interceptor de respostas: tenta refrescar se 401
// 	let isRefreshing = false;
// 	let subscribers = [];

// 	function onRefreshed(token) {
// 		subscribers.forEach(cb => cb(token));
// 		subscribers = [];
// 	}

// 	$http.interceptors.response.use(null, async error => {
// 		const { config, response } = error;
// 		if (response?.status === 401 && !config._retry) {
// 			if (isRefreshing) {
// 				return new Promise(resolve => {
// 					subscribers.push(token => {
// 						config.headers.Authorization = `Bearer ${token}`;
// 						resolve($http(config));
// 					});
// 				});
// 			}
// 			config._retry = true;
// 			isRefreshing = true;
// 			try {
// 				const { data } = await axios.post(`${ENDPOINT_API_URL}/auth/refresh`, {}, { withCredentials: true });
// 				authStore().setAccessToken(data.accessToken);
// 				onRefreshed(data.accessToken);
// 				return $http(config);
// 			} catch (e) {
// 				authStore().logout();
// 				return Promise.reject(e);
// 			} finally {
// 				isRefreshing = false;
// 			}
// 		}
// 		return Promise.reject(error);
// 	});
// }

// export default {
// 	install(app, options) {
// 		console.log('INSTALL', app.config.globalProperties)
// 		if (app.config.globalProperties.$http) return

// 		setupInterceptors(useAuthStore());
// 		console.log('HTTP', $http)

// 		app.config.globalProperties.$http = $http
// 	},
// }
