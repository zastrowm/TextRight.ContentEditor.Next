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
  public parent: ContainerBlock;

  /* Get the html element that is associated with the block */
  public abstract getElement(): HTMLElement;

  /* Get the type of the given block */
  public abstract getBlockType(): BlockType;

  public abstract moveCursorForwardInBlock(cursor: DocumentCursor): boolean;

  public abstract moveCursorBackwardInBlock(cursor: DocumentCursor): boolean;

  public abstract setCursorToBeginningOfBlock(cursor: DocumentCursor): void;

  public abstract setCursorToEndOfBlock(cursor: DocumentCursor): void;

  public isFirst(): boolean {
    return this.parent == null || this.childId == 0;
  }

  public isLast(): boolean {
    return this.parent == null || this.childId === this.parent.children.length - 1;
  }

  public getPreviousBlock(): Block {
    if (this.parent != null && this.childId != 0) {
      return this.parent.children[this.childId - 1];
    }

    return null;
  }

  public getNextBlock(): Block {
    if (this.parent != null && this.childId !== this.parent.children.length - 1) {
      return this.parent.children[this.childId + 1];
    }

    return null;
  }

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


}

/**
  * A block that only contains other blocks.
  */
class ContainerBlock extends Block {

  private _element: HTMLElement;

  public children: Block[];

  constructor(children: Block[] | Block) {
    super();

    this.children = [];
    this._element = document.createElement("DIV");

    if (Array.isArray(children)) {
      this.appendChildren(children);
    } else if (children instanceof Block) {
      this.appendChild(children);
    } else {
      throw new Error("Container cannot be created without a child");
    }
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

  public appendChildren(children: Block[]) {
    for (let child of children) {
      this.appendChild(child);
    }
  }

  public moveCursorForwardInBlock(cursor: DocumentCursor): boolean {
    throw new Error("not implemented");
    return false; // TODO
  }

  public moveCursorBackwardInBlock(cursor: DocumentCursor): boolean {
    throw new Error("not implemented");
    return false; // TODO
  }

  public setCursorToBeginningOfBlock(cursor: DocumentCursor): void {
    throw new Error("not implemented");
  }

  public setCursorToEndOfBlock(cursor: DocumentCursor): void {
    throw new Error("not implemented");
  }

  /* inheritdocs */
  getElement(): HTMLElement {
    return this._element;
  }

  /* inheritdocs */
  public getBlockType(): BlockType {
    return BlockType.ContainerBlock;
  }
}