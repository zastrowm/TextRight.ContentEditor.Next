// ReSharper disable StatementIsNotTerminated

describe("A TestSpan", () => {

  let textSpan: TextSpan;

  beforeEach(() => {
    textSpan = new TextSpan();
  });

  it("is empty by default", () => {
    expect(textSpan.length).toBe(0);
  });

  describe("when inserting", () => {

    describe("at the beginning", () => {

      it("appends text when empty", () => {
        textSpan.insertText(0, "test");
        expect(textSpan.getText()).toBe("test");
        expect(textSpan.length).toBe(4);
      });

      it("prepends text when not empty", () => {
        textSpan.insertText(0, "5678");
        textSpan.insertText(0, "1234");
        expect(textSpan.getText()).toBe("12345678");
        expect(textSpan.length).toBe(8);
      });
    });

    describe("onto the end", () => {
      it("appends text when empty", () => {
        textSpan.insertText(1, "end");
        expect(textSpan.getText()).toBe("end");
        expect(textSpan.length).toBe(3);
      });

      it("appends text when not empty", () => {
        textSpan.insertText(1, "text");
        textSpan.insertText(4, "more");
        expect(textSpan.getText()).toBe("textmore");
        expect(textSpan.length).toBe(8);
      });
    });

    describe("into the middle", () => {
      it("inserts into existing text", () => {
        textSpan.insertText(0, "1|2");
        textSpan.insertText(1, "_");
        expect(textSpan.getText()).toBe("1_|2");
        expect(textSpan.length).toBe(4);
      });
    });
  });


  describe("when deleting", () => {

    beforeEach(() => {
      textSpan.insertText(0, "1234567890");
      expect(textSpan.length).toBe(10);
    });

    it("deletes from the begining", () => {
      let deletedText = textSpan.removeText(0, 1);

      expect(deletedText).toBe("1");
      expect(textSpan.length).toBe(9);
      expect(textSpan.getText()).toBe("234567890");
    })

    it("deletes from the end", () => {
      let deletedText = textSpan.removeText(9, 1);

      expect(deletedText).toBe("0");
      expect(textSpan.length).toBe(9);
      expect(textSpan.getText()).toBe("123456789");
    })

    it("deletes from the middle", () => {
      let deletedText = textSpan.removeText(5, 1);

      expect(deletedText).toBe("6");
      expect(textSpan.length).toBe(9);
      expect(textSpan.getText()).toBe("123457890");
    })

    it("deletes the entire span", () => {
      let deletedText = textSpan.removeText(0, 10);

      expect(deletedText).toBe("1234567890");
      expect(textSpan.length).toBe(0);
      expect(textSpan.getText()).toBe("");
    })
  })

});