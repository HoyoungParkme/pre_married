/**
 * 모듈: format.test.ts
 * 경로: src/utils/format.test.ts
 * 목적: formatNumber, parseNumber, formatKoreanMoney 유틸리티 함수 테스트.
 */
import { describe, expect, it } from "vitest";
import { formatNumber, parseNumber, formatKoreanMoney } from "./format";

describe("formatNumber", () => {
  it("양수를 천 단위 콤마 문자열로 변환한다", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("세 자리 이하 숫자는 콤마 없이 그대로 반환한다", () => {
    expect(formatNumber(999)).toBe("999");
    expect(formatNumber(1)).toBe("1");
  });

  it("0은 '0'으로 반환한다", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("null은 '0'으로 반환한다", () => {
    expect(formatNumber(null)).toBe("0");
  });

  it("undefined는 '0'으로 반환한다", () => {
    expect(formatNumber(undefined)).toBe("0");
  });

  it("NaN은 '0'으로 반환한다", () => {
    expect(formatNumber(NaN)).toBe("0");
  });

  it("큰 수(1억)에 천 단위 콤마를 적용한다", () => {
    expect(formatNumber(100_000_000)).toBe("100,000,000");
  });

  it("큰 수(9억 8765만 4321)에 천 단위 콤마를 적용한다", () => {
    expect(formatNumber(987_654_321)).toBe("987,654,321");
  });
});

describe("parseNumber", () => {
  it("콤마 포함 문자열을 정수로 파싱한다", () => {
    expect(parseNumber("1,234,567")).toBe(1_234_567);
  });

  it("콤마 없는 숫자 문자열을 파싱한다", () => {
    expect(parseNumber("1000")).toBe(1000);
  });

  it("공백만 있는 문자열은 0을 반환한다", () => {
    expect(parseNumber("   ")).toBe(0);
  });

  it("빈 문자열은 0을 반환한다", () => {
    expect(parseNumber("")).toBe(0);
  });

  it("영문자가 포함된 문자열은 0을 반환한다", () => {
    expect(parseNumber("abc")).toBe(0);
  });

  it("숫자로 시작하고 영문자가 뒤따르는 문자열은 앞 숫자만 파싱한다", () => {
    // parseInt("123abc") = 123 — 자바스크립트 parseInt의 기본 동작
    expect(parseNumber("123abc")).toBe(123);
  });

  it("'0'은 0을 반환한다", () => {
    expect(parseNumber("0")).toBe(0);
  });
});

describe("formatKoreanMoney", () => {
  it("1억 미만(만 단위)은 'N만원' 형태로 반환한다", () => {
    expect(formatKoreanMoney(5_000_000)).toBe("500만원");
    expect(formatKoreanMoney(10_000)).toBe("1만원");
  });

  it("딱 1억은 '1억원'으로 반환한다", () => {
    expect(formatKoreanMoney(100_000_000)).toBe("1억원");
  });

  it("1억 이상(억+만 단위)은 'N억 N만원' 형태로 반환한다", () => {
    expect(formatKoreanMoney(123_450_000)).toBe("1억 2,345만원");
    expect(formatKoreanMoney(900_000_000)).toBe("9억원");
  });

  it("억 단위만 있고 만 단위가 없으면 '억원'만 표시한다", () => {
    expect(formatKoreanMoney(200_000_000)).toBe("2억원");
  });

  it("만 단위 미만(원 단위)은 'N원' 형태로 반환한다", () => {
    expect(formatKoreanMoney(5_000)).toBe("5,000원");
  });

  it("0은 '0원'으로 반환한다", () => {
    expect(formatKoreanMoney(0)).toBe("0원");
  });

  it("NaN은 '0원'으로 반환한다", () => {
    expect(formatKoreanMoney(NaN)).toBe("0원");
  });
});
