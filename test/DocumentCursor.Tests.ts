
describe("A DocumentCursor", () => {
  let block: TextBlock;
  let span: TextSpan;
  let cursor: DocumentCursor;


  beforeAll(() => {
    block = new TextBlock();

    span = block.spans[0];
    span.insertText(0, "12345");

    cursor = new DocumentCursor();
    cursor.targetBlock = block;
    cursor.targetInline = span;
    cursor.offset = 0;
  });

  describe("when iterating a single span", () => {
    
    it("can get the first character", () => {
      var char = cursor.getCharacterAfter();
      expect(char).toBe("1");
    })

  })
})