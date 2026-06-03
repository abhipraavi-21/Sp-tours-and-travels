const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');
const siteHeader = document.querySelector('.site-header');
const tabs = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.booking-form');
const slides = document.querySelectorAll('.slide');
const testimonialSliders = document.querySelectorAll('[data-testimonial-slider]');
const bookingShortcuts = document.querySelectorAll('[data-booking-target]');
const whatsappFormButtons = document.querySelectorAll('[data-whatsapp-form]');
const citySelectionButtons = document.querySelectorAll('[data-city-select]');
const bookingCityFields = document.querySelectorAll('[data-city-field="booking"]');
const corporateFormButtons = document.querySelectorAll('[data-corporate-form]');
const mobileBottomNavLinks = document.querySelectorAll('[data-mobile-nav]');
const mobileEnquiryMenus = document.querySelectorAll('[data-mobile-enquiry]');
const floatingContactGroup = document.querySelector('.floating-contact-group');
const bookingCard = document.querySelector('.booking-card');
const heroSection = document.querySelector('.hero, .page-hero');
const yearEl = document.getElementById('year');
const whatsappNumber = '919764642921';
const whatsappLinks = document.querySelectorAll('a[href*="wa.me/"], a[href*="api.whatsapp.com/send"]');
const corporateEmail = 'astravelsolution600@gmail.com';
const compactNavViewport = window.matchMedia('(max-width: 980px)');
const packageDetailMediaCards = document.querySelectorAll('.package-detail-media');
const packageDetailMediaViewport = window.matchMedia('(max-width: 720px)');
const defaultWhatsAppMessage = [
  'Hello Sp Tours and Travels,',
  '',
  'I would like to enquire about your cab and tour package services.',
  'Please share the available options, pricing, and booking details.',
  '',
  'Thank you.',
].join('\n');
const isEmbeddedPackagePage =
  body.classList.contains('package-detail-page') &&
  new URLSearchParams(window.location.search).get('embedded') === '1';
const getVisibleEmbeddedPackageHeight = (rootDocument = document) => {
  if (!rootDocument?.querySelector) return 0;

  const activeCard =
    rootDocument.querySelector('.package-detail-card.is-active') ||
    rootDocument.querySelector('.package-detail-card');

  if (!activeCard) return 0;

  const rootWindow = rootDocument.defaultView;
  const getDocumentTop = (element) => {
    const elementRect = element.getBoundingClientRect();
    const scrollTop =
      rootWindow?.scrollY ??
      rootDocument.documentElement?.scrollTop ??
      rootDocument.body?.scrollTop ??
      0;

    return elementRect.top + scrollTop;
  };

  const activeTop = getDocumentTop(activeCard);
  const visibleBottom = activeTop + activeCard.getBoundingClientRect().height;

  return Math.max(0, Math.ceil(visibleBottom - activeTop + 8));
};
const revealSelectors = [
  '.hero-content',
  '.hero-panel',
  '.booking-card',
  '.section-heading',
  '.service-card',
  '.offer-card',
  '.destination-card',
  '.specialization-list span, .specialization-list a',
  '.testimonial-slider',
  '.stats-grid > div',
  '.coverage-list span',
  '.city-list span',
  '.intro-card',
  '.highlight-card',
  '.step-card',
  '.route-card',
  '.info-card',
  '.form-card',
  '.map-card',
  '.city-option',
  '.package-overview-card',
  '.package-detail-card',
  '.package-note-card',
  '.package-faq-card',
];

if (isEmbeddedPackagePage) {
  body.classList.add('is-embedded');
}

const notifyEmbeddedPackageHeight = () => {
  if (!isEmbeddedPackagePage || window.parent === window) return;

  const height =
    getVisibleEmbeddedPackageHeight(document) ||
    Math.max(
      document.documentElement?.scrollHeight || 0,
      document.body?.scrollHeight || 0,
      document.documentElement?.offsetHeight || 0,
      document.body?.offsetHeight || 0
    );

  window.parent.postMessage(
    {
      type: 'as-package-embed-height',
      height,
      hash: window.location.hash.replace('#', ''),
    },
    '*'
  );
};

if (isEmbeddedPackagePage) {
  window.addEventListener('load', () => {
    requestAnimationFrame(notifyEmbeddedPackageHeight);
  });

  window.addEventListener('resize', () => {
    requestAnimationFrame(notifyEmbeddedPackageHeight);
  });
}

