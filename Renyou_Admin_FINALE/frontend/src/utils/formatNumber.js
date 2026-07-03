export const formatNumber = (value) => {
  const [intPart, decPart] = Number(value)
    .toFixed(3)
    .split('.');

  return (
    intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
    '.' +
    decPart
  );
};