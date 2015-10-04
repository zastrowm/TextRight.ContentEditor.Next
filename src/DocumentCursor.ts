
function getFirstNonContainerBlock(block: Block): Block {

  while (block instanceof ContainerBlock) {
    block = (block as ContainerBlock).children[0];
  }

  return block;
}

function getLastNonContainerBlock(block: Block): Block {

  while (block instanceof ContainerBlock) {
    var array = (block as ContainerBlock).children;
    block = array[array.length - 1];
  }

  return block;
}

function getNextBlock(block: Block): Block {

  while (true) {
    var nextBlock = block.getNextBlock();

    if (nextBlock != null) {
      return getFirstNonContainerBlock(block);
    }

    if (block.parent == null) {
      return null;
    }

    block = block.parent;
  }
}

function getPreviousBlock(block: Block): Block {
  while (true) {
    var previousBlock = block.getPreviousBlock();

    if (previousBlock != null) {
      return getLastNonContainerBlock(block);
    }

    if (block.parent == null) {
      return null;
    }

    block = block.parent;
  }
}


class DocumentCursor {

  public targetBlock: Block;

  public targetInline: any;

  public offset: number;

  constructor() {

  }

  /** Move forward through the document, navigating through blocks if required */
  public moveForward(): boolean {
    if (this.moveForwardInBlock()) {
      return true;
    }

    var next = getNextBlock(this.targetBlock);

    if (next != null) {
      next.setCursorToBeginningOfBlock(this);
      return true;
    }

    return false;
  }

  /** Move backward through the document, navigating through blocks if required */
  public moveBackward(): boolean {
    if (this.moveBackwardInBlock()) {
      return true;
    }

    var prev = getPreviousBlock(this.targetBlock);

    if (prev != null) {
      prev.setCursorToEndOfBlock(this);
      return true;
    }

    return false;
  }

  /** Move forward through the document staying within the current block */
  public moveForwardInBlock(): boolean {
    return this.targetBlock.moveCursorForwardInBlock(this);
  }

  /** Move backward through the document staying within the current block */
  public moveBackwardInBlock(): boolean {
    return this.targetBlock.moveCursorBackwardInBlock(this);
  }
}