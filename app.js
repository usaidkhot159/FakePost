/**
 * app.js — FakePost application controller
 * Manages state, binds controls, and orchestrates rendering.
 */

const App = (() => {

  /* ─────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────── */

  const state = {
    theme:      'instagram',
    username:   'johndoe',
    displayName:'John Doe',
    caption:    'Living my best life ✨ #vibes #lifestyle',
    avatarSrc:  null,
    postImgSrc: null,
    likes:      '4287',
    views:      '18400',
    shares:     '312',
    timestamp:  '2h ago',
    comments: [
      { user: 'sarah_smith', text: 'This is amazing! 😍' },
      { user: 'mike_r',      text: 'Love this so much 🔥' },
    ],
  };

  /* ─────────────────────────────────────────────
     DOM REFS
  ───────────────────────────────────────────── */

  const $ = id => document.getElementById(id);

  const els = {
    postContainer:  () => $('postContainer'),
    username:       () => $('username'),
    displayName:    () => $('displayName'),
    caption:        () => $('caption'),
    likes:          () => $('likes'),
    views:          () => $('views'),
    shares:         () => $('shares'),
    timestamp:      () => $('timestamp'),
    avatarInput:    () => $('avatarInput'),
    avatarImg:      () => $('avatarImg'),
    avatarInitials: () => $('avatarInitials'),
    avatarCircle:   () => $('avatarCircle'),
    removeAvatarBtn:() => $('removeAvatarBtn'),
    postImgInput:   () => $('postImgInput'),
    postImgLabel:   () => $('postImgLabel'),
    postImgText:    () => $('postImgText'),
    removePostImgBtn:()=> $('removePostImgBtn'),
    commentsContainer:()=> $('commentsContainer'),
    downloadBtn:    () => $('downloadBtn'),
    previewCanvas:  () => $('previewCanvas'),
  };

  /* ─────────────────────────────────────────────
     RENDERING
  ───────────────────────────────────────────── */

  function render() {
    els.postContainer().innerHTML = Themes.render(state.theme, state);
  }

  /* ─────────────────────────────────────────────
     COMMENTS UI
  ───────────────────────────────────────────── */

  function renderComments() {
    const container = els.commentsContainer();
    container.innerHTML = '';

    state.comments.forEach((c, i) => {
      const row = document.createElement('div');
      row.className = 'comment-row';

      const uInput = document.createElement('input');
      uInput.type = 'text';
      uInput.className = 'cm-user';
      uInput.placeholder = 'username';
      uInput.value = c.user;
      uInput.maxLength = 30;
      uInput.addEventListener('input', e => {
        state.comments[i].user = e.target.value;
        render();
      });

      const tInput = document.createElement('input');
      tInput.type = 'text';
      tInput.className = 'cm-text';
      tInput.placeholder = 'Comment text…';
      tInput.value = c.text;
      tInput.maxLength = 120;
      tInput.addEventListener('input', e => {
        state.comments[i].text = e.target.value;
        render();
      });

      const del = document.createElement('button');
      del.className = 'comment-del';
      del.setAttribute('aria-label', 'Remove comment');
      del.innerHTML = '<i class="ti ti-x"></i>';
      del.addEventListener('click', () => removeComment(i));

      row.appendChild(uInput);
      row.appendChild(tInput);
      row.appendChild(del);
      container.appendChild(row);
    });
  }

  function addComment() {
    if (state.comments.length >= 8) {
      Utils.toast('Max 8 comments');
      return;
    }
    state.comments.push({ user: `user${state.comments.length + 1}`, text: '' });
    renderComments();
    render();
  }

  function removeComment(i) {
    state.comments.splice(i, 1);
    renderComments();
    render();
  }

  /* ─────────────────────────────────────────────
     AVATAR
  ───────────────────────────────────────────── */

  function updateAvatarUI() {
    const circle = els.avatarCircle();
    const initialsEl = els.avatarInitials();
    const imgEl      = els.avatarImg();
    const removeBtn  = els.removeAvatarBtn();

    if (state.avatarSrc) {
      imgEl.src = state.avatarSrc;
      imgEl.style.display = 'block';
      initialsEl.style.display = 'none';
      removeBtn.style.display = 'inline-flex';
    } else {
      imgEl.style.display = 'none';
      initialsEl.style.display = 'block';
      initialsEl.textContent = Utils.initials(state.username);
      removeBtn.style.display = 'none';
    }
  }

  function removeAvatar() {
    state.avatarSrc = null;
    els.avatarInput().value = '';
    updateAvatarUI();
    render();
  }

  /* ─────────────────────────────────────────────
     POST IMAGE
  ───────────────────────────────────────────── */

  function updatePostImageUI() {
    const label     = els.postImgLabel();
    const text      = els.postImgText();
    const removeBtn = els.removePostImgBtn();

    if (state.postImgSrc) {
      label.classList.add('has-image');
      text.textContent = 'Image uploaded ✓';
      removeBtn.style.display = 'inline-flex';
    } else {
      label.classList.remove('has-image');
      text.textContent = 'Click to upload an image';
      removeBtn.style.display = 'none';
    }
  }

  function removePostImage() {
    state.postImgSrc = null;
    els.postImgInput().value = '';
    updatePostImageUI();
    render();
  }

  /* ─────────────────────────────────────────────
     THEME
  ───────────────────────────────────────────── */

  function setTheme(theme, btn) {
    state.theme = theme;
    document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  }

  /* ─────────────────────────────────────────────
     PREVIEW BACKGROUND
  ───────────────────────────────────────────── */

  function setPreviewBg(mode, btn) {
    const canvas = els.previewCanvas();
    canvas.classList.remove('bg-light', 'bg-dark');
    if (mode === 'light') canvas.classList.add('bg-light');
    if (mode === 'dark')  canvas.classList.add('bg-dark');
    document.querySelectorAll('.preview-ctrl').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  /* ─────────────────────────────────────────────
     DOWNLOAD
  ───────────────────────────────────────────── */

  function download() {
    const postEl = els.postContainer().firstElementChild;
    if (!postEl) { Utils.toast('Nothing to download'); return; }

    const btn = els.downloadBtn();
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Generating…';

    html2canvas(postEl, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `fakepost-${state.theme}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      Utils.toast('Downloaded!');
    }).catch(err => {
      console.error(err);
      Utils.toast('Download failed. Try again.');
    }).finally(() => {
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Download as PNG';
    });
  }

  /* ─────────────────────────────────────────────
     COPY TO CLIPBOARD
  ───────────────────────────────────────────── */

  async function copyToClipboard() {
    const postEl = els.postContainer().firstElementChild;
    if (!postEl) { Utils.toast('Nothing to copy'); return; }

    try {
      const canvas = await html2canvas(postEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      canvas.toBlob(async blob => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          Utils.toast('Copied to clipboard!');
        } catch {
          Utils.toast('Clipboard not supported — use Download instead');
        }
      }, 'image/png');
    } catch (err) {
      console.error(err);
      Utils.toast('Could not copy image');
    }
  }

  /* ─────────────────────────────────────────────
     BIND CONTROLS
  ───────────────────────────────────────────── */

  function bind() {
    // Text inputs → state + render
    const textBindings = [
      ['username',    'username'],
      ['displayName', 'displayName'],
      ['caption',     'caption'],
      ['likes',       'likes'],
      ['views',       'views'],
      ['shares',      'shares'],
      ['timestamp',   'timestamp'],
    ];

    textBindings.forEach(([elId, stateKey]) => {
      const el = $(elId);
      if (!el) return;
      el.addEventListener('input', e => {
        state[stateKey] = e.target.value;
        if (stateKey === 'username') {
          // update initials in sidebar too
          if (!state.avatarSrc) {
            els.avatarInitials().textContent = Utils.initials(e.target.value);
          }
        }
        render();
      });
    });

    // Avatar upload
    els.avatarInput().addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      state.avatarSrc = await Utils.readFileAsDataURL(file);
      updateAvatarUI();
      render();
    });

    // Post image upload
    els.postImgInput().addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      state.postImgSrc = await Utils.readFileAsDataURL(file);
      updatePostImageUI();
      render();
    });

    // Drag & drop on post image label
    const postLabel = els.postImgLabel();
    postLabel.addEventListener('dragover', e => { e.preventDefault(); postLabel.style.borderColor = '#6366f1'; });
    postLabel.addEventListener('dragleave', () => { postLabel.style.borderColor = ''; });
    postLabel.addEventListener('drop', async e => {
      e.preventDefault();
      postLabel.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      state.postImgSrc = await Utils.readFileAsDataURL(file);
      updatePostImageUI();
      render();
    });
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */

  function init() {
    bind();
    renderComments();
    updateAvatarUI();
    updatePostImageUI();
    render();
  }

  document.addEventListener('DOMContentLoaded', init);

  // Public API (called from HTML onclick)
  return { setTheme, setPreviewBg, addComment, removeAvatar, removePostImage, download, copyToClipboard };

})();
