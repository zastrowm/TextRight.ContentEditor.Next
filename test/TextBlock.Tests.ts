// ReSharper disable StatementIsNotTerminated

namespace TextRight.ContentEditor {


  describe("A TextBlock", () => {

    let textBlock: TextBlock;

    beforeEach(() => {
      textBlock = new TextBlock();
    });

    describe("by default", () => {
      it("has one child", () => {
        expect(textBlock.spans.length).toBe(1);
      });

      it("has one child that has no text", () => {
        expect(textBlock.spans[0].getText()).toBe("");
      })
    });

    describe("when inserting text spans", () => {

      var first: TextSpan;


      beforeEach(() => {
        first = textBlock.spans[0];
      });

      afterEach(() => {
        var current = textBlock.getElement().firstElementChild.nextElementSibling;
        for (var i = 0; i < textBlock.spans.length; i++) {
          let span = textBlock.spans[i];
          let actualIndex = span.childIndex;

          expect(actualIndex).toBe(i, `Child at index ${i} has childIndex of ${actualIndex}`)
          expect(span.getElement()).toBe(current, "Elements not matched at " + i);
          expect(span.parent).toBe(textBlock, `Parent of child ${i} is not the text span`);

          current = current.nextElementSibling;
        }
      })

      let createSpan = (text) => {
        let span = new TextSpan();
        span.insertText(0, text);
        return span;
      };


      describe("into a non-empty block", () => {
        beforeEach(() => {
          first.insertText(0, "1");
        });


        it("allows appending to first span", () => {

          var second = createSpan("2");

          textBlock.insertSpan(1, second);

          expect(textBlock.spans.length).toBe(2);
          expect(textBlock.spans[0]).toBe(first);
          expect(textBlock.spans[1]).toBe(second);

          expect(textBlock.getElement().childElementCount).toBe(4);
        });

        it("allows inserting between elements", () => {
          var second = createSpan("2");
          var third = createSpan("3");

          textBlock.insertSpan(1, third);
          textBlock.insertSpan(1, second);

          expect(textBlock.spans.length).toBe(3);
          expect(textBlock.spans).toEqual([first, second, third], "Elements are not ordered correctly");
        });

        it("allows prepending elements", () => {
          var newFirst = createSpan("0");

          textBlock.insertSpan(0, newFirst);

          expect(textBlock.spans.length).toBe(2);
          expect(textBlock.spans).toEqual([newFirst, first], "Elements are not ordered correctly");
        })
      })

      describe("into an empty block", () => {

        it("appending replaces the existing span", () => {
          expect(first.getText()).toBe("");

          let onlySpan = createSpan("this is some text");
          textBlock.insertSpan(1, onlySpan);

          expect(textBlock.spans.length).toBe(1);
          expect(textBlock.spans).toEqual([onlySpan], "Elements are not ordered correctly");
        })

        it("prepending replaces the existing span", () => {
          expect(first.getText()).toBe("");

          let onlySpan = createSpan("this is some text");
          textBlock.insertSpan(0, onlySpan);

          expect(textBlock.spans.length).toBe(1);
          expect(textBlock.spans).toEqual([onlySpan], "Elements are not ordered correctly");
        })
      })
    });
  });
}