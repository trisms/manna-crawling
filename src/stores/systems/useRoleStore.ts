import { defineStore } from 'pinia';
import { RoleType } from "@/types/systems/RoleType";

export const useRoleStore = defineStore('useRoleStore', {
	state: () => ({
		items: [] as RoleType[],
	}),
	actions: {
		callListAPI() {
			this.items = [
				{
					roleId: 1,
					roleType: 1,
				},
			];
		},
	},
});
