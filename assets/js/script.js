'use strict';

document.addEventListener('DOMContentLoaded', function () {

  // =====================================================
  // COMMON ELEMENT TOGGLE
  // =====================================================

  const elementToggleFunc = function (element) {
    if (element) {
      element.classList.toggle('active');
    }
  };


  // =====================================================
  // SIDEBAR
  // =====================================================

  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');

  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener('click', function () {
      elementToggleFunc(sidebar);
    });
  }


  // =====================================================
  // SERVICES AND TESTIMONIAL MODAL
  // =====================================================

  const modalItems = document.querySelectorAll(
    '[data-testimonials-item], [data-service-item]'
  );

  const modalContainer = document.querySelector('[data-modal-container]');
  const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
  const overlay = document.querySelector('[data-overlay]');

  const modalImg = document.querySelector('[data-modal-img]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalText = document.querySelector('[data-modal-text]');

  const openModal = function () {
    if (!modalContainer || !overlay) {
      return;
    }

    modalContainer.classList.add('active');
    overlay.classList.add('active');

    document.body.style.overflow = 'hidden';
  };

  const closeModal = function () {
    if (!modalContainer || !overlay) {
      return;
    }

    modalContainer.classList.remove('active');
    overlay.classList.remove('active');

    document.body.style.overflow = '';
  };

  modalItems.forEach(function (item) {
    item.addEventListener('click', function () {

      const avatar =
        this.querySelector('[data-testimonials-avatar]') ||
        this.querySelector('[data-service-avatar]');

      const title =
        this.querySelector('[data-testimonials-title]') ||
        this.querySelector('[data-service-title]');

      const text =
        this.querySelector('[data-testimonials-text]') ||
        this.querySelector('[data-service-text]');

      if (avatar && modalImg) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt || '';
      }

      if (title && modalTitle) {
        modalTitle.innerHTML = title.innerHTML;
      }

      if (text && modalText) {
        modalText.innerHTML = text.innerHTML;
      }

      openModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }

  // Close modal using Escape key
  document.addEventListener('keydown', function (event) {
    if (
      event.key === 'Escape' &&
      modalContainer &&
      modalContainer.classList.contains('active')
    ) {
      closeModal();
    }
  });


  // =====================================================
  // PORTFOLIO FILTER
  // =====================================================

  const select = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-selecct-value]');
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  const filterItems = document.querySelectorAll('[data-filter-item]');

  const normalizeValue = function (value) {
    return value.trim().toLowerCase();
  };

  const filterFunc = function (selectedValue) {
    const normalizedSelectedValue = normalizeValue(selectedValue);

    filterItems.forEach(function (item) {
      const itemCategory = normalizeValue(item.dataset.category || '');

      if (
        normalizedSelectedValue === 'all' ||
        normalizedSelectedValue === itemCategory
      ) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  };

  if (select) {
    select.addEventListener('click', function (event) {
      event.stopPropagation();
      elementToggleFunc(this);
    });
  }

  selectItems.forEach(function (item) {
    item.addEventListener('click', function (event) {
      event.stopPropagation();

      const selectedValue = normalizeValue(this.textContent);

      if (selectValue) {
        selectValue.textContent = this.textContent.trim();
      }

      if (select) {
        select.classList.remove('active');
      }

      filterFunc(selectedValue);
    });
  });

  let lastClickedBtn =
    document.querySelector('[data-filter-btn].active') ||
    filterButtons[0] ||
    null;

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const selectedValue = normalizeValue(this.textContent);

      if (selectValue) {
        selectValue.textContent = this.textContent.trim();
      }

      filterFunc(selectedValue);

      if (lastClickedBtn) {
        lastClickedBtn.classList.remove('active');
      }

      this.classList.add('active');
      lastClickedBtn = this;
    });
  });

  // Close mobile select when clicking outside
  document.addEventListener('click', function (event) {
    if (select && !select.contains(event.target)) {
      select.classList.remove('active');
    }
  });


  // =====================================================
  // CONTACT FORM VALIDATION AND WEB3FORMS SUBMISSION
  // =====================================================

  const form = document.querySelector('[data-form]');
  const formInputs = document.querySelectorAll('[data-form-input]');
  const formBtn = document.querySelector('[data-form-btn]');
  const toast = document.getElementById('toast-success');

  const updateSubmitButton = function () {
    if (!form || !formBtn) {
      return;
    }

    formBtn.disabled = !form.checkValidity();
  };

  formInputs.forEach(function (input) {
    input.addEventListener('input', updateSubmitButton);
    input.addEventListener('change', updateSubmitButton);
  });

  updateSubmitButton();

  const showToast = function (message, type = 'success') {
    if (!toast) {
      return;
    }

    const toastMessage = toast.querySelector('span');
    const toastIcon = toast.querySelector('ion-icon');

    if (toastMessage) {
      toastMessage.textContent = message;
    }

    toast.classList.remove('success', 'error');
    toast.classList.add(type);

    if (toastIcon) {
      toastIcon.setAttribute(
        'name',
        type === 'success'
          ? 'checkmark-circle'
          : 'alert-circle'
      );
    }

    toast.classList.add('show');

    window.setTimeout(function () {
      toast.classList.remove('show');
    }, 3500);
  };

  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!formBtn) {
        return;
      }

      const originalButtonContent = formBtn.innerHTML;

      formBtn.disabled = true;
      formBtn.innerHTML = `
        <ion-icon name="hourglass-outline"></ion-icon>
        <span>Sending...</span>
      `;

      try {
        const formData = new FormData(form);

        const response = await fetch(form.action, {
          method: form.method || 'POST',
          body: formData,
          headers: {
            Accept: 'application/json'
          }
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(
            result.message || 'Unable to send the message.'
          );
        }

        showToast('Message sent successfully!', 'success');

        form.reset();
        updateSubmitButton();

      } catch (error) {
        console.error('Contact form error:', error);

        showToast(
          'Message could not be sent. Please try again.',
          'error'
        );

      } finally {
        formBtn.innerHTML = originalButtonContent;
        updateSubmitButton();
      }
    });
  }


  // =====================================================
  // PAGE NAVIGATION
  // =====================================================

  const navigationLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');

  navigationLinks.forEach(function (navigationLink) {
    navigationLink.addEventListener('click', function () {
      const selectedPage = normalizeValue(this.textContent);

      pages.forEach(function (page) {
        const pageName = normalizeValue(page.dataset.page || '');

        if (selectedPage === pageName) {
          page.classList.add('active');
        } else {
          page.classList.remove('active');
        }
      });

      navigationLinks.forEach(function (link) {
        const linkPage = normalizeValue(link.textContent);

        if (selectedPage === linkPage) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });


  // =====================================================
  // FLOATING RESUME BUTTON
  // =====================================================

  const resumeButton = document.querySelector('.resume-float');

  if (resumeButton) {
    let lastScrollPosition = window.scrollY;
    let scrollTicking = false;
    const scrollThreshold = 8;

    const handleResumeButtonScroll = function () {
      const currentScrollPosition = window.scrollY;
      const scrollDifference =
        currentScrollPosition - lastScrollPosition;

      if (Math.abs(scrollDifference) < scrollThreshold) {
        scrollTicking = false;
        return;
      }

      if (scrollDifference > 0 && currentScrollPosition > 100) {
        // Scrolling down
        resumeButton.style.transform =
          'translateY(-50%) translateX(115px)';
      } else {
        // Scrolling up
        resumeButton.style.transform =
          'translateY(-50%) translateX(0)';
      }

      lastScrollPosition = currentScrollPosition;
      scrollTicking = false;
    };

    window.addEventListener(
      'scroll',
      function () {
        if (!scrollTicking) {
          window.requestAnimationFrame(handleResumeButtonScroll);
          scrollTicking = true;
        }
      },
      { passive: true }
    );
  }

});