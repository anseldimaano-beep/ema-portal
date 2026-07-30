/* Facebook-style post composer skin for the Announcement admin form — dark theme.
   Scoped entirely to body.model-announcement so no other admin page is affected. */

body.model-announcement #content-main {
  background: #18191a;
  padding: 24px 16px 80px;
}

body.model-announcement .breadcrumbs {
  max-width: 640px;
  margin: 0 auto 12px;
  background: transparent !important;
  padding-left: 0;
}

body.model-announcement .object-tools {
  max-width: 640px;
  margin: 0 auto 8px;
}

/* ---- Card shell ---- */
body.model-announcement #announcement_form {
  max-width: 640px;
  margin: 0 auto;
  background: #242526;
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(0,0,0,.4), 0 4px 16px rgba(0,0,0,.4);
  padding: 18px 20px 16px;
  color: #e4e6eb;
  color-scheme: dark; /* keep native controls (date picker, dropdown arrows) dark too */
}

body.model-announcement #announcement_form > div {
  max-width: none;
}

body.model-announcement .errornote {
  border-radius: 8px;
}

/* Blanket reset: every field in this form gets the same dark background + light
   text, regardless of the admin's light/dark theme setting. More specific rules
   further down (Title, Content, Category/Priority pills, etc.) refine this. */
body.model-announcement .field-title input[type="text"],
body.model-announcement .field-slug input[type="text"],
body.model-announcement .field-content textarea,
body.model-announcement .field-excerpt input,
body.model-announcement .field-excerpt textarea,
body.model-announcement .field-category select,
body.model-announcement .field-priority select,
body.model-announcement .field-author select,
body.model-announcement .field-video_url input,
body.model-announcement .field-published_at input,
body.model-announcement .field-expires_at input {
  background-color: #3a3b3c;
  color: #e4e6eb;
  border: 1px solid #3e4042;
  border-radius: 6px;
}

/* ---- Composer header (injected by JS): avatar + "posting as" ---- */
.fb-composer-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  margin-bottom: 8px;
  border-bottom: 1px solid #3e4042;
}
.fb-composer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2374e1;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}
.fb-composer-who {
  display: flex;
  flex-direction: column;
}
.fb-composer-name {
  font-weight: 600;
  font-size: 15px;
  color: #e4e6eb;
}
.fb-composer-audience {
  font-size: 12px;
  color: #b0b3b8;
}

/* ---- Kill the default Django fieldset chrome ---- */
body.model-announcement fieldset.module {
  border: none;
  margin: 0;
  padding: 0;
}
body.model-announcement fieldset.module.aligned .form-row {
  border: none;
  padding: 8px 0;
}
body.model-announcement .fieldset-heading {
  display: none;
}

/* Media fieldset is rendered as <details><summary> because of classes=('collapse',) */
body.model-announcement fieldset.collapse {
  border-top: 1px solid #3e4042;
  border-bottom: 1px solid #3e4042;
  margin: 10px 0;
  padding: 4px 0;
}
body.model-announcement fieldset.collapse summary {
  list-style: none;
  cursor: pointer;
  padding: 8px 4px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  background: transparent !important;
  border: none !important;
  color: #e4e6eb !important;
}
body.model-announcement fieldset.collapse summary::before {
  content: "📎 Add photo, video, or attachment";
}
body.model-announcement fieldset.collapse summary:hover {
  background: #3a3b3c !important;
}
body.model-announcement fieldset.collapse summary::-webkit-details-marker {
  display: none;
}

/* ---- Title field: big bold "headline" input ---- */
body.model-announcement .field-title label {
  font-size: 12px;
  color: #b0b3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .02em;
}
body.model-announcement .field-title input[type="text"] {
  width: 100%;
  border: none !important;
  border-bottom: 2px solid #3e4042 !important;
  border-radius: 0;
  background: transparent !important;
  font-size: 20px;
  font-weight: 700;
  padding: 8px 4px;
  color: #e4e6eb;
}
body.model-announcement .field-title input[type="text"]:focus {
  border-bottom-color: #2374e1 !important;
  outline: none;
}

/* ---- Content field: the big "what's on your mind" box ---- */
body.model-announcement .field-content label {
  display: none;
}
body.model-announcement .field-content textarea {
  width: 100%;
  min-height: 130px;
  border: none !important;
  background: transparent !important;
  resize: none;
  font-size: 16px;
  line-height: 1.4;
  padding: 10px 4px;
  font-family: inherit;
}
body.model-announcement .field-content textarea:focus {
  outline: none;
}
body.model-announcement .field-content textarea::placeholder {
  color: #8a8d91;
}

/* ---- Excerpt: demote to a small optional helper ---- */
body.model-announcement .field-excerpt {
  background: #3a3b3c;
  border-radius: 8px;
  padding: 6px 10px !important;
}
body.model-announcement .field-excerpt label {
  font-size: 11px;
  color: #b0b3b8;
  font-weight: 600;
}
body.model-announcement .field-excerpt textarea,
body.model-announcement .field-excerpt input {
  width: 100%;
  border: none !important;
  background: transparent !important;
  font-size: 13px;
  color: #d3d5d8;
}

