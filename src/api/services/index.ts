import {noAuthApiCall as noAuthApi, apiCall as authAPI, jigBaeApiCall} from '@/api/services/callInstances';

export function getNoAuthApiCall() {
	return noAuthApi;
}
export function getApiCall() {
	return authAPI;
}
export function getJigBaeApiCall() {
	return jigBaeApiCall;
}
