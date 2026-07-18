/**
 * themes.js — HTML builders for each social platform post
 * Each function receives a `state` object and returns an HTML string.
 */

const Themes = (() => {

  /* ─────────────────────────────────────────────
     SHARED HELPERS
  ───────────────────────────────────────────── */

  function avatarEl(state, size, extraClass = '') {
    const ini = Utils.initials(state.username);
    if (state.avatarSrc) {
      return `<img src="${state.avatarSrc}" alt="avatar" class="${extraClass}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;display:block;">`;
    }
    return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#c7c7c7;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${Math.round(size*0.35)}px;color:#555;flex-shrink:0;" class="${extraClass}">${Utils.escapeHtml(ini)}</div>`;
  }

  function postImageEl(state, className = 'post-real-img') {
    if (state.postImgSrc) {
      return `<img src="${state.postImgSrc}" alt="Post image" class="${className}" />`;
    }
    return `<div class="post-placeholder-img"><i class="ti ti-photo"></i><span>No image uploaded</span></div>`;
  }

  /* ─────────────────────────────────────────────
     INSTAGRAM
  ───────────────────────────────────────────── */

  function instagram(state) {
    const u  = Utils.escapeHtml(state.username);
    const dn = Utils.escapeHtml(state.displayName);
    const cap = Utils.escapeHtml(state.caption);
    const likes = Utils.formatNum(state.likes);
    const ts = Utils.escapeHtml(state.timestamp);

    const avatarInner = state.avatarSrc
      ? `<img src="${state.avatarSrc}" alt="avatar" />`
      : `<div class="ig-avatar-fallback">${Utils.escapeHtml(Utils.initials(state.username))}</div>`;

    const commentsHtml = state.comments.slice(0, 4).map(c =>
      `<div class="ig-comment"><span class="ig-comment-user">${Utils.escapeHtml(c.user)}</span>${Utils.escapeHtml(c.text)}</div>`
    ).join('');

    return `
<div class="post-wrap ig-post">
  <div class="ig-header">
    <div class="ig-avatar">
      <div class="ig-avatar-inner">${avatarInner}</div>
    </div>
    <div class="ig-user-info">
      <div class="ig-username">${u}</div>
      <div class="ig-subline">Original audio</div>
    </div>
    <div class="ig-more">···</div>
  </div>
  <div class="ig-image-wrap">${postImageEl(state)}</div>
  <div class="ig-actions">
    <span class="ig-action-icon">♡</span>
    <span class="ig-action-icon" style="font-size:20px;">💬</span>
    <span class="ig-action-icon" style="font-size:18px;">↗</span>
    <span class="ig-action-icon ig-bookmark" style="font-size:20px;">🔖</span>
  </div>
  <div class="ig-likes">${likes} likes</div>
  <div class="ig-caption"><span class="ig-caption-user">${u}</span>${cap}</div>
  ${commentsHtml ? `<div class="ig-comments">${commentsHtml}</div>` : ''}
  <div class="ig-timestamp">${ts}</div>
</div>`;
  }

  /* ─────────────────────────────────────────────
     X / TWITTER
  ───────────────────────────────────────────── */

  function twitter(state) {
    const u   = Utils.escapeHtml(state.username);
    const dn  = Utils.escapeHtml(state.displayName);
    const cap = Utils.escapeHtml(state.caption);
    const likes   = Utils.formatNum(state.likes);
    const views   = Utils.formatNum(state.views);
    const replies = state.comments.length;
    const rts     = Utils.formatNum(Math.round((parseInt(state.likes) || 0) * 0.28));
    const ts  = Utils.escapeHtml(state.timestamp);

    const avatarHtml = state.avatarSrc
      ? `<img src="${state.avatarSrc}" alt="avatar" style="width:100%;height:100%;object-fit:cover;">`
      : `<span>${Utils.escapeHtml(Utils.initials(state.username))}</span>`;

    const imgSection = state.postImgSrc
      ? `<div class="tw-image-wrap">${postImageEl(state)}</div>`
      : '';

    const commentsHtml = state.comments.slice(0, 2).map(c =>
      `<div class="tw-comment"><span class="tw-comment-user">@${Utils.escapeHtml(c.user)}</span>${Utils.escapeHtml(c.text)}</div>`
    ).join('');

    return `
<div class="post-wrap tw-post">
  <div class="tw-header">
    <div class="tw-avatar">${avatarHtml}</div>
    <div class="tw-user-meta">
      <div class="tw-display-name">${dn} <span style="color:#71767b;font-weight:400;font-size:13px;">✓</span></div>
      <div class="tw-handle">@${u}</div>
    </div>
    <div class="tw-more" style="margin-left:auto;font-size:18px;color:#71767b;">···</div>
  </div>
  <div class="tw-body">${cap}</div>
  ${imgSection}
  <div class="tw-meta-row">${ts} · <span style="color:#e7e9ea;font-weight:700;">${views}</span> Views</div>
  <div class="tw-metrics-row">
    <div class="tw-metric"><strong>${replies}</strong> Replies</div>
    <div class="tw-metric"><strong>${rts}</strong> Reposts</div>
    <div class="tw-metric"><strong>${likes}</strong> Likes</div>
    <div class="tw-metric"><strong>${views}</strong> Bookmarks</div>
  </div>
  <div class="tw-actions">
    <div class="tw-action-btn"><i class="ti ti-message-circle"></i><span>${replies}</span></div>
    <div class="tw-action-btn"><i class="ti ti-repeat"></i><span>${rts}</span></div>
    <div class="tw-action-btn heart"><i class="ti ti-heart"></i><span>${likes}</span></div>
    <div class="tw-action-btn"><i class="ti ti-chart-bar"></i><span>${views}</span></div>
    <div class="tw-action-btn"><i class="ti ti-share"></i></div>
  </div>
  ${commentsHtml ? `<div class="tw-comments">${commentsHtml}</div>` : ''}
</div>`;
  }

  /* ─────────────────────────────────────────────
     FACEBOOK
  ───────────────────────────────────────────── */

  function facebook(state) {
    const u   = Utils.escapeHtml(state.username);
    const dn  = Utils.escapeHtml(state.displayName);
    const cap = Utils.escapeHtml(state.caption);
    const likes = Utils.formatNum(state.likes);
    const ts  = Utils.escapeHtml(state.timestamp);

    const avatarHtml = state.avatarSrc
      ? `<img src="${state.avatarSrc}" alt="avatar" style="width:100%;height:100%;object-fit:cover;">`
      : `<span>${Utils.escapeHtml(Utils.initials(state.username))}</span>`;

    const commentsHtml = state.comments.slice(0, 3).map(c => {
      const cIni = Utils.escapeHtml(Utils.initials(c.user));
      return `<div class="fb-comment">
        <div class="fb-comment-av">${cIni}</div>
        <div class="fb-comment-bubble">
          <span class="fb-comment-name">${Utils.escapeHtml(c.user)}</span>${Utils.escapeHtml(c.text)}
        </div>
      </div>`;
    }).join('');

    return `
<div class="post-wrap fb-post">
  <div class="fb-header">
    <div class="fb-avatar">${avatarHtml}</div>
    <div style="flex:1;">
      <div class="fb-user-name">${dn}</div>
      <div class="fb-user-meta">
        ${ts} · <span class="fb-privacy">🌐</span>
      </div>
    </div>
    <div class="fb-more">···</div>
  </div>
  <div class="fb-body">${cap}</div>
  <div class="fb-image-wrap">${postImageEl(state)}</div>
  <div class="fb-reactions-row">
    <span><span class="fb-reaction-icons">👍❤️😂</span> ${likes}</span>
    <span>${state.comments.length} comments · ${Utils.formatNum(state.shares)} shares</span>
  </div>
  <div class="fb-action-bar">
    <div class="fb-action"><i class="ti ti-thumb-up"></i> Like</div>
    <div class="fb-action"><i class="ti ti-message-circle"></i> Comment</div>
    <div class="fb-action"><i class="ti ti-share"></i> Share</div>
  </div>
  ${commentsHtml ? `<div class="fb-comments">${commentsHtml}</div>` : ''}
</div>`;
  }

  /* ─────────────────────────────────────────────
     TIKTOK
  ───────────────────────────────────────────── */

  function tiktok(state) {
    const u   = Utils.escapeHtml(state.username);
    const cap = Utils.escapeHtml(state.caption);
    const likes = Utils.formatNum(state.likes);
    const views = Utils.formatNum(state.views);
    const cmts  = state.comments.length;

    const avatarHtml = state.avatarSrc
      ? `<img src="${state.avatarSrc}" alt="avatar" style="width:100%;height:100%;object-fit:cover;">`
      : `<span>${Utils.escapeHtml(Utils.initials(state.username))}</span>`;

    const videoContent = state.postImgSrc
      ? `<img src="${state.postImgSrc}" alt="Post" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`
      : `<div class="post-placeholder-img" style="color:#555;"><i class="ti ti-video" style="font-size:36px;"></i><span style="font-size:12px;">No image uploaded</span></div>`;

    return `
<div class="post-wrap tt-post">
  <div class="tt-layout">
    <div class="tt-video-area">
      ${videoContent}
      <div class="tt-gradient"></div>
      <div class="tt-bottom-info">
        <div class="tt-username">@${u}</div>
        <div class="tt-caption">${cap}</div>
        <div class="tt-audio">
          <div class="tt-audio-disc">♪</div>
          <span>Original audio · @${u}</span>
        </div>
      </div>
    </div>
    <div class="tt-sidebar">
      <div class="tt-av">${avatarHtml}</div>
      <div class="tt-side-action">
        <i class="ti ti-heart"></i>
        <span>${likes}</span>
      </div>
      <div class="tt-side-action">
        <i class="ti ti-message-circle"></i>
        <span>${cmts}</span>
      </div>
      <div class="tt-side-action">
        <i class="ti ti-share"></i>
        <span>${Utils.formatNum(state.shares)}</span>
      </div>
      <div class="tt-side-action">
        <i class="ti ti-music"></i>
      </div>
    </div>
  </div>
  <div class="tt-progress"><div class="tt-progress-fill"></div></div>
</div>`;
  }

  /* ─────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────── */

  function render(theme, state) {
    switch (theme) {
      case 'instagram': return instagram(state);
      case 'twitter':   return twitter(state);
      case 'facebook':  return facebook(state);
      case 'tiktok':    return tiktok(state);
      default:          return instagram(state);
    }
  }

  return { render };
})();
