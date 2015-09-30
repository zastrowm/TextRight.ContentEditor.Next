"use strict";

declare class UniqueId {

};


enum BlockType {
  TextBlock,
  ContainerBlock,
}

/** A block of content within the document. */
abstract class Block {

  /* The index of the block within the parent's collection of blocks */
  public childId: number;

  /** The parent of the current block. */
  public parent: Block;

  /**
    * Gets the path to the block.  This path uniquely defines this block for the
    * current state of the document.
   **/
  public getPath(): UniqueId {

    var current = this;
    var path = "";

    while (current != null) {
      path = path + "." + current.childId;
      current = current.parent;
    }

    return path;
  }

  /* Get the html element that is associated with the block */
  public abstract getElement(): HTMLElement;

  /* Get the type of the given block */
  public abstract getBlockType(): BlockType;
}

/**
  * A block that only contains other blocks.
  */
class ContainerBlock extends Block {

  private _element: HTMLElement;

  public children: Block[];

  constructor() {
    super();

    this.children = [];
    this._element = document.createElement("DIV");
  }

  private renumberChildren() {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].childId = i;
    }
  }

  public appendChild(block: Block) {
    this.children.push(block);
    this._element.appendChild(block.getElement());

    block.parent = this;
    block.childId = this.children.length - 1;
    // no need to renumber because we added to the end
  }

  getElement(): HTMLElement {
    return this._element;
  }

  /* inheritdocs */
  public getBlockType(): BlockType {
    return BlockType.ContainerBlock;
  }
}

class InsertTextIntoBlockEvent implements IUndoEvent {
  insertBlockId: UniqueId;
  characterInsertionIndex: number;
  textToInsert: string;

  do(owner: DocumentOwner, textblock: TextBlock = null) {
    textblock = UndoHelpers.getTextBlock(owner, textblock, this.insertBlockId);
    // TODO
  }

  undo(owner: DocumentOwner) {
    let textBlock = UndoHelpers.getTextBlock(owner, null, this.insertBlockId);
    // TODO
  }
}