describe("A TestSpan", function () {
    var textSpan;
    beforeAll(function () {
        textSpan = new TextSpan();
    });
    it("is empty by default", function () {
        expect(textSpan.length).toBe(0);
    });
    describe("with insert position of 0", function () {
        it("appends text when empty", function () {
            textSpan.insertText(0, "test");
            expect(textSpan.getText()).toBe("test");
        });
    });
});
//# sourceMappingURL=TextSpan.js.map