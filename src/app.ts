﻿

window.onload = () => {
  var contentElement = document.getElementById('document');

  var originalText = contentElement.textContent;

  var doc = new TextRight.ContentEditor.DocumentOwner();
  doc.attachTo(contentElement);

  (<TextRight.ContentEditor.TextBlock>doc.root.children[0]).spans[0].insertText(0, originalText);
};