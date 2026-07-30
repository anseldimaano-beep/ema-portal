(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('announcement_form');
    if (!form) return; // safety: only run on the Announcement add/change page

    injectHeader();
    autoGrowTextarea();
    tagPriorityColor();
    setupImagePreview();
    relabelPostButton();
    addPlaceholders();

    // ---- helpers ----

    function injectHeader() {
      var contentMain = document.getElementById('content-main');
      if (!contentMain || contentMain.querySelector('.fb-composer-header')) return;

      var userToolsStrong = document.querySelector('#user-tools strong');
      var name = userToolsStrong ? userToolsStrong.textContent.trim() : 'Admin';
      var initials = name
        .split(/\s+/)
        .map(function (w) { return w.charAt(0).toUpperCase(); })
        .slice(0, 2)
        .join('') || 'A';

      var isPublishedCheckbox = document.getElementById('id_is_published');
      var audience = isPublishedCheckbox && isPublishedCheckbox.checked
        ? 'Public announcement'
        : 'Draft (not visible yet)';

      var header = document.createElement('div');
      header.className = 'fb-composer-header';
      header.innerHTML =
        '<div class="fb-composer-avatar">' + initials + '</div>' +
        '<div class="fb-composer-who">' +
        '<span class="fb-composer-name">' + name + '</span>' +
        '<span class="fb-composer-audience" id="fb-audience-label">' + audience + '</span>' +
        '</div>';

      var formInner = form.querySelector('div');
      if (formInner) {
        formInner.insertBefore(header, formInner.firstChild);
      }

      if (isPublishedCheckbox) {
        isPublishedCheckbox.addEventListener('change', function () {
          var label = document.getElementById('fb-audience-label');
          if (label) {
            label.textContent = isPublishedCheckbox.checked
              ? 'Public announcement'
              : 'Draft (not visible yet)';
          }
        });
      }
    }

    function autoGrowTextarea() {
      var textarea = document.getElementById('id_content');
      if (!textarea) return;
      var grow = function () {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(130, textarea.scrollHeight) + 'px';
      };
      textarea.addEventListener('input', grow);
      grow();
    }

    function tagPriorityColor() {
      var select = document.getElementById('id_priority');
      if (!select) return;
      var apply = function () { select.setAttribute('data-priority', select.value); };
      select.addEventListener('change', apply);
      apply();
    }

    function setupImagePreview() {
      var input = document.getElementById('id_featured_image');
      if (!input) return;

      var wrapper = input.closest('.flex-container') || input.parentElement;
      var img = document.createElement('img');
      img.className = 'fb-image-preview';
      wrapper.appendChild(img);

      // Show existing image (change form) right away if present.
      var existingLink = wrapper.parentElement && wrapper.parentElement.querySelector('a[href*="/media/"]');
      if (existingLink && existingLink.href) {
        img.src = existingLink.href;
        img.style.display = 'block';
      }

      input.addEventListener('change', function () {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            img.src = e.target.result;
            img.style.display = 'block';
          };
          reader.readAsDataURL(input.files[0]);
        }
      });
    }

    function relabelPostButton() {
      var saveBtn = form.querySelector('input[name="_save"]');
      if (!saveBtn) return;
      var isAdd = window.location.pathname.indexOf('/add/') !== -1;
      saveBtn.value = isAdd ? 'Post' : 'Save changes';
    }

    function addPlaceholders() {
      var title = document.getElementById('id_title');
      if (title && !title.placeholder) title.placeholder = 'Announcement title\u2026';

      var content = document.getElementById('id_content');
      if (content && !content.placeholder) content.placeholder = 'What do you want to announce?';

      var excerpt = document.getElementById('id_excerpt');
      if (excerpt && !excerpt.placeholder) excerpt.placeholder = 'Short summary (optional \u2014 auto-generated if left blank)';
    }
  });
})();