if (packageDetailMediaCards.length) {
  const packageMediaSliderStates = [];
  let packageMediaSliderTimer = 0;

  const setActivePackageMediaSlide = (sliderState, nextIndex) => {
    if (!sliderState.slides.length) return;

    const normalizedIndex =
      ((nextIndex % sliderState.slides.length) + sliderState.slides.length) % sliderState.slides.length;

    sliderState.activeIndex = normalizedIndex;

    sliderState.slides.forEach((slide, index) => {
      const isActive = index === normalizedIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    sliderState.dots.forEach((dot, index) => {
      const isActive = index === normalizedIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  };

  const isPackageMediaSliderVisible = (sliderState) => {
    const card = sliderState.media.closest('.package-detail-card');

    if (!packageDetailMediaViewport.matches || document.hidden) return false;
    if (!sliderState.media.isConnected || sliderState.media.getClientRects().length === 0) return false;
    if (card && window.getComputedStyle(card).display === 'none') return false;

    return true;
  };

  const stopPackageMediaSliderTimer = () => {
    if (!packageMediaSliderTimer) return;

    window.clearInterval(packageMediaSliderTimer);
    packageMediaSliderTimer = 0;
  };

  const startPackageMediaSliderTimer = () => {
    if (packageMediaSliderTimer || !packageDetailMediaViewport.matches || !packageMediaSliderStates.length) {
      return;
    }

    packageMediaSliderTimer = window.setInterval(() => {
      packageMediaSliderStates.forEach((sliderState) => {
        if (!isPackageMediaSliderVisible(sliderState) || sliderState.slides.length < 2) return;

        setActivePackageMediaSlide(sliderState, sliderState.activeIndex + 1);
      });
    }, 3200);
  };

  const syncPackageMediaSliderTimer = () => {
    if (!packageDetailMediaViewport.matches) {
      stopPackageMediaSliderTimer();
      packageMediaSliderStates.forEach((sliderState) => {
        setActivePackageMediaSlide(sliderState, 0);
      });
      return;
    }

    startPackageMediaSliderTimer();
  };

  // Reuse each card's existing three-image gallery as a mobile-only slider.
  packageDetailMediaCards.forEach((media, mediaIndex) => {
    const sourceImages = Array.from(media.querySelectorAll('.package-media-frame img, .package-media-thumb img'));

    if (sourceImages.length < 2) return;

    const slider = document.createElement('div');
    slider.className = 'package-media-mobile-slider';
    slider.setAttribute('role', 'group');
    slider.setAttribute('aria-label', `Package photo gallery ${mediaIndex + 1}`);

    const track = document.createElement('div');
    track.className = 'package-media-mobile-track';

    const dots = document.createElement('div');
    dots.className = 'package-media-mobile-dots';
    dots.setAttribute('aria-label', 'Package photo navigation');

    const sliderState = {
      activeIndex: 0,
      dots: [],
      media,
      slides: [],
    };

    sourceImages.forEach((image, imageIndex) => {
      const slide = document.createElement('div');
      slide.className = 'package-media-mobile-slide';

      const slideImage = image.cloneNode(true);
      const imageStyles = window.getComputedStyle(image);

      slideImage.style.objectFit = imageStyles.objectFit;
      slideImage.style.objectPosition = imageStyles.objectPosition;

      slide.append(slideImage);
      track.append(slide);
      sliderState.slides.push(slide);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'package-media-mobile-dot';
      dot.setAttribute('aria-label', `Show photo ${imageIndex + 1}`);
      dot.addEventListener('click', () => {
        setActivePackageMediaSlide(sliderState, imageIndex);
        startPackageMediaSliderTimer();
      });

      dots.append(dot);
      sliderState.dots.push(dot);
    });

    slider.append(track);

    if (sliderState.dots.length > 1) {
      slider.append(dots);
    }

    media.prepend(slider);
    media.classList.add('has-mobile-slider');
    packageMediaSliderStates.push(sliderState);
    setActivePackageMediaSlide(sliderState, 0);
  });

  if (packageMediaSliderStates.length) {
    syncPackageMediaSliderTimer();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopPackageMediaSliderTimer();
        return;
      }

      syncPackageMediaSliderTimer();
    });

    const handlePackageMediaViewportChange = () => {
      syncPackageMediaSliderTimer();
    };

    if (typeof packageDetailMediaViewport.addEventListener === 'function') {
      packageDetailMediaViewport.addEventListener('change', handlePackageMediaViewportChange);
    } else if (typeof packageDetailMediaViewport.addListener === 'function') {
      packageDetailMediaViewport.addListener(handlePackageMediaViewportChange);
    }
  }
}

const setNavOpen = (isOpen) => {
  body.classList.toggle('nav-open', Boolean(isOpen));

  if (navToggle) {
    navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  }
};

if (navToggle && primaryNav) {
  setNavOpen(false);

  navToggle.addEventListener('click', () => {
    if (!compactNavViewport.matches) return;

    setNavOpen(!body.classList.contains('nav-open'));
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (compactNavViewport.matches) {
        setNavOpen(false);
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!compactNavViewport.matches || !body.classList.contains('nav-open')) return;
    if (!(event.target instanceof Element)) return;
    if (siteHeader && siteHeader.contains(event.target)) return;

    setNavOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !body.classList.contains('nav-open')) return;

    setNavOpen(false);
    navToggle.focus();
  });

  const handleNavViewportChange = () => {
    if (!compactNavViewport.matches) {
      setNavOpen(false);
    }
  };

  if (typeof compactNavViewport.addEventListener === 'function') {
    compactNavViewport.addEventListener('change', handleNavViewportChange);
  } else if (typeof compactNavViewport.addListener === 'function') {
    compactNavViewport.addListener(handleNavViewportChange);
  }
}