/* ---- Category / Priority: side-by-side pill selects ---- */
body.model-announcement .field-category,
body.model-announcement .field-priority {
  display: inline-block;
  width: 48%;
  vertical-align: top;
  box-sizing: border-box;
  padding-right: 8px !important;
}
body.model-announcement .field-category label,
body.model-announcement .field-priority label {
  display: block;
  font-size: 11px;
  color: #b0b3b8;
  font-weight: 600;
  margin-bottom: 2px;
}
body.model-announcement .field-category select,
body.model-announcement .field-priority select {
  width: 100%;
  border-radius: 999px;
  border: 1px solid #3e4042;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  background: #3a3b3c;
  color: #e4e6eb;
  cursor: pointer;
}

/* Priority color accents, toggled via JS data-priority attribute on the select */
body.model-announcement select[data-priority="low"] { background:#3a3b3c; border-color:#4e4f50; color:#b0b3b8; }
body.model-announcement select[data-priority="normal"] { background:#1a3a5c; border-color:#2374e1; color:#8bb9f5; }
body.model-announcement select[data-priority="high"] { background:#4d3a12; border-color:#e08600; color:#f0b95a; }
body.model-announcement select[data-priority="urgent"] { background:#4c1f1f; border-color:#d9534f; color:#f28b8b; }

/* ---- Media fields (image / attachment / video url) ---- */
body.model-announcement .field-featured_image,
body.model-announcement .field-attachment,
body.model-announcement .field-video_url,
body.model-announcement .field-video_file {
  padding: 6px 0 !important;
}
body.model-announcement .field-featured_image label,
body.model-announcement .field-attachment label,
body.model-announcement .field-video_url label,
body.model-announcement .field-video_file label {
  font-size: 12px;
  color: #b0b3b8;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}
body.model-announcement .field-video_url input[type="url"],
body.model-announcement .field-video_url input[type="text"] {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #3e4042 !important;
  background: #3a3b3c !important;
  padding: 8px 10px;
}
body.model-announcement .field-featured_image a,
body.model-announcement .field-attachment a,
body.model-announcement .field-video_url a,
body.model-announcement .field-featured_image p,
body.model-announcement .field-attachment p {
  color: #8bb9f5;
}
body.model-announcement .fb-image-preview {
  margin-top: 8px;
  max-width: 100%;
  max-height: 220px;
  border-radius: 10px;
  display: none;
  object-fit: cover;
}
body.model-announcement .fb-video-preview {
  margin-top: 8px;
  max-width: 100%;
  max-height: 220px;
  border-radius: 10px;
  display: none;
  background: #000;
}
body.model-announcement .readonly .fb-video-note {
  font-size: 12px;
  color: #b0b3b8;
}

/* ---- Publishing fieldset: toggle switches for booleans ---- */
body.model-announcement .field-is_published,
body.model-announcement .field-is_pinned {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 48%;
}
body.model-announcement .checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
body.model-announcement .field-is_published input[type="checkbox"],
body.model-announcement .field-is_pinned input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: #4e4f50;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: background .15s ease;
  flex-shrink: 0;
}
body.model-announcement .field-is_published input[type="checkbox"]::before,
body.model-announcement .field-is_pinned input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e4e6eb;
  transition: transform .15s ease;
}
body.model-announcement .field-is_published input[type="checkbox"]:checked,
body.model-announcement .field-is_pinned input[type="checkbox"]:checked {
  background: #2374e1;
}
body.model-announcement .field-is_published input[type="checkbox"]:checked::before,
body.model-announcement .field-is_pinned input[type="checkbox"]:checked::before {
  transform: translateX(16px);
}
body.model-announcement .field-is_published label,
body.model-announcement .field-is_pinned label {
  font-size: 13px;
  font-weight: 600;
  color: #e4e6eb;
}

body.model-announcement .field-published_at,
body.model-announcement .field-expires_at,
body.model-announcement .field-author {
  padding: 6px 0 !important;
}
body.model-announcement .field-published_at label,
body.model-announcement .field-expires_at label,
body.model-announcement .field-author label {
  font-size: 12px;
  color: #b0b3b8;
  font-weight: 600;
}

/* ---- Submit row -> big "Post" button ---- */
body.model-announcement .submit-row {
  max-width: 640px;
  margin: 12px auto 0;
  background: transparent;
  border: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 0;
}
body.model-announcement .submit-row input[name="_save"] {
  background: #2374e1;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  padding: 10px 28px;
}
body.model-announcement .submit-row input[name="_save"]:hover {
  background: #1b5bb0;
}
/* Keep these available but visually secondary/small, instead of removing them */
body.model-announcement .submit-row input[name="_addanother"],
body.model-announcement .submit-row input[name="_saveasnew"],
body.model-announcement .submit-row input[name="_continue"] {
  background: transparent;
  color: #b0b3b8;
  border: 1px solid #3e4042;
  border-radius: 8px;
  font-size: 12px;
  padding: 8px 12px;
}
body.model-announcement .submit-row .deletelink {
  margin-right: auto;
  color: #f28b8b;
  font-size: 12px;
}
