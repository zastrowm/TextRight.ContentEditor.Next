
namespace TextRight.ContentEditor {

  /**
   * Holds a position within the document
   */
  export class DocumentCursor {

    public targetBlock: Block;

    public blockSpecificData: any;

    public offset: number;

    constructor(targetBlock: Block = null, blockSpecificData: any = null, offset: number = 0) {
      this.targetBlock = targetBlock;
      this.blockSpecificData = blockSpecificData;
      this.offset = 0;
    }

    /** Move forward through the document, navigating through blocks if required */
    public moveForward(): boolean {
      if (this.moveForwardInBlock()) {
        return true;
      }

      return this.moveForwardToNextBlock();
    }

    /** Move backward through the document, navigating through blocks if required */
    public moveBackward(): boolean {
      if (this.moveBackwardInBlock()) {
        return true;
      }

      return this.moveBackwardToPreviousBlock();
    }


    /** Move to the beginning of the next block in the document tree. */
    public moveForwardToNextBlock(): boolean {
      var next = TreeNavigator.getNextNonContainerBlockInTree(this.targetBlock);

      if (next != null) {
        next.setCursorToBeginningOfBlock(this);
        return true;
      }

      return false;
    }

    /** Move to the end of the previous block in the document tree. */
    public moveBackwardToPreviousBlock(): boolean {
      var prev = TreeNavigator.getPreviousNonContainerBlockInTree(this.targetBlock);

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

}