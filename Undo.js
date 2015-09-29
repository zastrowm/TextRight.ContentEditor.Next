"use strict";
var UndoHelpers;
(function (UndoHelpers) {
    function getTextBlock(owner, textBlock, id) {
        if (textBlock != null) {
            return textBlock;
        }
        var block = owner.getBlock(id);
        if (!(block instanceof TextBlock)) {
            // TODO make this strongly typed and include more info
            throw new Error("Block to be retreived is expected to be a TextBlock, but is not");
        }
        return block;
    }
    UndoHelpers.getTextBlock = getTextBlock;
})(UndoHelpers || (UndoHelpers = {}));
var UndoStack = (function () {
    function UndoStack() {
    }
    UndoStack.prototype.add = function (undoEvent) {
        // TODO 
    };
    return UndoStack;
})();
//# sourceMappingURL=Undo.js.map