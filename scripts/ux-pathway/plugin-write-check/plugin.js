/*
 * Developer Dojo write check: a minimal Penpot plugin (Plugin API, manifest version 2).
 *
 * When it runs it writes, on the page open in the workspace, one board holding a rectangle and a
 * text, with the names, sizes and colours below. Then it opens its small UI (ui.html) and, once
 * the UI says it is ready, sends it a report of what it wrote, read back through the same API.
 *
 * scripts/ux-pathway/check-penpot-plugin-write.ts installs it through Penpot's Plugin Manager,
 * runs it, and then reads the file back from Penpot's backend. Keep WRITE in step with WRITE in
 * that script: it checks the backend against the same values.
 */
const WRITE = {
  board: { name: 'Plugin write check: board', x: -1600, y: 0, width: 360, height: 200, fill: '#F4F1EA' },
  rectangle: { name: 'Plugin write check: rectangle', dx: 24, dy: 24, width: 140, height: 48, fill: '#1F6FEB', radius: 8 },
  text: { name: 'Plugin write check: text', dx: 24, dy: 100, characters: 'Written by a Penpot plugin', fontSize: '20', fill: '#1B1B1F' },
};

function write() {
  const page = penpot.currentPage;
  const file = penpot.currentFile;
  if (!page || !file) throw new Error('No file or page is open in the workspace.');

  const board = penpot.createBoard();
  board.name = WRITE.board.name;
  board.x = WRITE.board.x;
  board.y = WRITE.board.y;
  board.resize(WRITE.board.width, WRITE.board.height);
  board.fills = [{ fillColor: WRITE.board.fill, fillOpacity: 1 }];

  const rectangle = penpot.createRectangle();
  rectangle.name = WRITE.rectangle.name;
  rectangle.resize(WRITE.rectangle.width, WRITE.rectangle.height);
  rectangle.fills = [{ fillColor: WRITE.rectangle.fill, fillOpacity: 1 }];
  rectangle.borderRadius = WRITE.rectangle.radius;
  board.appendChild(rectangle);
  rectangle.x = WRITE.board.x + WRITE.rectangle.dx;
  rectangle.y = WRITE.board.y + WRITE.rectangle.dy;

  const text = penpot.createText(WRITE.text.characters);
  if (!text) throw new Error('penpot.createText returned null.');
  text.name = WRITE.text.name;
  text.fontSize = WRITE.text.fontSize;
  text.fills = [{ fillColor: WRITE.text.fill, fillOpacity: 1 }];
  text.growType = 'auto-width';
  board.appendChild(text);
  text.x = WRITE.board.x + WRITE.text.dx;
  text.y = WRITE.board.y + WRITE.text.dy;

  // Read back through the API what the plugin now sees on the page.
  const onPage = (id) => page.getShapeById(id);
  return {
    ok: true,
    fileId: file.id,
    pageId: page.id,
    pageName: page.name,
    board: { id: board.id, name: onPage(board.id)?.name, type: board.type, width: board.width, height: board.height, fill: board.fills[0]?.fillColor, children: board.children.map((child) => child.name) },
    rectangle: { id: rectangle.id, name: onPage(rectangle.id)?.name, parentId: rectangle.parent?.id, width: rectangle.width, height: rectangle.height, fill: rectangle.fills[0]?.fillColor, radius: rectangle.borderRadius },
    text: { id: text.id, name: onPage(text.id)?.name, parentId: text.parent?.id, characters: text.characters, fontSize: text.fontSize },
  };
}

let report;
try {
  report = write();
} catch (error) {
  report = { ok: false, error: String(error && error.stack ? error.stack : error) };
}

penpot.ui.open('Developer Dojo write check', 'ui.html', { width: 320, height: 260 });
penpot.ui.onMessage((message) => {
  if (message && message.type === 'ready') penpot.ui.sendMessage({ type: 'report', report });
});