if (mobileBottomNavLinks.length) {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const mobileNavMap = {
    '': 'home',
    'index.html': 'home',
    'about.html': 'home',
    'services.html': 'services',
    'packages.html': 'services',
    'package-details.html': 'services',
    'destinations.html': 'explore',
    'contact.html': 'contact',
  };
  const activeNav = mobileNavMap[currentPage];

  mobileBottomNavLinks.forEach((link) => {
    const isActive = activeNav && link.dataset.mobileNav === activeNav;
    link.classList.toggle('is-active', Boolean(isActive));
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

if (mobileEnquiryMenus.length) {
  const touchViewport = window.matchMedia('(max-width: 1100px)');
  const hoverViewport = window.matchMedia('(hover: hover) and (pointer: fine)');

  const setMobileEnquiryState = (menu, isOpen) => {
    const trigger = menu.querySelector('[data-mobile-enquiry-trigger]');
    if (!trigger) return;

    menu.classList.toggle('is-open', isOpen);
    trigger.setAttribute('aria-expanded', String(isOpen));
  };

  const closeAllMobileEnquiryMenus = (exceptMenu = null) => {
    mobileEnquiryMenus.forEach((menu) => {
      if (menu === exceptMenu) return;
      setMobileEnquiryState(menu, false);
    });
  };

  mobileEnquiryMenus.forEach((menu) => {
    const trigger = menu.querySelector('[data-mobile-enquiry-trigger]');
    if (!trigger) return;

    setMobileEnquiryState(menu, false);

    trigger.addEventListener('click', (event) => {
      event.preventDefault();

      if (!touchViewport.matches) return;

      const shouldOpen = !menu.classList.contains('is-open');
      closeAllMobileEnquiryMenus(menu);
      setMobileEnquiryState(menu, shouldOpen);
    });

    menu.querySelectorAll('.mobile-bottom-nav-action').forEach((action) => {
      action.addEventListener('click', () => {
        setMobileEnquiryState(menu, false);
      });
    });

    menu.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;

      setMobileEnquiryState(menu, false);
      trigger.focus();
    });

    menu.addEventListener('mouseleave', () => {
      if (hoverViewport.matches) {
        setMobileEnquiryState(menu, false);
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      closeAllMobileEnquiryMenus();
      return;
    }

    const activeMenu = event.target.closest('[data-mobile-enquiry]');
    closeAllMobileEnquiryMenus(activeMenu);
  });

  document.addEventListener('focusin', (event) => {
    if (!(event.target instanceof Element)) {
      closeAllMobileEnquiryMenus();
      return;
    }

    const activeMenu = event.target.closest('[data-mobile-enquiry]');
    closeAllMobileEnquiryMenus(activeMenu);
  });

  const handleMobileEnquiryViewportChange = () => {
    if (!touchViewport.matches) {
      closeAllMobileEnquiryMenus();
    }
  };

  if (typeof touchViewport.addEventListener === 'function') {
    touchViewport.addEventListener('change', handleMobileEnquiryViewportChange);
  } else if (typeof touchViewport.addListener === 'function') {
    touchViewport.addListener(handleMobileEnquiryViewportChange);
  }
}

if (floatingContactGroup) {
  let bookingCardInView = false;
  let heroSectionInView = false;

  const syncFloatingContacts = () => {
    floatingContactGroup.classList.toggle('is-hidden', bookingCardInView || heroSectionInView);
  };

  const isElementInViewport = (element) => {
    if (!element) return false;

    const elementBounds = element.getBoundingClientRect();

    return elementBounds.top < window.innerHeight && elementBounds.bottom > 0;
  };

  const setInitialFloatingContactsState = () => {
    bookingCardInView = isElementInViewport(bookingCard);
    heroSectionInView = isElementInViewport(heroSection);
    syncFloatingContacts();
  };

  setInitialFloatingContactsState();

  if ('IntersectionObserver' in window) {
    const floatingContactObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === bookingCard) {
            bookingCardInView = entry.isIntersecting;
          }

          if (entry.target === heroSection) {
            heroSectionInView = entry.isIntersecting;
          }

          syncFloatingContacts();
        });
      },
      {
        threshold: 0.15,
      }
    );

    if (bookingCard) {
      floatingContactObserver.observe(bookingCard);
    }

    if (heroSection) {
      floatingContactObserver.observe(heroSection);
    }
  }

  const handleFloatingContactsViewportChange = () => {
    setInitialFloatingContactsState();
  };

  window.addEventListener('resize', handleFloatingContactsViewportChange);
}

