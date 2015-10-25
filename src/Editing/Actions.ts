
module TextRight.ContentEditor {

  /**
   * An action that inserts text into a text block
   */
  export class InsertTextAction implements IUndoAction {

    constructor(private text: string) {

    }

    public do(cursor: DocumentCursor) {
      (<TextSpan>cursor.blockSpecificData).insertText(cursor.offset, this.text);
      cursor.offset += this.text.length;
    }

    public undo(cursor: DocumentCursor) {
      (<TextSpan>cursor.blockSpecificData).removeText(cursor.offset, this.text.length);
      cursor.offset -= this.text.length;
    }
  }
}