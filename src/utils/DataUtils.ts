// export const firstBy = (function () {
// 	function extend(f) {
// 		f.thenBy = tb;
// 		return f;
// 	}
//
// 	function tb(y) {
// 		let x = this;
// 		return extend(function (a, b) {
// 			return x(a, b) || y(a, b);
// 		});
// 	}
// 	return extend;
// })();

export const firstBy = (function () {
	function extend<T>(f: (a: T, b: T) => number) {
		(f as any).thenBy = tb;
		return f as ThenBy<T>;
	}

	function tb<T>(this: (a: T, b: T) => number, y: (a: T, b: T) => number) {
		const x = this;
		return extend<T>(function (a: T, b: T) {
			return x(a, b) || y(a, b);
		});
	}
	function compare<T>(
		selector: (item: T) => any,
		descending = false,
		priorityValues: any[] = [], // ✅ 우선 정렬할 값 지정
	): ThenBy<T> {
		const cmp = function (a: T, b: T) {
			const va = selector(a);
			const vb = selector(b);

			// ✅ 1️⃣ priorityValues에 포함된 값은 항상 맨 위
			const aPriority = priorityValues.includes(va);
			const bPriority = priorityValues.includes(vb);
			if (aPriority && !bPriority) return -1;
			if (!aPriority && bPriority) return 1;

			// ✅ 2️⃣ null 우선 정렬
			if (va == null && vb == null) return 0;
			if (va == null) return -1;
			if (vb == null) return 1;

			// ✅ 3️⃣ 일반 비교
			if (va < vb) return descending ? 1 : -1;
			if (va > vb) return descending ? -1 : 1;
			return 0;
		};

		return extend<T>(cmp);
	}

	// ✅ 새로 추가: 원본 배열 유지하고 정렬된 새 배열 반환
	function sort<T>(array: T[], comparer: (a: T, b: T) => number): T[] {
		return [...array].sort(comparer);
	}

	return Object.assign(extend, { compare, sort });
})();

// 타입 정의
export interface ThenBy<T> {
	(a: T, b: T): number;
	thenBy(y: (a: T, b: T) => number): ThenBy<T>;
}

export function compareByNullCountAndEquipName<T>(
	selectors: ((item: T) => any)[],
	primarySelector: (item: T) => any,
) {
	return firstBy(function (a: T, b: T) {
		// ✅ 1️⃣ 각 항목의 null 개수 계산 (equipName 제외)
		const aNullCount = selectors.reduce((c, s) => (s(a) == null ? c + 1 : c), 0);
		const bNullCount = selectors.reduce((c, s) => (s(b) == null ? c + 1 : c), 0);

		// ✅ 2️⃣ null 개수가 많은 항목이 위로
		if (aNullCount !== bNullCount) return bNullCount - aNullCount;

		// ✅ 3️⃣ null 개수가 같다면 equipName 기준
		const va = primarySelector(a);
		const vb = primarySelector(b);
		if (va < vb) return -1;
		if (va > vb) return 1;

		// ✅ 4️⃣ equipName 같으면 세부 필드 비교 (null 우선)
		for (const s of selectors) {
			const sa = s(a);
			const sb = s(b);
			if (sa == null && sb == null) continue;
			if (sa == null) return -1;
			if (sb == null) return 1;
			if (sa < sb) return -1;
			if (sa > sb) return 1;
		}

		return 0;
	});
}