const setActiveBookingTab = (target) => {
  if (!target) return;

  tabs.forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.tab === target);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.tabPanel === target);
  });
};

const buildWhatsAppUrl = (message) => {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const buildProfessionalWhatsAppMessage = (intro, followUp) => {
  return [
    'Hello Sp Tours and Travels,',
    '',
    intro,
    followUp,
    '',
    'Thank you.',
  ].join('\n');
};

const upgradeWhatsAppMessage = (message = '') => {
  const normalizedMessage = message.trim().replace(/\s+/g, ' ');

  if (!normalizedMessage) {
    return defaultWhatsAppMessage;
  }

  if (/^Hello, I want to book a cab with Sp Tours and Travels\.?$/i.test(normalizedMessage)) {
    return buildProfessionalWhatsAppMessage(
      'I would like to book a cab service.',
      'Please share the available vehicle options, fare, and booking details.'
    );
  }

  if (
    /^Hello, I have a cab service enquiry for Sp Tours and Travels\.?$/i.test(normalizedMessage) ||
    /^Hello, I have a service enquiry for Sp Tours and Travels\.?$/i.test(normalizedMessage)
  ) {
    return buildProfessionalWhatsAppMessage(
      'I would like to enquire about your cab services.',
      'Please share the available options, pricing, and booking details.'
    );
  }

  if (/^Hello, I need a service quote from Sp Tours and Travels\.?$/i.test(normalizedMessage)) {
    return buildProfessionalWhatsAppMessage(
      'I would like to request a quotation for your cab services.',
      'Please share the fare, available vehicle options, and booking details.'
    );
  }

  if (/^Hello, I need help choosing the right tour package\.?$/i.test(normalizedMessage)) {
    return buildProfessionalWhatsAppMessage(
      'I need help selecting the right tour package.',
      'Please suggest suitable package options, pricing, and inclusions.'
    );
  }

  if (/^Hello, I want a quote for a tour package from Pune\.?$/i.test(normalizedMessage)) {
    return buildProfessionalWhatsAppMessage(
      'I would like to request a quotation for a tour package from Pune.',
      'Please share the itinerary options, package pricing, and vehicle details.'
    );
  }

  if (/^Hello, I want to book a tour package with Sp Tours and Travels\.?$/i.test(normalizedMessage)) {
    return buildProfessionalWhatsAppMessage(
      'I would like to enquire about booking a tour package.',
      'Please share the available package options, pricing, and inclusions.'
    );
  }

  const detailsMatch = normalizedMessage.match(/^Hello, I want details for the (.+)\.?$/i);
  if (detailsMatch) {
    return buildProfessionalWhatsAppMessage(
      `I would like more details about the ${detailsMatch[1]}.`,
      'Please share the fare, vehicle options, itinerary, and availability.'
    );
  }

  const destinationEnquiryMatch = normalizedMessage.match(/^Hello, I want to enquire about a cab for (.+)\.?$/i);
  if (destinationEnquiryMatch) {
    return buildProfessionalWhatsAppMessage(
      `I would like to enquire about cab service for ${destinationEnquiryMatch[1]}.`,
      'Please share the fare, vehicle options, and availability from Pune.'
    );
  }

  const bookingMatch = normalizedMessage.match(/^Hello, I want to book (?:(?:a|an)\s+)?(.+)\.?$/i);
  if (bookingMatch) {
    return buildProfessionalWhatsAppMessage(
      `I would like to book ${bookingMatch[1]}.`,
      'Please share the fare, availability, and booking process.'
    );
  }

  return message;
};

const normalizeWhatsAppHref = (href) => {
  try {
    const url = new URL(href, window.location.href);
    const message = upgradeWhatsAppMessage(url.searchParams.get('text') || defaultWhatsAppMessage);
    const normalizedUrl = new URL(`https://wa.me/${whatsappNumber}`);

    if (message) {
      normalizedUrl.searchParams.set('text', message);
    }

    return normalizedUrl.toString();
  } catch {
    return href;
  }
};

const buildMailtoUrl = (email, subject, body) => {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const getFieldLabel = (field) => {
  const inlineLabel = field.closest('.form-row')?.querySelector('label')?.textContent?.trim();
  if (inlineLabel) return inlineLabel;

  if (!field.id) return '';
  return field.form?.querySelector(`label[for="${field.id}"]`)?.textContent?.trim() || '';
};

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    setActiveBookingTab(tab.dataset.tab);
  });
});

