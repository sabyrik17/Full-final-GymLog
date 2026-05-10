describe('Utility Functions', () => {
  const sum = (a, b) => a + b;
  const multiply = (a, b) => a * b;
  const divide = (a, b) => b !== 0 ? a / b : null;

  it('should sum two numbers', () => {
    expect(sum(5, 3)).toBe(8);
  });

  it('should multiply two numbers', () => {
    expect(multiply(4, 5)).toBe(20);
  });

  it('should divide two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('should handle division by zero', () => {
    expect(divide(10, 0)).toBeNull();
  });

  it('should handle negative numbers', () => {
    expect(sum(-5, 3)).toBe(-2);
  });

  it('should handle decimals', () => {
    expect(sum(1.5, 2.5)).toBe(4);
  });
});
