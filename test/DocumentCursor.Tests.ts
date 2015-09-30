
describe("A DocumentCursor", () => {
  let block: TextBlock;
  let span: TextSpan;
  let cursor: DocumentCursor;

  beforeEach(() => {
    block = new TextBlock();

    span = block.spans[0];
    span.insertText(0, "123");

    cursor = new DocumentCursor();
    cursor.targetBlock = block;
    cursor.targetInline = span;
    cursor.offset = 0;
  });

  /* Move the cursor forward N times */
  const moveForwardInBlock = (times: number, expected?: boolean) => {
    for (var i = 0; i < times; i++) {
      var ret = cursor.moveForwardInBlock();
      if (expected != undefined) {
        expect(ret).toBe(expected);
      }
    }
  }

  /* Move the cursor backward N times */
  const moveBackwardInBlock = (times: number, expected?: boolean) => {
    for (var i = 0; i < times; i++) {
      var ret = cursor.moveBackwardInBlock();
      if (expected != undefined) {
        expect(ret).toBe(expected);
      }
    }
  }

  describe("when iterating a single span", () => {
    
    it("is setup correctly", () => {
      expect(cursor.offset).toBe(0);
      expect(cursor.targetInline).toBe(span);
    })

    it("can move forward", () => {
      expect(cursor.moveForwardInBlock()).toBe(true);
      expect(cursor.offset).toBe(1);
      expect(cursor.targetInline).toBe(span);
    })

    it("can move forward multiple times", () => {
      expect(cursor.moveForwardInBlock()).toBe(true);
      expect(cursor.offset).toBe(1);
      expect(cursor.targetInline).toBe(span);

      expect(cursor.moveForwardInBlock()).toBe(true);
      expect(cursor.offset).toBe(2);
      expect(cursor.targetInline).toBe(span);

      expect(cursor.moveForwardInBlock()).toBe(true);
      expect(cursor.offset).toBe(3);
      expect(cursor.targetInline).toBe(span);
    })

    it("returns false when moving forward at the end", () => {
      moveForwardInBlock(3, true);

      expect(cursor.moveForwardInBlock()).toBe(false);
      expect(cursor.offset).toBe(3);
      expect(cursor.targetInline).toBe(span);
    })

    it("can move backward", () => {
      moveForwardInBlock(3, true);

      expect(cursor.moveBackwardInBlock()).toBe(true, "Couldn't move backward");
      expect(cursor.offset).toBe(2);
      expect(cursor.targetInline).toBe(span);
    })

    it("can move backward multiple times", () => {
      moveForwardInBlock(3, true);

      expect(cursor.moveBackwardInBlock()).toBe(true, "Couldn't move backward");
      expect(cursor.offset).toBe(2);
      expect(cursor.targetInline).toBe(span);

      expect(cursor.moveBackwardInBlock()).toBe(true, "Couldn't move backward");
      expect(cursor.offset).toBe(1);
      expect(cursor.targetInline).toBe(span);

      expect(cursor.moveBackwardInBlock()).toBe(true, "Couldn't move backward");
      expect(cursor.offset).toBe(0);
      expect(cursor.targetInline).toBe(span);
    })

    it("returns false when backing at the beginning", () => {
      expect(cursor.moveBackwardInBlock()).toBe(false);
      expect(cursor.offset).toBe(0);
      expect(cursor.targetInline).toBe(span);
    })
  })

  describe("when iterating multiple spans", () => {
    let span2: TextSpan;

    beforeEach(() => {
      span2 = new TextSpan();
      span2.insertText(0, "456");

      block.insertSpan(1, span2);
    })

    it("transitions to span 2 when moving forward at end of first", () => {
      moveForwardInBlock(3, true);

      expect(cursor.moveForwardInBlock()).toBe(true);
      expect(cursor.offset).toBe(1);
      expect(cursor.targetInline).toBe(span2);
    })

    it("moves forward to the end of the second span", () => {
      // move to the end of the spans
      moveForwardInBlock(6, true);

      expect(cursor.moveForwardInBlock()).toBe(false);
      expect(cursor.offset).toBe(3);
      expect(cursor.targetInline).toBe(span2);
    })

    it("moves backward from the second span to the first", () => {
      moveForwardInBlock(4, true);

      expect(cursor.moveBackwardInBlock()).toBe(true);
      expect(cursor.offset).toBe(3);
      expect(cursor.targetInline).toBe(span);
    })

    it("moves back to the begining", () => {
      moveForwardInBlock(6, true);
      moveBackwardInBlock(6, true);

      expect(cursor.offset).toBe(0);
      expect(cursor.targetInline).toBe(span);
    })


  })
})