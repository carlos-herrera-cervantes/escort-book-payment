import './number.extensions';

describe('NumberExtension', () => {
  it('calculatePercentage - Should return the 10% of the quantity', () => {
    const quantity = 100;
    const percentageResult = quantity.calculatePercentage(10);
    expect(percentageResult).toEqual(10);
  });
});
