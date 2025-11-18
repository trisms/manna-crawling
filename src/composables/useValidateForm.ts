import { ref, unref, watch } from 'vue';
import * as yup from 'yup';

const schema = ref(null);
const validator = ref({});

const setValidator = ({ key, type }: { key: string; type: 'string' | 'number' | 'array' }): void => {
	const keys = Object.keys(validator.value);
	if (keys.findIndex((k) => k === key) === -1) {
		validator.value[key] = generateYupRoles(type);
	}
};

const generateYupRoles = (type) => {
	switch (type) {
		case 'string':
			return yup.string().required();
		case 'number':
			return yup.number().required();
		case 'array':
			return yup.array().required();
		default:
			return yup.string().required();
	}
};

export const getSchema = () => {
	return schema;
};

watch(
	() => validator.value,
	() => {
		schema.value = yup.object(unref(validator));
	},
	{ deep: true },
);

export { setValidator, schema };
