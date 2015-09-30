
class TextBlock extends Block {

  private _element: HTMLParagraphElement;
  private _start: HTMLSpanElement;
  private _end: HTMLSpanElement;

  private _lastElementThatTextWasInsertedInto: TextSpan;
  private _offsetToLastEditedSpan;

  public spans: TextSpan[];

  constructor() {
    super();

    this._element = document.createElement("p");
    this._start = document.createElement("span");
    this._end = document.createElement("span");

    this.spans = [new TextSpan()];
    let firstSpan = this.spans[0];
    firstSpan.childIndex = 0;
    firstSpan.parent = this;

    this._element.appendChild(this._start);
    this._element.appendChild(firstSpan.getElement());
    this._element.appendChild(this._end);

    this.resetLastEdittedValue();
  }

  public removeSpan(span: TextSpan) {
    this.spans.splice(span.childIndex, 1);
    this._element.removeChild(span.getElement());
    span.parent = null;
    span.childIndex = -1;
  }

  public insertSpan(position: number, span: TextSpan) {
    if (position < 0 || position > this.spans.length) {
      throw new Error("position is out of range");
    }
    if (span.parent != null) {
      throw new Error("TextSpan already has a parent");
    }

    span.parent = this;

    if (this.spans.length === 1 && this.spans[0].length == 0) {
      let toRemove = this.spans[0];
      this._element.removeChild(toRemove.getElement());

      this.spans[0] = span;
      this._element.insertBefore(span.getElement(), this._element.lastElementChild);
      span.childIndex = 0;
    } else if (this.spans.length === position) {
      this.appendSpan(span);
    } else {
      var current = this.spans[position];
      this.spans.splice(position, 0, span);
      this._element.insertBefore(span.getElement(), current.getElement());

      this.updateChildrenNumbering(current.childIndex);
    }

    // TODO update any cursors attached to this block
    this.resetLastEdittedValue();
  }

  private appendSpan(span: TextSpan) {
    span.childIndex = this.spans.length;
    this.spans.push(span);
    var element = this.getElement();
    element.insertBefore(span.getElement(), element.lastElementChild);
  }

  /* inheritdocs */
  public getElement(): HTMLElement {
    return this._element;
  }

  /* inheritdocs */
  public getBlockType(): BlockType {
    return BlockType.ContainerBlock;
  }

  private resetLastEdittedValue() {
    this._lastElementThatTextWasInsertedInto = this.spans[0];
    this._offsetToLastEditedSpan = 0;
  }

  private findContainingSpan(position: number): void {
    let relativeInsertionPoint = position - this._offsetToLastEditedSpan;

    let isTextInLastEditedSpan = this._offsetToLastEditedSpan < position
      && relativeInsertionPoint <= this._lastElementThatTextWasInsertedInto.length;

    if (isTextInLastEditedSpan) {
      // we're already there, yay
      return;
    }

    let currentOffset = 0;

    let span: TextSpan = this.spans[0];
    for (var i = 0; i < this.spans.length; i++) {
      span = this.spans[i];
      if (position >= currentOffset) {
        currentOffset += span.length;
      }
    }

    this._offsetToLastEditedSpan = currentOffset;
    this._lastElementThatTextWasInsertedInto = span;
  }

  private updateChildrenNumbering(startIndex: number = 0) {
    for (var i = startIndex; i < this.spans.length; i++) {
      this.spans[i].childIndex = i;
    }
  }
}