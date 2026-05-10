describe('Basic Math', () => {
  it('should add two numbers', () => {
    const result = 1 + 2;
    expect(result).toBe(3);
  });

  it('should multiply two numbers', () => {
    const result = 3 * 4;
    expect(result).toBe(12);
  });

  it('should subtract two numbers', () => {
    const result = 10 - 5;
    expect(result).toBe(5);
  });

  it('should divide two numbers', () => {
    const result = 20 / 4;
    expect(result).toBe(5);
  });

  it('should handle decimals', () => {
    const result = 2.5 + 1.5;
    expect(result).toBe(4);
  });
});
