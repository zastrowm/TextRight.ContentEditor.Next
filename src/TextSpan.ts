
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

  insertText(relativeInsertionPoint: number, text: string) {
    let element = this._element;
    var textContent = element.textContent;

    element.textContent = textContent.substr(0, relativeInsertionPoint)
      + text
      + textContent.substr(relativeInsertionPoint);

    // TODO count UNICODE instead of characters
    this._length += text.length;
  }

  getText() {
    return this._element.textContent;
  }
}