const MAX_LENGTH = 280;
const EMPTY_TEXT = 'Your message preview will appear here.';

export function initMessagePreview() {
  const root = document.querySelector('#message-preview-demo');
  if (!root) return;

  const opener = document.querySelector('#mp-open');
  if (opener) {
    opener.addEventListener('click', () => {
      const opening = root.hidden;
      root.hidden = !opening;
      opener.textContent = opening ? 'Close Demo' : 'Try Demo';
      opener.setAttribute('aria-expanded', String(opening));
      if (opening) root.querySelector('#mp-input').focus();
    });
  }

  const input = root.querySelector('#mp-input');
  const counter = root.querySelector('#mp-count');
  const preview = root.querySelector('#mp-preview');
  const toggle = root.querySelector('#mp-toggle');
  const addNote = root.querySelector('#mp-add-note');
  const notes = root.querySelector('#mp-notes');

  function update() {
    const length = input.value.length;
    counter.textContent = `${length} / ${MAX_LENGTH}`;
    counter.classList.toggle('mp__counter--limit', length >= MAX_LENGTH);
    preview.textContent = input.value || EMPTY_TEXT;
  }

  input.addEventListener('input', update);

  toggle.addEventListener('click', () => {
    const hidden = preview.classList.toggle('hidden');
    toggle.textContent = hidden ? 'Show Preview' : 'Hide Preview';
    toggle.setAttribute('aria-expanded', String(!hidden));
  });

  addNote.addEventListener('click', () => {
    const note = document.createElement('p');
    note.className = 'mp__note';
    note.textContent = `Temporary note ${notes.children.length + 1}`;
    notes.appendChild(note);
  });

  update();
}
