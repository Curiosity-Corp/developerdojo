import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import { librarySchema, quizQuestionSchema } from '../src/lib/schemas';
import { scoreText, verdictText } from '../src/lib/quiz';

const root = join('src', 'content', 'library');

function markdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? markdownFiles(join(dir, entry.name)) : entry.name.endsWith('.md') ? [join(dir, entry.name)] : [],
  );
}

function frontmatter(file: string): Record<string, unknown> {
  const text = readFileSync(file, 'utf8');
  const match = /^---\n([\s\S]*?)\n---/.exec(text);
  return parse(match?.[1] ?? '') as Record<string, unknown>;
}

const base = { question: 'Which is true?', options: ['One', 'Two', 'Three'], answer: 'Two', why: 'Because two.' };

describe('quiz question schema', () => {
  it('accepts a question whose answer is one of the options', () => {
    expect(quizQuestionSchema.safeParse(base).success).toBe(true);
  });
  it('rejects an answer that is not an option', () => {
    const result = quizQuestionSchema.safeParse({ ...base, answer: 'Four' });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain('answer must be one of the options');
  });
  it('rejects repeated options, a single option, too many options and an empty reason', () => {
    expect(quizQuestionSchema.safeParse({ ...base, options: ['One', 'One', 'Two'] }).success).toBe(false);
    expect(quizQuestionSchema.safeParse({ ...base, options: ['Two'] }).success).toBe(false);
    expect(quizQuestionSchema.safeParse({ ...base, options: ['a', 'b', 'c', 'd', 'e', 'f'], answer: 'a' }).success).toBe(false);
    expect(quizQuestionSchema.safeParse({ ...base, why: '  ' }).success).toBe(false);
  });
});

describe('lesson frontmatter: quiz and fillable', () => {
  const lesson = { title: 'T', description: 'D', section: 'S', order: 1 };
  const questions = [base, base, base];

  it('quiz is optional and needs three to five questions', () => {
    expect(librarySchema.safeParse(lesson).success).toBe(true);
    expect(librarySchema.safeParse({ ...lesson, quiz: questions }).success).toBe(true);
    expect(librarySchema.safeParse({ ...lesson, quiz: [base, base] }).success).toBe(false);
    expect(librarySchema.safeParse({ ...lesson, quiz: [...questions, base, base, base] }).success).toBe(false);
  });

  it('fillable must look like a download name', () => {
    expect(librarySchema.safeParse({ ...lesson, fillable: 'template-8-change-record' }).success).toBe(true);
    expect(librarySchema.safeParse({ ...lesson, fillable: '../secrets' }).success).toBe(false);
    expect(librarySchema.safeParse({ ...lesson, fillable: 'change-record' }).success).toBe(false);
  });
});

describe('the real lessons', () => {
  const quizzed = markdownFiles(root).flatMap((file) => {
    const data = frontmatter(file);
    return data['quiz'] ? [{ file, data }] : [];
  });

  it('has a knowledge check on exactly three lessons', () => {
    expect(quizzed.map((item) => item.file.replace(`${root}/`, '')).sort()).toEqual([
      'tracks/git-and-gitlab/02-branches-and-merge-requests.md',
      'tracks/product-discovery/02-talk-to-customers.md',
      'tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output.md',
    ]);
  });

  for (const { file, data } of quizzed) {
    it(`${file} has valid questions with one correct answer each`, () => {
      const parsed = librarySchema.parse(data);
      expect(parsed.quiz?.length).toBeGreaterThanOrEqual(3);
      for (const question of parsed.quiz ?? []) {
        expect(question.options.filter((option) => option === question.answer)).toHaveLength(1);
        // One line: no line breaks in the reason.
        expect(question.why).not.toMatch(/\n/);
      }
    });
  }
});

describe('wording', () => {
  it('says whether an answer is right and why', () => {
    expect(verdictText(true, 'Five', 'Because.')).toBe('Correct. Because.');
    expect(verdictText(false, 'Five', 'Because.')).toBe('Not quite. The answer is: Five. Because.');
    expect(verdictText(false, 'Use a code.', 'Because.')).toBe('Not quite. The answer is: Use a code. Because.');
  });
  it('counts what was answered', () => {
    expect(scoreText(0, 0, 4)).toBe('');
    expect(scoreText(1, 2, 4)).toBe('1 of 2 answered correctly. 2 questions are still open.');
    expect(scoreText(3, 3, 4)).toBe('3 of 3 answered correctly. 1 question is still open.');
    expect(scoreText(4, 4, 4)).toBe('4 of 4 answered correctly. You have answered every question.');
  });
});
