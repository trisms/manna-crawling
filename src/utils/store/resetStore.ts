import { cloneDeepObj } from '@/utils/FormUtils';

export function resetStore({ store }) {
	const initialState = cloneDeepObj(store.$state);
	store.$reset = () => store.$patch(cloneDeepObj(initialState));
}
