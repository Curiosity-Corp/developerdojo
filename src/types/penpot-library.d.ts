/**
 * Types for the part of @penpot/library (Penpot's official library for writing .penpot files, MPL-2.0)
 * that the Pocket Invoice generator uses. The package ships without type declarations.
 * Shape attributes follow Penpot's file format in camelCase; see help.penpot.app/user-guide/export-import/penpot-file-format/.
 */
declare module '@penpot/library' {
  export type PenpotAttributes = { id?: string; name?: string; [attribute: string]: unknown };

  export interface BuildContext {
    genId(): string;
    addFile(params: PenpotAttributes & { name: string }): string;
    closeFile(): void;
    addPage(params: PenpotAttributes & { name: string }): string;
    closePage(): void;
    addBoard(params: PenpotAttributes): string;
    closeBoard(): void;
    addGroup(params: PenpotAttributes): string;
    closeGroup(): void;
    addRect(params: PenpotAttributes): string;
    addPath(params: PenpotAttributes): string;
    addText(params: PenpotAttributes): string;
    addLibraryColor(params: PenpotAttributes & { color: string; opacity: number }): string;
    addLibraryTypography(params: PenpotAttributes & { fontId: string; fontFamily: string; fontSize: string }): string;
    addComponent(params: PenpotAttributes & { componentId?: string; name: string; path?: string; frameId: string }): string;
    addTokensLib(tokens: unknown): void;
  }

  export function createBuildContext(): BuildContext;
  export function exportAsBytes(context: BuildContext): Promise<Uint8Array>;
}
