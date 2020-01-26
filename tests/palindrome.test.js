const palindrome = require("../utils/for_testing").palindrome
const average = require("../utils/for_testing").average


describe('average', () => {
    test('of one value is the value itself', () => {
        expect(average([1])).toBe(1)
    })

    test('average of multiple values', () => {
        expect(average([1,2,3])).toBe(2)
    })

    test('average of 5 numbers', () => {
        expect(average([1,2,3,4,5])).toBe(3)
    })

    test('empty array', () => {
        expect(average([])).toBe(0)
    })
})


test("palindrome of a", () => {
  const result = palindrome("a");

  expect(result).toBe("a");
});

test("palindrome of react", () => {
  const result = palindrome("react");

  expect(result).toBe("tcaer");
});

test("palindrome of releveler", () => {
  const result = palindrome("releveler");

  expect(result).toBe("releveler");
});

test('palindrome of bajwa', () => {
    const result = palindrome("bajwa");

    expect(result).toBe("awjab")
})

test('palindrome of string', () => {
    const result = palindrome("string");
    expect(result).toBe('gnirts')
})