const applyBookingPrefillFromUrl = () => {
  if (!tabPanels.length) return;

  const currentUrl = new URL(window.location.href);
  const requestedTab = currentUrl.searchParams.get('tab')?.trim();
  const fromCity = currentUrl.searchParams.get('from')?.trim();
  const toCity = currentUrl.searchParams.get('to')?.trim();

  if (!requestedTab && !fromCity && !toCity) return;

  const availableTabs = new Set(
    Array.from(tabPanels)
      .map((panel) => panel.dataset.tabPanel)
      .filter(Boolean)
  );

  const fallbackTab = toCity ? 'outstation' : fromCity ? 'oneway' : '';
  const targetTab = requestedTab && availableTabs.has(requestedTab) ? requestedTab : fallbackTab;

  if (targetTab) {
    setActiveBookingTab(targetTab);
  }

  tabPanels.forEach((panel) => {
    const fromField = panel.querySelector('[data-booking-field="from"]');
    const toField = panel.querySelector('[data-booking-field="to"]');

    if (fromCity && fromField instanceof HTMLInputElement) {
      fromField.value = fromCity;
    }

    if (toCity && toField instanceof HTMLInputElement) {
      toField.value = toCity;
    }
  });
};

applyBookingPrefillFromUrl();

whatsappLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (!href) return;
  link.setAttribute('href', normalizeWhatsAppHref(href));
});

bookingShortcuts.forEach((shortcut) => {
  shortcut.addEventListener('click', (event) => {
    event.preventDefault();
    setActiveBookingTab(shortcut.dataset.bookingTarget);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

whatsappFormButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const form = button.closest('form');
    if (!form) {
      window.open(buildWhatsAppUrl(defaultWhatsAppMessage), '_blank', 'noopener');
      return;
    }

    const bookingIntro = {
      oneway: 'I would like to request a quotation for a one-way cab service.',
      outstation: 'I would like to request a quotation for an outstation cab service.',
      rental: 'I would like to request a quotation for a local rental cab service.',
    }[button.dataset.whatsappForm] || 'I would like to enquire about your cab services.';

    const details = Array.from(form.querySelectorAll('input, select, textarea'))
      .map((field) => {
        const label = getFieldLabel(field);
        const value =
          field.tagName === 'SELECT'
            ? field.options[field.selectedIndex]?.text.trim() || ''
            : field.value.trim();

        return label && value ? `${label}: ${value}` : '';
      })
      .filter(Boolean);

    const message = ['Hello Sp Tours and Travels,', '', bookingIntro]
      .concat(details.length ? ['', 'Trip details:', ...details] : [])
      .concat(['', 'Please share the fare, available vehicle options, and booking details.', '', 'Thank you.'])
      .join('\n');

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener');
  });
});

citySelectionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const city = button.dataset.citySelect?.trim();
    if (!city) return;

    bookingCityFields.forEach((field) => {
      field.value = city;
    });

    button.closest('.city-grid')?.querySelectorAll('.city-option').forEach((option) => {
      option.classList.toggle('is-active', option === button);
    });

    const activeForm = document.querySelector('.booking-form.is-active');
    const nextField = activeForm?.querySelector('input:not([data-city-field]), textarea, select');
    if (nextField instanceof HTMLElement) {
      requestAnimationFrame(() => nextField.focus());
    }
  });
});

corporateFormButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const form = button.closest('form');
    if (!form || !form.reportValidity()) return;

    const details = Array.from(form.querySelectorAll('input, select, textarea'))
      .map((field) => {
        const label = getFieldLabel(field);
        const value =
          field.value.trim() ||
          (field.tagName === 'SELECT' ? field.options[field.selectedIndex]?.text.trim() : '');

        return label && value ? `${label}: ${value}` : '';
      })
      .filter(Boolean);

    const companyName = form.querySelector('#company-name')?.value.trim();
    const contactPerson = form.querySelector('#contact-person')?.value.trim();
    const subject = companyName
      ? `Corporate enquiry from ${companyName}`
      : `Corporate enquiry from ${contactPerson || 'Sp Tours and Travels website visitor'}`;

    const body = ['Hello Sp Tours and Travels,', '', 'I would like to discuss a corporate travel requirement.', '']
      .concat(details.length ? ['Details:', ...details] : [])
      .join('\n');

    window.location.href = buildMailtoUrl(corporateEmail, subject, body);
  });
});

