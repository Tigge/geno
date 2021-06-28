export const clamp = (value, [min, max]) => {
  return Math.min(Math.max(min, value), max);
}
