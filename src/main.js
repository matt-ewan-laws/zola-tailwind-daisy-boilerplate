document.addEventListener('DOMContentLoaded', function () {
  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach(function (codeBlock) {
    const copyButton = document.createElement('button');
    copyButton.innerHTML = 'Copy';
    copyButton.className = 'copy-button';
    codeBlock.parentNode.insertBefore(copyButton, codeBlock);

    copyButton.addEventListener('click', function () {
      const range = document.createRange();
      range.selectNode(codeBlock);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      copyButton.innerHTML = 'Copied!';
      setTimeout(function () {
        copyButton.innerHTML = 'Copy';
      }, 2000);
    });
  });
});