const packageDrawer = document.querySelector('[data-package-drawer]');
if (packageDrawer) {
  const packageDrawerDesktopViewport = window.matchMedia('(min-width: 981px)');
  const packageDrawerMobileViewport = window.matchMedia('(max-width: 980px)');
  const packageDrawerPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const packageLauncherCards = Array.from(
    document.querySelectorAll('.package-browser .package-overview-card[href*="package-details.html#details-"]')
  );
  const drawerFrame = packageDrawer.querySelector('[data-package-drawer-frame]');
  const drawerBody = packageDrawer.querySelector('[data-package-drawer-body]');
  const drawerState = packageDrawer.querySelector('[data-package-drawer-state]');
  const drawerTitle = packageDrawer.querySelector('#package-drawer-title');
  const drawerCloseTriggers = Array.from(packageDrawer.querySelectorAll('[data-package-drawer-close]'));
  let packageDrawerCloseTimer = null;
  let activeDrawerPackageId = '';
  let lastDrawerTrigger = null;

  const shouldUsePackageDrawer = () =>
    packageDrawerMobileViewport.matches || (packageDrawerDesktopViewport.matches && packageDrawerPointer.matches);
  const getPackageDetailsUrl = (packageId) => `package-details.html#${packageId}`;

  const getPackageCardById = (packageId) =>
    packageLauncherCards.find((card) => card.getAttribute('href')?.trim().endsWith(`#${packageId}`)) || null;

  const setActivePackageLauncher = (activePackageId) => {
    packageLauncherCards.forEach((card) => {
      const isActive = card.getAttribute('href')?.trim().endsWith(`#${activePackageId}`);
      card.classList.toggle('is-active-detail', Boolean(activePackageId) && Boolean(isActive));
    });
  };

  const openPackageDrawer = (packageId, trigger) => {
    if (!(drawerFrame && drawerBody && drawerState && drawerTitle) || !packageId) return;

    window.clearTimeout(packageDrawerCloseTimer);

    const relatedCard = getPackageCardById(packageId);
    const relatedTitle = relatedCard?.querySelector('h3')?.textContent?.trim();
    activeDrawerPackageId = packageId;
    lastDrawerTrigger = trigger || relatedCard || lastDrawerTrigger;

    drawerTitle.textContent = relatedTitle || 'Package Details';
    drawerState.hidden = false;
    drawerFrame.hidden = true;
    drawerFrame.style.height = '720px';
    drawerFrame.setAttribute('loading', 'eager');
    drawerFrame.src = `package-details.html?embedded=1#${packageId}`;
    packageDrawer.hidden = false;
    packageDrawer.setAttribute('aria-hidden', 'false');
    body.classList.add('package-drawer-open');
    setActivePackageLauncher(packageId);

    requestAnimationFrame(() => {
      packageDrawer.classList.add('is-open');
      drawerBody.scrollTop = 0;
    });

    if (window.location.hash.replace('#', '') !== packageId) {
      window.history.replaceState(null, '', `#${packageId}`);
    }
  };

  const closePackageDrawer = () => {
    if (packageDrawer.hidden) return;

    const hashValue = window.location.hash.replace('#', '');
    const triggerToFocus = lastDrawerTrigger;

    packageDrawer.classList.remove('is-open');
    packageDrawer.setAttribute('aria-hidden', 'true');
    body.classList.remove('package-drawer-open');
    setActivePackageLauncher('');

    if (hashValue === activeDrawerPackageId) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }

    packageDrawerCloseTimer = window.setTimeout(() => {
      packageDrawer.hidden = true;
      drawerFrame.hidden = true;
      drawerFrame.removeAttribute('src');
      drawerFrame.style.height = '720px';
      drawerState.hidden = false;
      drawerTitle.textContent = 'Package Details';
      activeDrawerPackageId = '';

      if (triggerToFocus instanceof HTMLElement) {
        triggerToFocus.focus();
      }
    }, 360);
  };

  packageLauncherCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      if (!shouldUsePackageDrawer()) {
        return;
      }

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const href = card.getAttribute('href') || '';
      const packageId = href.split('#')[1];
      if (!packageId) return;

      event.preventDefault();
      openPackageDrawer(packageId, card);
    });
  });

  drawerCloseTriggers.forEach((trigger) => {
    trigger.addEventListener('click', closePackageDrawer);
  });

  if (drawerFrame) {
    drawerFrame.addEventListener('load', () => {
      if (packageDrawer.hidden) return;

      let nextTitle = '';
      let nextHeight = 0;

      try {
        const frameDocument = drawerFrame.contentWindow?.document;
        nextTitle =
          frameDocument?.querySelector('.package-detail-card.is-active h2')?.textContent?.trim() ||
          frameDocument?.querySelector('.package-detail-card h2')?.textContent?.trim() ||
          '';
        nextHeight =
          getVisibleEmbeddedPackageHeight(frameDocument) ||
          Math.max(frameDocument?.documentElement?.scrollHeight || 0, frameDocument?.body?.scrollHeight || 0);
      } catch {}

      if (nextTitle) {
        drawerTitle.textContent = nextTitle;
      }

      if (nextHeight) {
        drawerFrame.style.height = `${Math.max(320, Math.ceil(nextHeight))}px`;
      }

      drawerFrame.hidden = false;
      drawerState.hidden = true;
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || packageDrawer.hidden) return;
    closePackageDrawer();
  });

  window.addEventListener('message', (event) => {
    if (event.source !== drawerFrame?.contentWindow) return;

    const { data } = event;
    if (!data || data.type !== 'as-package-embed-height') return;
    if (typeof data.height !== 'number' || !Number.isFinite(data.height)) return;

    drawerFrame.style.height = `${Math.max(320, Math.ceil(data.height))}px`;
    drawerFrame.hidden = false;
    drawerState.hidden = true;
  });

  const requestedPackageId = decodeURIComponent(window.location.hash.replace('#', '').trim());
  if (requestedPackageId.startsWith('details-')) {
    if (shouldUsePackageDrawer()) {
      openPackageDrawer(requestedPackageId);
    } else {
      window.location.replace(getPackageDetailsUrl(requestedPackageId));
    }
  }
}

