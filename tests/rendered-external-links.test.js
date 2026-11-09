import { describe, expect, it } from 'vitest';
import { renderedExternalLinks } from '../scripts/rendered-external-links.mjs';

describe('rendered external link collection', () => {
  it('finds external anchors with decoded query strings and scheme-relative URLs', () => {
    const html = `<a href="https://provider.example/course?a=1&amp;b=2">Learn</a>
      <a class='source' href='//docs.provider.example/guide#part'>Docs</a>
      <a href="https://developerdojo.org/katas/">Own site</a><a href="/library/">Local</a>`;
    expect(renderedExternalLinks(html)).toEqual([
      'https://provider.example/course?a=1&b=2',
      'https://docs.provider.example/guide#part',
    ]);
  });

  it('does not treat links inside scripts, comments, textareas or ordinary prose as live anchors', () => {
    const html = `<!-- <a href="https://hidden.example/comment"> -->
      <script>const sample = '<a href="https://hidden.example/script">';</script>
      <textarea><a href="https://hidden.example/textarea">demo</a></textarea>
      <p>https://hidden.example/prose</p><a href="mailto:hello@site.example">Mail</a>
      <a href="https://real.example/learn">Learn</a>`;
    expect(renderedExternalLinks(html)).toEqual(['https://real.example/learn']);
  });

  it('preserves meaningful trailing punctuation in actual hrefs and decodes numeric entities', () => {
    expect(renderedExternalLinks('<a href="https://real.example/a_(b)?x=1&#38;y=2">Example</a>'))
      .toEqual(['https://real.example/a_(b)?x=1&y=2']);
  });
});
