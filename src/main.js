import Editor from '@toast-ui/editor';

document.addEventListener('DOMContentLoaded', function() {
  const editor = new Editor({
    el: document.querySelector('#editor'),
    height: '500px',
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    events: {
      change: editorChanged
    }
  });

  function editorChanged() {
    // console.log(editor.getMarkdown())
  }
})
