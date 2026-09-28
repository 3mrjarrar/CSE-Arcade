export const ELEVATOR_SECONDS = 20;
export const ELEVATOR_FLOORS = 5;

export function toBinary(value) {
  return value.toString(2).padStart(4, '0');
}

export function createChallenges(random = Math.random) {
  const values = Array.from({ length: 16 }, (_, value) => value);
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  const firstIsBinary = random() < 0.5;
  return values.slice(0, ELEVATOR_FLOORS).map((value, index) => ({
    value,
    answerType: (index % 2 === 0) === firstIsBinary ? 'binary' : 'decimal',
  }));
}

export function isCorrectAnswer(challenge, answer) {
  const typed = answer.trim();
  if (challenge.answerType === 'binary') return /^[01]{4}$/.test(typed) && typed === toBinary(challenge.value);
  return /^(?:[0-9]|1[0-5])$/.test(typed) && Number(typed) === challenge.value;
}
