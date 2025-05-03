/** Pattern Matching을 위한 패턴 케이스 타입 */
type Pattern<T> = {
  /** 매칭될 조건 */
  when: (() => boolean) | boolean;
  /** 매칭 성공시 반환값 */
  then: (() => T) | T;
};

/**
 * Pattern Matching 유틸리티 함수입니다.
 * 첫 번째로 매칭되는 패턴의 값을 반환하며, 매칭되는 패턴이 없을 경우 기본값을 반환합니다.
 *
 * @example
 * const greeting = matchPattern({
 *   cases: [
 *     { when: time < 12, then: "좋은 아침입니다" },
 *     { when: time < 18, then: "좋은 오후입니다" },
 *     { when: time < 22, then: "좋은 저녁입니다" }
 *   ],
 *   defaultValue: "안녕하세요"
 * });
 *
 * @param cases - 매칭할 패턴들의 배열
 * @param defaultValue - 매칭되는 패턴이 없을 때의 기본값
 * @returns 매칭된 패턴의 값 또는 기본값
 */
function matchPattern<T>({
  cases,
  defaultValue,
}: {
  cases: Array<Pattern<T>>;
  defaultValue: T;
}): T {
  if (!Array.isArray(cases)) {
    throw new Error('패턴 목록은 배열이어야 합니다');
  }

  try {
    for (const { when, then } of cases) {
      const matched = typeof when === 'function' ? when() : when;

      if (matched) {
        return typeof then === 'function' ? (then as () => T)() : then;
      }
    }
  } catch (error) {
    console.error('패턴 매칭 중 오류 발생:', error);
    return defaultValue;
  }

  return defaultValue;
}

export default matchPattern;
