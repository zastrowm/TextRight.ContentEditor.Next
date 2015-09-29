"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
;
var DocumentOwner = (function () {
    function DocumentOwner() {
        this._undoStack = new UndoStack();
        this._blockMap = new Map();
        this._root = new ContainerBlock();
        this._root.appendChild(new TextBlock());
    }
    DocumentOwner.prototype.attachTo = function (element) {
        element.innerHTML = "";
        element.appendChild(this._root.getElement());
    };
    Object.defineProperty(DocumentOwner.prototype, "undo", {
        get: function () {
            return this._undoStack;
        },
        enumerable: true,
        configurable: true
    });
    DocumentOwner.prototype.getBlock = function (id) {
        // TODO actually get the block associated with the given id
        return null;
    };
    return DocumentOwner;
})();
/** A block of content within the document. */
var Block = (function () {
    function Block() {
    }
    /**
     * Gets the path to the block.  This path uniquely defines this block for the
     * current state of the document.
    **/
    Block.prototype.getPath = function () {
        var current = this;
        var path = "";
        while (current != null) {
            path = path + "." + current.childId;
            current = current.parent;
        }
        return path;
    };
    return Block;
})();
/**
 * A block that only contains other blocks.
 */
var ContainerBlock = (function (_super) {
    __extends(ContainerBlock, _super);
    function ContainerBlock() {
        _super.call(this);
        this.children = [];
        this._element = document.createElement("DIV");
    }
    ContainerBlock.prototype.renumberChildren = function () {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].childId = i;
        }
    };
    ContainerBlock.prototype.appendChild = function (block) {
        this.children.push(block);
        this._element.appendChild(block.getElement());
        block.parent = this;
        block.childId = this.children.length - 1;
        // no need to renumber because we added to the end
    };
    ContainerBlock.prototype.getElement = function () {
        return this._element;
    };
    return ContainerBlock;
})(Block);
var InsertTextIntoBlockEvent = (function () {
    function InsertTextIntoBlockEvent() {
    }
    InsertTextIntoBlockEvent.prototype.do = function (owner, textblock) {
        if (textblock === void 0) { textblock = null; }
        textblock = UndoHelpers.getTextBlock(owner, textblock, this.insertBlockId);
        textblock.insertText(this.characterInsertionIndex, this.textToInsert);
    };
    InsertTextIntoBlockEvent.prototype.undo = function (owner) {
        var textBlock = UndoHelpers.getTextBlock(owner, null, this.insertBlockId);
        textBlock.removeText(this.characterInsertionIndex, this.textToInsert.length);
    };
    return InsertTextIntoBlockEvent;
})();
var TextBlock = (function (_super) {
    __extends(TextBlock, _super);
    function TextBlock() {
        _super.call(this);
        this._element = document.createElement("p");
        this._start = document.createElement("span");
        this._end = document.createElement("span");
        this.spans = [new TextSpan()];
        this._element.appendChild(this._start);
        this._element.appendChild(this.spans[0].getElement());
        this._element.appendChild(this._end);
        this._lastElementThatTextWasInsertedInto = this.spans[0];
        this._lastRelativeIndexOfEditedSpan = 0;
        this._offsetToLastEditedSpan = 0;
    }
    TextBlock.prototype.insertText = function (position, text) {
        var relativeInsertionPoint = position - this._offsetToLastEditedSpan;
        // TODO do we have to handle inserting before the given position
        var isTextInLastEditedSpan = this._offsetToLastEditedSpan < position
            && relativeInsertionPoint <= this._lastElementThatTextWasInsertedInto.length;
        if (isTextInLastEditedSpan) {
            this._lastElementThatTextWasInsertedInto.insertText(relativeInsertionPoint, text);
        }
        else {
            for (var i = 0; i < this.spans.length; i++) {
            }
        }
    };
    TextBlock.prototype.findContainingSpan = function (position) {
        var relativeInsertionPoint = position - this._offsetToLastEditedSpan;
        var isTextInLastEditedSpan = this._offsetToLastEditedSpan < position
            && relativeInsertionPoint <= this._lastElementThatTextWasInsertedInto.length;
        if (isTextInLastEditedSpan) {
            // we're already there, yay
            return;
        }
        var currentOffset = 0;
        for (var i = 0; i < this.spans.length; i++) {
            var span = this.spans[i];
            if (position >= currentOffset) {
            }
        }
    };
    TextBlock.prototype.removeText = function (index, length) {
    };
    TextBlock.prototype.getElement = function () {
        return this._element;
    };
    return TextBlock;
})(Block);
var TextSpan = (function () {
    function TextSpan() {
        this._element = document.createElement("SPAN");
    }
    Object.defineProperty(TextSpan.prototype, "length", {
        get: function () {
            return this._length;
        },
        enumerable: true,
        configurable: true
    });
    TextSpan.prototype.getElement = function () {
        return this._element;
    };
    TextSpan.prototype.insertText = function (relativeInsertionPoint, text) {
        var element = this._element;
        var textContent = element.textContent;
        element.textContent = textContent.substr(0, relativeInsertionPoint)
            + text
            + textContent.substr(relativeInsertionPoint);
        // TODO count UNICODE instead of characters
        this._length += text.length;
    };
    return TextSpan;
})();
//# sourceMappingURL=Block.js.map