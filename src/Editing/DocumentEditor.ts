
module TextRight.ContentEditor {

  import DocumentInputProcessor = TextRight.ContentEditor.Input.DocumentInputProcessor;

  /**
   * Contains all of the functionality required to implement an editor using
   * DocumentOwner.
   */
  export class DocumentEditor {

    public owner: DocumentOwner;

    public caretPosition: DocumentCursor;

    constructor() {

      this.owner = new DocumentOwner();
      this.caretPosition = new DocumentCursor();

      this.owner.root.children[0].setCursorToBeginningOfBlock(this.caretPosition);

      const targetElement = this.owner.getElement();

      let inputElement = document.createElement("input");
      targetElement.appendChild(inputElement);

      let inputProcessor = new DocumentInputProcessor(this, targetElement, inputElement);
    }

    public insertText(text: string): void {
      var action = new TextRight.ContentEditor.InsertTextAction(text);
      action.do(this.owner, this.caretPosition);
    }

  }

}