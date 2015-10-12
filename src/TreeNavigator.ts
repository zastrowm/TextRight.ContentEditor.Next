
namespace TextRight.ContentEditor {

  /**
   * Finds related blocks within the tree hiearachy of a Document
   */
  export class TreeNavigator {

    /**
     * Returns the passed in block if it is not a container block, or returns the first
     * non-ContainerBlock that is a decendant of the given block if it is a ContainerBlock
     */
    public static getFirstNonContainerBlock(block: Block | ContainerBlock): Block {

      while (block instanceof ContainerBlock) {
        block = (<ContainerBlock>block).children[0];
      }

      return block;
    }

    /**
     * Returns the passed in block if it is not a container block, or returns the last
     * non-ContainerBlock that is a decendant of the given block if it is a ContainerBlock
     */
    public static getLastNonContainerBlock(block: Block | ContainerBlock): Block {

      while (block instanceof ContainerBlock) {
        var array = (<ContainerBlock>block).children;
        block = array[array.length - 1];
      }

      return block;
    }

    /**
     * Returns the next block in the hiearachy that is not a ContainerBlock
     */
    public static getNextNonContainerBlockInTree(block: Block): Block {

      while (true) {
        var nextBlock = block.getNextBlock();

        if (nextBlock != null) {
          return this.getFirstNonContainerBlock(nextBlock);
        }

        if (block.parent == null) {
          return null;
        }

        block = block.parent;
      }
    }

    /**
     * Returns the previous block in the hiearachy that is not a ContainerBlock
     */
    public static getPreviousNonContainerBlockInTree(block: Block): Block {
      while (true) {
        var previousBlock = block.getPreviousBlock();

        if (previousBlock != null) {
          return this.getLastNonContainerBlock(previousBlock);
        }

        if (block.parent == null) {
          return null;
        }

        block = block.parent;
      }
    }
  }
}