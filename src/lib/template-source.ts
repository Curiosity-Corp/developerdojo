import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseTemplate, type TemplateModel } from './template-form';

/**
 * Reads one template download (public/templates/<name>.md) and turns it into the form model.
 * Build time only. A page names its download in the `fillable` frontmatter field, and a name with
 * no file fails the build with a message that says which one.
 */
export function readTemplateModel(name: string): TemplateModel {
  const file = join(process.cwd(), 'public', 'templates', `${name}.md`);
  if (!existsSync(file)) {
    throw new Error(`fillable "${name}" does not exist: there is no file public/templates/${name}.md`);
  }
  const model = parseTemplate(readFileSync(file, 'utf8'));
  if (model.sections.length === 0) {
    throw new Error(`fillable "${name}" has nothing to fill in: public/templates/${name}.md has no tables, lists or questions`);
  }
  return model;
}
