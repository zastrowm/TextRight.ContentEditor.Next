"use strict";

module UndoHelpers {
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


class UndoStack {

  public add(undoEvent: IUndoEvent): void {
    // TODO 
  }

}

interface IUndoEvent {
  do(owner: DocumentOwner): void;
  undo(owner: DocumentOwner): void;
}