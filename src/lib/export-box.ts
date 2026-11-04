/**
 * Browser helper for the "copy as Markdown" box used by every tool.
 *
 * The text is always shown in a visible, read-only textarea. A copy button tries the clipboard.
 * Downloads can be blocked in some browsers, so the learner can always select the text by hand.
 */

export interface ExportBox {
  /** Replace the text shown in the box. */
  setText(text: string): void;
  getText(): string;
}

function selectAll(textarea: HTMLTextAreaElement): void {
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
}

/** Copy the textarea's text. Returns true when a copy method reported success. */
export async function copyTextarea(textarea: HTMLTextAreaElement): Promise<boolean> {
  const text = textarea.value;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* permission refused: try the older way below */
  }
  try {
    selectAll(textarea);
    return document.execCommand('copy');
  } catch {
    return false;
  }
}

/**
 * Wire one export box. Expected markup inside `root`:
 *   textarea[data-export-text], button[data-export-copy], [data-export-status]
 */
export function wireExportBox(root: ParentNode): ExportBox | undefined {
  const textarea = root.querySelector<HTMLTextAreaElement>('[data-export-text]');
  const button = root.querySelector<HTMLButtonElement>('[data-export-copy]');
  const status = root.querySelector<HTMLElement>('[data-export-status]');
  if (!textarea || !button) return undefined;

  button.addEventListener('click', async () => {
    const ok = await copyTextarea(textarea);
    if (!status) return;
    if (ok) {
      status.textContent = 'Copied. Paste it into a file in your own repository.';
    } else {
      selectAll(textarea);
      status.textContent = 'Your browser did not allow copying. The text is selected: press Ctrl+C (Command+C on a Mac).';
    }
  });

  return {
    setText(text: string) {
      textarea.value = text;
      if (status) status.textContent = '';
    },
    getText() {
      return textarea.value;
    },
  };
}

/** Two-step button: the first click arms it and changes the label, the second click runs `action`. */
export function armedButton(button: HTMLButtonElement, armedLabel: string, action: () => void): void {
  const idle = button.textContent ?? '';
  let timer: number | undefined;
  const disarm = () => {
    button.dataset['armed'] = 'false';
    button.textContent = idle;
    if (timer !== undefined) window.clearTimeout(timer);
  };
  button.addEventListener('click', () => {
    if (button.dataset['armed'] !== 'true') {
      button.dataset['armed'] = 'true';
      button.textContent = armedLabel;
      timer = window.setTimeout(disarm, 8000);
      return;
    }
    disarm();
    action();
  });
  button.addEventListener('blur', disarm);
}

export function todayLocal(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