const packageDetailStacks = document.querySelectorAll('[data-package-detail-stack]');
if (packageDetailStacks.length) {
  const packageRateTemplate = document.getElementById('package-rate-table-template');
  const packageDetailMobileViewport = window.matchMedia('(max-width: 720px)');
  const defaultPackagePageTitle = document.title;

  packageDetailStacks.forEach((stack) => {
    const packageSection = stack.closest('.package-detail-section');
    const packageCards = Array.from(stack.querySelectorAll('.package-detail-card[id]'));
    const packageNav = packageSection?.querySelector('[data-package-chip-nav]');
    const packageNavLinks = Array.from(packageNav?.querySelectorAll('[data-package-link]') || []);
    const packageCloseButton = packageNav?.querySelector('[data-package-close]');
    const defaultCard = packageCards[0];
    let isInitialPackageSync = true;

    if (!defaultCard) return;

    const shouldUseMobilePackagePicker = () => packageDetailMobileViewport.matches && !isEmbeddedPackagePage;
    const getBasePackagePageUrl = () => `${window.location.pathname}${window.location.search}`;
    const updatePackageHash = (packageId = '') => {
      const nextUrl = packageId ? `${getBasePackagePageUrl()}#${packageId}` : getBasePackagePageUrl();
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      if (currentUrl !== nextUrl) {
        window.history.replaceState(null, '', nextUrl);
      }
    };

    if (packageRateTemplate) {
      packageCards.forEach((card) => {
        const detailContent = card.querySelector('.package-detail-content');
        const noteGrid = detailContent?.querySelector('.package-note-grid');

        if (!(detailContent && !detailContent.querySelector('.package-rate-block'))) return;

        const rateBlock = packageRateTemplate.content.cloneNode(true);

        if (noteGrid) {
          noteGrid.after(rateBlock);
        } else {
          detailContent.append(rateBlock);
        }
      });
    }

    const syncActivePackageCard = () => {
      const requestedId = decodeURIComponent(window.location.hash.replace('#', '').trim());
      const matchedCard = packageCards.find((card) => card.id === requestedId) || null;
      const activeCard = matchedCard || (shouldUseMobilePackagePicker() && !requestedId ? null : defaultCard);
      const hasActiveCard = Boolean(activeCard);

      stack.classList.add('is-controlled');
      stack.classList.toggle('is-empty', !hasActiveCard);

      packageCards.forEach((card) => {
        const isActive = hasActiveCard && card === activeCard;
        card.classList.toggle('is-active', isActive);
        card.classList.toggle('is-visible', isActive);
      });

      packageNavLinks.forEach((link) => {
        const isActive = hasActiveCard && link.dataset.packageLink === activeCard.id;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });

      const isMobileCollapsed = shouldUseMobilePackagePicker() && hasActiveCard;
      packageNav?.classList.toggle('is-mobile-collapsed', isMobileCollapsed);

      if (packageCloseButton) {
        packageCloseButton.hidden = !isMobileCollapsed;
      }

      if (!hasActiveCard) {
        document.title = defaultPackagePageTitle;

        if (isEmbeddedPackagePage) {
          requestAnimationFrame(notifyEmbeddedPackageHeight);
        }

        isInitialPackageSync = false;
        return;
      }

      const activeTitle = activeCard.querySelector('h2')?.textContent?.trim();
      if (activeTitle) {
        document.title = `${activeTitle} | Sp Tours and Travels`;
      }

      if (window.location.hash.replace('#', '') !== activeCard.id) {
        updatePackageHash(activeCard.id);
      }

      requestAnimationFrame(() => {
        activeCard.scrollIntoView({
          behavior: isInitialPackageSync ? 'auto' : 'smooth',
          block: 'start',
        });
      });

      if (isEmbeddedPackagePage) {
        requestAnimationFrame(notifyEmbeddedPackageHeight);
      }

      isInitialPackageSync = false;
    };

    window.addEventListener('hashchange', syncActivePackageCard);
    packageDetailMobileViewport.addEventListener('change', syncActivePackageCard);

    if (packageCloseButton) {
      packageCloseButton.addEventListener('click', () => {
        updatePackageHash();
        syncActivePackageCard();
      });
    }

    syncActivePackageCard();
  });
}

