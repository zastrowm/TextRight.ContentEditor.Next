"use strict";

namespace TextRight.ContentEditor {

  namespace UndoHelpers {
    export function getTextBlock(owner: DocumentOwner, textBlock: TextBlock, id: UniqueId): TextBlock {
      if (textBlock != null) {
        return textBlock;
      }

      let block = owner.getBlock(id);
      if (!(block instanceof TextBlock)) {
        // TODO make this strongly typed and include more info
        throw new Error("Block to be retreived is expected to be a TextBlock, but is not");
      }

      return <TextBlock>block;
    }
  }


  export class UndoStack {

    public add(undoEvent: IUndoAction): void {
      // TODO 
    }

  }

  export interface IUndoAction {
    do(owner: DocumentOwner, cursor: DocumentCursor): void;
    undo(owner: DocumentOwner, cursor: DocumentCursor): void;
  }
}