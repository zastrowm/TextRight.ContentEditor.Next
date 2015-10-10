

class TextSpan {

  private _element: HTMLElement;
  private _length: number;

  public childIndex: number;
  public parent: TextBlock;

  constructor() {
    this._element = document.createElement("SPAN");
    this._length = 0;
  }

  public get length() {
    return this._length;
  }

  public getElement(): HTMLElement {
    return this._element;
  }

  public getPreviousSpan(): TextSpan {
    return this.parent.spans[this.childIndex - 1];
  }

  public getNextSpan(): TextSpan {
    return this.parent.spans[this.childIndex + 1];
  }

  /**
   * Insert text into the span at the designated location.
   */
  public insertText(relativeInsertionPoint: number, text: string) {
    let element = this._element;
    var textContent = element.textContent;

    element.textContent = textContent.substr(0, relativeInsertionPoint)
      + text
      + textContent.substr(relativeInsertionPoint);

    // TODO count UNICODE instead of characters
    this._length += text.length;
  }

  /**
   * Remove the given number of characters from the span.
   */
  public removeText(relativeDeletionPoint: number, numberOfCharactersToRemove: number): string {
    let element = this._element;
    var textContent = element.textContent;

    var removed = textContent.substr(relativeDeletionPoint, numberOfCharactersToRemove);

    // OPTIMIZE/PROFILE - if we're at the end of the substring, we can avoid the concat
    element.textContent = textContent.substr(0, relativeDeletionPoint)
      + textContent.substr(relativeDeletionPoint + numberOfCharactersToRemove);

    // TODO count unicode instead of characters?
    this._length = this._length - removed.length

    return removed;
  }

  /**
   * Get the text contained in the given span. 
   */
  public getText() {
    // PROFILE - should we cache this?
    return this._element.textContent;
  }

  /**
   * Provide a human-readable json object used for quickly identifying
   * the contents of the span
   */
  private dump(): any {
    return {
      childIndex: this.childIndex,
      text: this.getText(),
    };
  }
}