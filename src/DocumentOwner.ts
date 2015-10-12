class DocumentOwner {

  private _undoStack: UndoStack = new UndoStack();
  private _blockMap: Map<UniqueId, Block> = new Map<UniqueId, Block>();

  public root: ContainerBlock;

  constructor() {
    this.root = new ContainerBlock(new TextBlock());
  }

  attachTo(element: HTMLElement) {
    element.innerHTML = "";
    element.appendChild(this.root.getElement());
  }

  public get undo(): UndoStack {
    return this._undoStack;
  }

  public getBlock<TBlock>(id: UniqueId): TBlock {
    // TODO actually get the block associated with the given id
    return null;
  }

  public performAndEnqueue(cursor: DocumentCursor, undoAction: IUndoAction) {
    // TODO actually perform the action and add it to the undo queue
  }
}