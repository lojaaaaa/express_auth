import { API_URL } from '@/constants'
import { getAccessToken, removeFromStorage } from '@/services/auth/auth.helper'
import axios, { CreateAxiosDefaults } from 'axios'
import { errorCatch, getContentType } from './api.helper'
import authService from '@/services/auth/auth.service'

const axiosOptions: CreateAxiosDefaults = {
	baseURL: API_URL,
	headers: getContentType(),
	withCredentials: true,
}

export const axiosClassic = axios.create(axiosOptions)

axiosClassic.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

axiosClassic.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config

		console.log('fdsfdsfdsf')

		if (
			(error?.response?.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true
			try {
				await authService.getNewTokens()
				return await axiosClassic.request(originalRequest)
			} catch (error) {
				if (
					errorCatch(error) === 'jwt expired' ||
					errorCatch(error) === 'Refresh token not passed'
				)
					removeFromStorage()
			}
		}

		throw error
	}
)