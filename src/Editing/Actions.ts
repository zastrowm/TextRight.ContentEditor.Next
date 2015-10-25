
module TextRight.ContentEditor {

  /**
   * An action that inserts text into a text block
   */
  export class InsertTextAction implements IUndoAction {

    constructor(private _text: string) {

    }

    public do(cursor: DocumentCursor) {
      (<TextSpan>cursor.blockSpecificData).insertText(cursor.offset, this._text);
      cursor.offset += this._text.length;
    }

    public undo(cursor: DocumentCursor) {
      (<TextSpan>cursor.blockSpecificData).removeText(cursor.offset, this._text.length);
      cursor.offset -= this._text.length;
    }
  }

  /**
   * An action that deletes the previous character in a TextBlock
   */
  export class DeletePreviousCharacter implements IUndoAction {

    private _textDeleted: string;

    constructor() {

    }

    public do(cursor: DocumentCursor) {
      let textSpan = <TextSpan>cursor.blockSpecificData;
      let textBlock = <TextBlock>cursor.targetBlock;

      if (!cursor.moveBackwardInBlock()) {
        // TODO handle merging of blocks
        // at the begining of the bloc, what to do
        return;
      }

      let offset = cursor.offset;
      this._textDeleted = textSpan.removeText(offset, 1);

      // TODO what if the resulting span is empty?
    }

    public undo(cursor: DocumentCursor) {
    }

  }
}