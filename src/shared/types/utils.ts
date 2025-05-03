/** Pattern Matching을 위한 패턴 케이스 타입 */
export type Pattern<T> = {
  /** 매칭될 조건 */
  when: (() => boolean) | boolean;
  /** 매칭 성공시 반환값 */
  then: (() => T) | T;
};