let slideIndex = 0;
if (slides.length > 1) {
  setInterval(() => {
    slides[slideIndex].classList.remove('is-active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('is-active');
  }, 5000);
}

testimonialSliders.forEach((slider) => {
  const viewport = slider.querySelector('[data-testimonial-viewport]');
  const track = slider.querySelector('[data-testimonial-track]');
  const dotsContainer = slider.querySelector('[data-testimonial-dots]');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!(viewport && track)) return;

  const originalCards = Array.from(track.querySelectorAll('.testimonial-card'));
  if (originalCards.length <= 1) return;

  let currentIndex = 0;
  let cardsPerView = 3;
  let autoplayId = null;
  let resizeFrame = 0;

  const getCardsPerView = () => {
    if (window.matchMedia('(max-width: 640px)').matches) return 1;
    if (window.matchMedia('(max-width: 980px)').matches) return 2;
    return 3;
  };

  const cloneCard = (card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  };

  const getCardGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap || '0') || 0;
  };

  const updateDots = () => {
    if (!dotsContainer) return;

    Array.from(dotsContainer.children).forEach((dot, index) => {
      const isActive = index === currentIndex % originalCards.length;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  };

  const setTrackPosition = (useTransition = true) => {
    const renderedCards = track.querySelectorAll('.testimonial-card');
    const sampleCard = renderedCards[cardsPerView] || renderedCards[0];
    if (!sampleCard) return;

    const cardWidth = sampleCard.getBoundingClientRect().width;
    const translateIndex = currentIndex + cardsPerView;
    const offset = translateIndex * (cardWidth + getCardGap());

    track.style.transition = useTransition ? 'transform 0.65s ease' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  };

  const buildDots = () => {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';

    originalCards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testimonial-dot';
      dot.setAttribute('aria-label', `Show testimonial ${index + 1}`);
      dot.setAttribute('aria-pressed', 'false');
      dot.addEventListener('click', () => {
        currentIndex = index;
        setTrackPosition(true);
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    });

    updateDots();
  };

  const rebuildTrack = () => {
    cardsPerView = getCardsPerView();
    const normalizedIndex = ((currentIndex % originalCards.length) + originalCards.length) % originalCards.length;
    const leadingClones = originalCards.slice(-cardsPerView).map(cloneCard);
    const trailingClones = originalCards.slice(0, cardsPerView).map(cloneCard);

    track.replaceChildren(...leadingClones, ...originalCards, ...trailingClones);
    currentIndex = normalizedIndex;

    requestAnimationFrame(() => {
      setTrackPosition(false);
    });
  };

  const stopAutoplay = () => {
    if (!autoplayId) return;
    window.clearInterval(autoplayId);
    autoplayId = null;
  };

  const goToNext = () => {
    currentIndex += 1;
    setTrackPosition(true);
  };

  const startAutoplay = () => {
    stopAutoplay();

    if (reduceMotionQuery.matches || originalCards.length <= cardsPerView) return;

    autoplayId = window.setInterval(goToNext, 4200);
  };

  track.addEventListener('transitionend', () => {
    if (currentIndex >= originalCards.length) {
      currentIndex = 0;
      setTrackPosition(false);
      return;
    }

    if (currentIndex < 0) {
      currentIndex = originalCards.length - 1;
      setTrackPosition(false);
    }
  });

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', (event) => {
    if (event.relatedTarget instanceof Node && slider.contains(event.relatedTarget)) return;
    startAutoplay();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
      return;
    }

    startAutoplay();
  });

  const handleMotionChange = () => {
    if (reduceMotionQuery.matches) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  };

  if (typeof reduceMotionQuery.addEventListener === 'function') {
    reduceMotionQuery.addEventListener('change', handleMotionChange);
  } else if (typeof reduceMotionQuery.addListener === 'function') {
    reduceMotionQuery.addListener(handleMotionChange);
  }

  buildDots();
  rebuildTrack();
  startAutoplay();

  window.addEventListener('resize', () => {
    if (resizeFrame) {
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(() => {
      rebuildTrack();
      startAutoplay();
    });
  });
});

const revealElements = document.querySelectorAll(revealSelectors.join(','));
if (revealElements.length) {
  revealElements.forEach((element, index) => {
    element.classList.add('reveal');
    const delay = Math.min(index * 70, 280);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observerInstance.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    requestAnimationFrame(() => {
      revealElements.forEach((element) => observer.observe(element));
    });
  } else {
    requestAnimationFrame(() => {
      revealElements.forEach((element) => element.classList.add('is-visible'));
    });
  }
}

const counters = document.querySelectorAll('[data-counter]');
const formatCounterValue = (counter, value) => {
  const suffix = counter.dataset.counterSuffix || '';
  return `${value.toLocaleString('en-US')}${suffix}`;
};

const animateCounters = () => {
  counters.forEach((counter) => {
    if (counter.dataset.animated) return;
    const rect = counter.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      counter.dataset.animated = 'true';
      const target = Number(counter.dataset.counter) || 0;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 80));
      const tick = () => {
        current = Math.min(target, current + step);
        counter.textContent = formatCounterValue(counter, current);
        if (current < target) {
          requestAnimationFrame(tick);
        }
      };
      tick();
    }
  });
};

window.addEventListener('scroll', animateCounters);
animateCounters();

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

