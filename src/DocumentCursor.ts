

class DocumentCursor {

  public targetBlock: Block;

  public targetInline: TextSpan;

  public offset: number;

  constructor() {

  }

  public moveForwardInBlock(): boolean {
    switch (this.targetBlock.getBlockType()) {
      case BlockType.TextBlock:
        return this.moveFowardInTextBlock();
      default:
        throw new Error("Block not supported");
    }
  }

  public moveBackwardInBlock(): boolean {
    switch (this.targetBlock.getBlockType()) {
      case BlockType.TextBlock:
        return this.moveBackwardInTextBlock();
      default:
        throw new Error("Block not supported");
    }
  }

  private moveFowardInTextBlock() {
    const inline = this.targetInline;

    if (this.offset < inline.length) {
      this.offset++;
      return true;
    } else if (inline.childIndex + 1 < inline.parent.spans.length) {
      this.targetInline = inline.getNextSpan();
      this.offset = 1;
      return true;
    } else {
      return false;
    }
  }

  private moveBackwardInTextBlock(): boolean {
    const inline = this.targetInline;

    if (this.offset > 2) {
      this.offset--;
      return true;
    } else if ( /* not at begining of first block */ this.offset === 1 && inline.childIndex !== 0) {
      this.targetInline = this.targetInline.getPreviousSpan();
      this.offset = this.targetInline.length;
      return true;
    } else if ( /* at begining of first span */ this.offset === 0) {
      return false;
    } else { /* at offset 1 of first span */
      this.offset -= 1;
      return true;
    }
  }
}