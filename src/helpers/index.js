export const deepClone = (target) => JSON.parse(JSON.stringify(target))

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
