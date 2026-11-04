/**
 * Wording and counting for the knowledge check at the end of a lesson. Pure functions, so tests can
 * run them without a browser. The page itself works without JavaScript (every question has a
 * "Show the answer" panel); the script only gives a quicker answer when a choice is made.
 */

/** What the learner is told right after choosing an answer. */
export function verdictText(correct: boolean, answer: string, why: string): string {
  if (correct) return `Correct. ${why}`;
  const stop = /[.!?]$/.test(answer) ? '' : '.';
  return `Not quite. The answer is: ${answer}${stop} ${why}`;
}

/** One plain line for the running score. Not a grade: it only counts this visit. */
export function scoreText(correct: number, answered: number, total: number): string {
  if (answered === 0) return '';
  const left = total - answered;
  const base = `${correct} of ${answered} answered correctly.`;
  if (left === 0) return `${base} You have answered every question.`;
  return `${base} ${left} ${left === 1 ? 'question is' : 'questions are'} still open.`;
}
