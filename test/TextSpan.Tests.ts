

describe("A TestSpan", () => {

  let textSpan;

  beforeEach(() => {
    textSpan = new TextSpan();
  });

  it("is empty by default", () => {
    expect(textSpan.length).toBe(0);
  });

  describe("with insert position of 0", () => {

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

  describe("with insert position at end", () => {
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

  describe("with middle insertion point", () => {
    it("inserts into existing text", () => {
      textSpan.insertText(0, "1|2");
      textSpan.insertText(1, "_");
      expect(textSpan.getText()).toBe("1_|2");
      expect(textSpan.length).toBe(4);
    });
  });

});