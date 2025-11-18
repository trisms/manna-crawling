import moment from 'moment';
import { isEmpty } from '@/utils/ValidateUtils';
import { SearchDateType } from '@/types/datePicker/SearchDateType';
const FORMAT_YYYY_MM_DD = 'YYYY-MM-DD';
const FORMAT_YYYY_MM = 'YYYY-MM';
const FORMAT_YYYY_MM_DD_HH_MM_SS = 'YYYY-MM-DD HH:mm:ss';

export function nowDate(): string {
	return moment().format(FORMAT_YYYY_MM_DD);
}

export function nowMonth() {
	return moment().format(FORMAT_YYYY_MM);
}

export function firstDayOfMonth() {
	const dateObj = new Date();
	dateObj.setDate(1);
	return parseDateToyyyyMMddUseSymbol(dateObj);
}

export function firstMonthOfYear() {
	const dateObj = new Date();
	dateObj.setMonth(0);
	return parseDateToyyyyMMUseSymbol(dateObj);
}

/**
 * date 객체에 연,월,일 더하고 빼는 기능
 */
export function calculateDate(dateObj: Date, year: number, month: number, date: number): Date {
	if (!dateObj) {
		dateObj = new Date();
	}
	if (year) {
		dateObj.setFullYear(dateObj.getFullYear() + year);
	}
	if (month) {
		dateObj.setMonth(dateObj.getMonth() + month);
	}
	if (date) {
		dateObj.setDate(dateObj.getDate() + date);
	}

	return dateObj;
}

/**
 * date 객체에 시,분,초 더하고 빼는 기능
 */
export function calculateTime(dateObj: Date, hours: number, minites: number, seconds: number): Date {
	if (!dateObj) {
		dateObj = new Date();
	}
	if (hours) {
		dateObj.setHours(dateObj.getHours() + hours);
	}
	if (minites) {
		dateObj.setMinutes(dateObj.getMinutes() + minites);
	}
	if (seconds) {
		dateObj.setSeconds(dateObj.getSeconds() + seconds);
	}

	return dateObj;
}

/**
 * Date객체를 yyyyMMdd 문자열 형식으로 변환하는 기능
 * @param dateObj (변환을 적용할 Date객체)
 * @returns {string}
 */
export function parseDateToyyyyMMdd(dateObj: Date): string {
	const fullYear = dateObj.getFullYear();
	const month = dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;
	const date = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();

	return `${fullYear}${month}${date}`;
}
export function parseDateToyyyyMM(dateObj: Date): string {
	const fullYear = dateObj.getFullYear();
	const month = dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;

	return `${fullYear}${month}`;
}
export function convertStrToHHmmUseSymbol(timeStr: string): string {
	const time = timeStr.substring(0, 2);
	const min = timeStr.substring(2, 4);

	return `${time}:${min}`;
}

export function convertStrToyyyyMMddUseSymbol(str: string): string {
	return moment(str).format(FORMAT_YYYY_MM_DD);
}
export function convertStrToyyyyMMUseSymbol(str: string): string {
	return moment(str).format(FORMAT_YYYY_MM);
}

export function parseDateToyyyyMMddUseSymbol(dateObj: Date): string {
	if (dateObj) {
		const fullYear = dateObj.getFullYear();
		const month = dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;
		const date = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();

		return `${fullYear}-${month}-${date}`;
	}

	return '-';
}
export function parseDateToyyyyMMUseSymbol(dateObj: Date): string {
	if (dateObj) {
		const fullYear = dateObj.getFullYear();
		const month = dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;

		return `${fullYear}-${month}`;
	}

	return '-';
}

/**
 * Date객체를 yyyyMMdd HHmmss 문자열 형식으로 변환하는 기능
 */
export function parseDateToyyyyMMddHHmmss(dateObj: Date): string {
	return moment(dateObj).format(FORMAT_YYYY_MM_DD_HH_MM_SS);
	/*const fullYear = dateObj.getFullYear();
	const month = dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;
	const date = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();

	const hour = dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours();
	const minute = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
	const second = dateObj.getSeconds() < 10 ? '0' + dateObj.getSeconds() : dateObj.getSeconds();

	return `${fullYear}-${month}-${date} ${hour}:${minute}:${second}`;*/
}
export function parseDateToHHmm(dateObj: Date): string {
	const hour = dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours();
	const minute = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();

	return `${hour}:${minute}`;
}
export function dateValidate(sDate: Date, eDate: Date): { isWrong: boolean; msg: string } {
	const returnValue = {
		isWrong: false,
		msg: '',
	};

	let sTime: number;
	let eTime: number;
	if (sDate) {
		sTime = sDate.getTime();
	}
	if (eDate) {
		eTime = sDate.getTime();
	}

	if (sTime && eTime) {
		if (sTime > eTime) {
			returnValue.isWrong = true;
			returnValue.msg = '시작일이 종료일보다 클 수 없습니다.';
		}
	}

	return returnValue;
}

/*
 * api request body에 보낼 date 관련 property 포맷 수정 (ISO 형식 -> yyyy-mm-dd hh:mm:ss)
 * dateType: 리스트 검색시 startDate, endDate 구분
 */
export function parseISOStrToyyyyMMddHHmmss(dateVal: string | Date, dateType?: SearchDateType): string {
	if (isEmpty(dateVal)) {
		return null;
	}

	let isoVal: string;
	if (dateVal instanceof Date) {
		isoVal = dateVal.toISOString();
	} else {
		isoVal = dateVal;
	}
	const splitVal = isoVal.split('T');
	const yyyymmdd = splitVal[0];
	let hhmmss = splitVal[1].slice(0, 8);

	if (dateType) {
		switch (dateType) {
			case SearchDateType.START:
				hhmmss = '00:00:00';
				break;
			case SearchDateType.END:
				hhmmss = '23:59:59';
		}
	}
	return `${yyyymmdd} ${hhmmss}`;
}

/*
 * list api request param에 보낼 date 관련 property 포맷 수정 (ISO 형식 -> yyyy-mm-dd)
 */
export function parseISOStrToyyyyMMdd(dateVal: string | Date): string {
	if (isEmpty(dateVal)) {
		return null;
	}

	let isoVal: string;
	if (dateVal instanceof Date) {
		isoVal = dateVal.toISOString();
	} else {
		isoVal = dateVal;
	}
	const splitVal = isoVal.split('T');
	const yyyymmdd = splitVal[0];
	return `${yyyymmdd}`;
}

/*
 * 현재날과 제한기간의 날을 계산
 */

export function calcLimitDay(dateObj: Date): string {
	const diffDays = Math.ceil((new Date(dateObj).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
	return `${Math.abs(diffDays)}일 ${diffDays > 0 ? '남음' : '경과'}`;
}
