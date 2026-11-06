export const CLASSES = [
  { key: 'under', label: 'Underweight', range: 'under 18.5', color: 'var(--warning)', icon: '↓', lo: 0, hi: 18.5 },
  { key: 'healthy', label: 'Healthy', range: '18.5–24.9', color: 'var(--good)', icon: '✓', lo: 18.5, hi: 25 },
  { key: 'over', label: 'Overweight', range: '25–29.9', color: 'var(--serious)', icon: '↑', lo: 25, hi: 30 },
  { key: 'obese', label: 'Obese', range: '30 and up', color: 'var(--critical)', icon: '!', lo: 30, hi: 200 },
];

export const bmiFrom = (height, weight) => weight / (height / 100) ** 2;
export const bmi = (user) => bmiFrom(user.height, user.weight);
export const classOf = (value) => CLASSES.find((c) => value < c.hi) ?? CLASSES[CLASSES.length - 1];
export const classOfUser = (user) => classOf(bmi(user));

export const round1 = (v) => Math.round(v * 10) / 10;
export const pad = (id) => String(id).padStart(3, '0');
export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
