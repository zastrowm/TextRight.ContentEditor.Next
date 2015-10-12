// ReSharper disable StatementIsNotTerminated

namespace TextRight.ContentEditor {

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
      cursor.blockSpecificData = span;
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
        expect(cursor.blockSpecificData).toBe(span);
      })

      it("can move forward", () => {
        expect(cursor.moveForwardInBlock()).toBe(true);
        expect(cursor.offset).toBe(1);
        expect(cursor.blockSpecificData).toBe(span);
      })

      it("can move forward multiple times", () => {
        expect(cursor.moveForwardInBlock()).toBe(true);
        expect(cursor.offset).toBe(1);
        expect(cursor.blockSpecificData).toBe(span);

        expect(cursor.moveForwardInBlock()).toBe(true);
        expect(cursor.offset).toBe(2);
        expect(cursor.blockSpecificData).toBe(span);

        expect(cursor.moveForwardInBlock()).toBe(true);
        expect(cursor.offset).toBe(3);
        expect(cursor.blockSpecificData).toBe(span);
      })

      it("returns false when moving forward at the end", () => {
        moveForwardInBlock(3, true);

        expect(cursor.moveForwardInBlock()).toBe(false);
        expect(cursor.offset).toBe(3);
        expect(cursor.blockSpecificData).toBe(span);
      })

      it("can move backward", () => {
        moveForwardInBlock(3, true);

        expect(cursor.moveBackwardInBlock()).toBe(true, "Couldn't move backward");
        expect(cursor.offset).toBe(2);
        expect(cursor.blockSpecificData).toBe(span);
      })

      it("can move backward multiple times", () => {
        moveForwardInBlock(3, true);

        expect(cursor.moveBackwardInBlock()).toBe(true, "Couldn't move backward");
        expect(cursor.offset).toBe(2);
        expect(cursor.blockSpecificData).toBe(span);

        expect(cursor.moveBackwardInBlock()).toBe(true, "Couldn't move backward");
        expect(cursor.offset).toBe(1);
        expect(cursor.blockSpecificData).toBe(span);

        expect(cursor.moveBackwardInBlock()).toBe(true, "Couldn't move backward");
        expect(cursor.offset).toBe(0);
        expect(cursor.blockSpecificData).toBe(span);
      })

      it("returns false when backing at the beginning", () => {
        expect(cursor.moveBackwardInBlock()).toBe(false);
        expect(cursor.offset).toBe(0);
        expect(cursor.blockSpecificData).toBe(span);
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
        expect(cursor.blockSpecificData).toBe(span2);
      })

      it("moves forward to the end of the second span", () => {
        // move to the end of the spans
        moveForwardInBlock(6, true);

        expect(cursor.moveForwardInBlock()).toBe(false);
        expect(cursor.offset).toBe(3);
        expect(cursor.blockSpecificData).toBe(span2);
      })

      it("moves backward from the second span to the first", () => {
        moveForwardInBlock(4, true);

        expect(cursor.moveBackwardInBlock()).toBe(true);
        expect(cursor.offset).toBe(3);
        expect(cursor.blockSpecificData).toBe(span);
      })

      it("moves back to the begining", () => {
        moveForwardInBlock(6, true);
        moveBackwardInBlock(6, true);

        expect(cursor.offset).toBe(0);
        expect(cursor.blockSpecificData).toBe(span);
      })
    })

    describe("when iterating blocks", () => {
      let root: ContainerBlock;
      let a: TextBlock, b: TextBlock, c: TextBlock;

      beforeEach(() => {
        a = new TextBlock("some");
        b = new TextBlock("text");
        c = new TextBlock("last");
        root = new ContainerBlock([a, b, c]);

        cursor = new DocumentCursor();
        cursor.targetBlock = a;
        cursor.blockSpecificData = a.spans[0];
        cursor.offset = 0;
      });


      it("moves from end of one block to beginning of next", () => {
        let result = cursor.moveForwardToNextBlock();

        expect(result).toBe(true);

        expect(cursor.blockSpecificData).toBe(b.spans[0]);
        expect(cursor.targetBlock).toBe(b);
      });

      it("points to the beginging of a block when iterating forward", () => {
        cursor.offset = 2;

        cursor.moveForwardToNextBlock();


        expect(cursor.offset).toBe(0, "offset is not 0")
        expect(cursor.blockSpecificData).toBe(b.spans[0]);
        expect(cursor.targetBlock).toBe(b);
      })

      it("moves across multiple blocks when iterating forward", () => {
        let result = cursor.moveForwardToNextBlock();
        expect(result).toBe(true);

        result = cursor.moveForwardToNextBlock();
        expect(result).toBe(true);

        expect(cursor.blockSpecificData).toBe(c.spans[0]);
        expect(cursor.targetBlock).toBe(c);
      })

      it("stops when iterating forward at end of document", () => {
        cursor.moveForwardToNextBlock();
        cursor.moveForwardToNextBlock();

        let result = cursor.moveForwardToNextBlock();
        expect(result).toBe(false);

        expect(cursor.blockSpecificData).toBe(c.spans[0]);
        expect(cursor.targetBlock).toBe(c);
      });

      it("moves from one block to previous block", () => {
        cursor = new DocumentCursor(b, b.spans[0], 0);

        let result = cursor.moveBackwardToPreviousBlock();
        expect(result).toBe(true);

        expect(cursor.blockSpecificData).toBe(a.spans[0]);
        expect(cursor.targetBlock).toBe(a);
      });

      it("points to end of previous block when moving backwards in blocks", () => {
        cursor = new DocumentCursor(b, b.spans[0], 0);

        let result = cursor.moveBackwardToPreviousBlock();
        expect(result).toBe(true);

        expect(cursor.offset).toBe(4, "not pointing to the end of block A");
        expect(cursor.blockSpecificData).toBe(a.spans[0]);
        expect(cursor.targetBlock).toBe(a);
      })

      it("moves across multiple blocks when iterating backwards", () => {
        cursor = new DocumentCursor(c, c.spans[0], 0);

        let result = cursor.moveBackwardToPreviousBlock();
        expect(result).toBe(true);

        result = cursor.moveBackwardToPreviousBlock();
        expect(result).toBe(true);

        expect(cursor.blockSpecificData).toBe(a.spans[0]);
        expect(cursor.targetBlock).toBe(a);
      })
    });

    describe("when iterating between blocks within a tree hiearachy", () => {

      let root: ContainerBlock;
      let nodes: { [name: string]: Block } = {};

      let createFromObject = (data: any): ContainerBlock => {

        var blocks = [];

        for (var key of Object.getOwnPropertyNames(data)) {
          var value = data[key];
          let block;

          if (value === TextBlock) {
            block = new TextBlock(key);
            blocks.push(block);
          } else {
            block = createFromObject(value);
            blocks.push(block);
          }

          nodes[key] = block;
        }

        return new ContainerBlock(blocks);
      }

      beforeEach(() => {
        cursor = new DocumentCursor();

        root = createFromObject({
          b: {
            b1: {
              b11: TextBlock,
              b12: TextBlock,
              b13: TextBlock
            },
            b2: TextBlock,
            b3: TextBlock,
          },
          c: {
            c1: TextBlock,
            c2: TextBlock,
            c3: {
              c31: {
                c311: TextBlock,
              },
            },
          },
        })
      });

      let verify = (startNode, action, endNode) => {
        nodes[startNode].setCursorToBeginningOfBlock(cursor);
        let result = action();

        expect(result).toBe(true);

        expect(cursor.targetBlock).toBe(nodes[endNode]);
      };


      it("iterates between leaf nodes when moving forward (b13 to b2)", () => {
        verify("b13", () => cursor.moveForwardToNextBlock(), "b2");
      })

      it("iterates between leaf nodes when moving backwards (b2 to b13)", () => {
        verify("b2", () => cursor.moveBackwardToPreviousBlock(), "b13");
      })

      it("iterates deep hiearachy when moving forward (c2 to c311)", () => {
        verify("c2", () => cursor.moveForwardToNextBlock(), "c311");
      })

      it("iterates deep hiearachy when moving forward (c311 to c2)", () => {
        verify("c311", () => cursor.moveBackwardToPreviousBlock(), "c2");
      })

      it("will not iterate passed the end of the document when moving forward", () => {
        nodes["c311"].setCursorToBeginningOfBlock(cursor);

        let result = cursor.moveForwardToNextBlock();
        expect(result).toBe(false);

        expect(cursor.targetBlock).toBe(nodes["c311"]);
      })

      it("will not iterated passed the begining of the document when moving backward", () => {
        nodes["b11"].setCursorToBeginningOfBlock(cursor);

        let result = cursor.moveBackwardToPreviousBlock();
        expect(result).toBe(false);

        expect(cursor.targetBlock).toBe(nodes["b11"]);
      })
    })

  })
}