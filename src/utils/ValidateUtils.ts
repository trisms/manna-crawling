export const isEmpty = (val) => {
	return val === undefined || val === null || Number.isNaN(val);
};

export const isNotEmpty = (val) => {
	return !isEmpty(val);
};

export const isBlank = (val) => {
	return isEmpty(val) || val === '';
};

export const isNotBlank = (val) => {
	return !isBlank(val);
};

export const displayOrDefault = (value: string | null | undefined, text?: string): string => {
	const content = text ? text : '미등록';

	return isBlank(value) ? `<span style="color:red;">${content}</span>` : value;
};

export const validateForm = (form, requiredForm) => {
	return requiredForm.some((reqForm) => {
		let validFn;
		if (
			reqForm.formType === ValidateFormType.TEXT ||
			reqForm.formType === ValidateFormType.SEARCH ||
			reqForm.formType === ValidateFormType.NOT_BLANK_SELECT
		) {
			validFn = isBlank;
		} else {
			validFn = isEmpty;
		}

		if (validFn(form[reqForm.key])) {
			let warnWord;
			if (reqForm.formType === ValidateFormType.TEXT) {
				warnWord = '입력';
			} else if (reqForm.formType === ValidateFormType.SELECT || reqForm.formType === ValidateFormType.NOT_BLANK_SELECT) {
				warnWord = '선택';
			} else if (reqForm.formType === ValidateFormType.SEARCH) {
				warnWord = '검색';
			}
			window.Swal.fire({
				icon: 'warning',
				text: `${checkWord(reqForm.text)} ${warnWord}해주세요.`,
				confirmButtonText: '확인',
			});

			return isBlank(form[reqForm.key]);
		}
	});
};
export const checkWord = (name) => {
	//name의 마지막 음절의 유니코드(UTF-16)
	const charCode = name.charCodeAt(name.length - 1);

	//유니코드의 한글 범위 내에서 해당 코드의 받침 확인
	const consonantCode = (charCode - 44032) % 28;

	if (consonantCode === 0) {
		//0이면 받침 없음 -> 를
		return `${name}를`;
	}
	//1이상이면 받침 있음 -> 을
	return `${name}을`;
};

export const ValidateFormType = {
	TEXT: 'text',
	SEARCH: 'search',
	SELECT: 'select',
	NOT_BLANK_SELECT: 'notBlankSelect',
};
