document.addEventListener('DOMContentLoaded', (event) => {

  const getElement = (context, selector) => {
    if (!context && !selector) {
      return null;
    }

    return context.querySelector(selector);
  };

  document.body.classList.add('loading');

  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 500)

  // "modernizr" func"
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
  }

  if (!isTouchDevice()) {

  } else {

  }

  $(window).on('scroll', function () {
    if($(window).scrollTop() >  50 ){
      document.querySelector('.js-header').classList.add('scroll')
    }
    if($(window).scrollTop() <  50){
      document.querySelector('.js-header').classList.remove('scroll')
    }
  })

  if($(window).scrollTop() >  50 ){
    document.querySelector('.js-header').classList.add('scroll')
  }
  if($(window).scrollTop() <  50){
    document.querySelector('.js-header').classList.remove('scroll')
  }

  // lazy-load
  const el = document.querySelectorAll('.lazy');
  window.observer = lozad(el);
  window.observer.observe();

  // video
  function initYouTubePlayer(videoContainer, playerId, videoId) {
    function onYouTubeIframeAPIReady() {
      window[playerId] = new YT.Player(playerId, {
        width: '100%',
        videoId: videoId,
        playerVars: { 'playsinline': 1, 'showinfo': 0, 'enablejsapi': 1 },
        events: {
          'onReady': onPlayerReady
        }
      });
    }

    function onPlayerReady(event) {
      const playButton = videoContainer.querySelector('.js-play-video');
      if (playButton) {
        playButton.addEventListener('click', () => {
          playButton.classList.add('hide');
          event.target.playVideo();
        });
      }
    }

    // Ensure the YouTube IFrame API is loaded before calling onYouTubeIframeAPIReady
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Polling for YouTube API readiness
    function checkYouTubeAPI() {
      if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined') {
        onYouTubeIframeAPIReady();
      } else {
        setTimeout(checkYouTubeAPI, 100);
      }
    }

    checkYouTubeAPI();
  }

  // Initialize all video containers
  document.querySelectorAll('.js-yt-video').forEach((videoElement, index) => {
    const videoId = videoElement.getAttribute('data-src');
    const videoParent = videoElement.parentElement;

    // Create a unique ID for each player container
    const playerId = `ytplayer-${index}`;

    // Create player container if it doesn't exist
    let playerElement = videoElement.querySelector('.ytplayer');
    if (!playerElement) {
      playerElement = document.createElement('div');
      playerElement.className = 'ytplayer';
      videoElement.appendChild(playerElement);
    }
    playerElement.id = playerId;

    // Initialize YouTube player for this container
    initYouTubePlayer(videoParent, playerId, videoId);
  });

  // body-padding
  let resizeTimer;

  function setBodyPadding() {
    const headerHeight = document.querySelector('.js-header').offsetHeight;
    document.body.style.paddingTop = headerHeight + 'px';
  }

  setBodyPadding();

  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setBodyPadding, 250);
  });

  // compare
  $('.js-compare-slider').slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 3,
    prevArrow: $('.js-prev-slick'),
    nextArrow: $('.js-next-slick'),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 860,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  // videos
  $('.js-videos-slider').slick({
    dots: true,
    arrows: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    fade: true
  });

  function findAndSetTallestHeight() {
    let elementsWithDate = document.querySelectorAll('.js-td-item');

    // Create an object to store the heights for each date
    let heightsByDate = {};

    elementsWithDate.forEach(function(element) {
      let date = element.getAttribute('data-id');
      let height = element.offsetHeight;

      if (!heightsByDate[date] || height > heightsByDate[date]) {
        heightsByDate[date] = height;
      }
    });

    elementsWithDate.forEach(function(element) {
      let date = element.getAttribute('data-id');
      element.style.height = heightsByDate[date] + 'px';
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }

  findAndSetTallestHeight();
  window.addEventListener('resize', debounce(findAndSetTallestHeight, 500));
  window.addEventListener('orientationchange', findAndSetTallestHeight);

  // anchor directory

  let links = document.querySelectorAll('.js-acnhor');

  links.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();

      let targetId = this.getAttribute('href');
      let targetElement = document.querySelector(targetId);
      let offset = 60;

      if (targetElement) {
        let targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetPosition - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  // modal
  const openModal = document.querySelectorAll('.js-open-modal')
  const popupWrap = document.querySelector('.js-popup-wrap');
  const popupClose = document.querySelectorAll('.js-close-popup')

  openModal.forEach((modaltn) => {
    const idModal = modaltn.getAttribute('data-id');
    const src = modaltn.getAttribute('data-src')

    modaltn.addEventListener('click', () => {
      popupWrap.classList.add('block');
      document.body.style.overflow = 'hidden'
      document.body.classList.add('pr')
      // if(idModal === '#video') {
      //   setTimeout(() => {
      //     document.querySelector('.utubr').setAttribute('src', src)
      //   }, 500)
      // }
      const dataAttributes = Object.keys(modaltn.dataset).filter(key => key !== 'id');

      // Пройти по каждому data атрибуту
      dataAttributes.forEach(attribute => {
        // Получить значение атрибута
        const value = modaltn.dataset[attribute];

        // Найти все элементы с классом .logo-item, у которых есть такой же атрибут
        const logoItems = document.querySelectorAll(`.logo-item[data-${attribute}]`);

        // Пройти по каждому найденному элементу .logo-item
        logoItems.forEach(logoItem => {
          // Вставить значение атрибута в атрибут href
          logoItem.setAttribute('href', value);
        });
      });

      setTimeout(() => {
        popupWrap.classList.add('show');
        document.querySelectorAll('.popup-item').forEach((elh) => {
          elh.classList.remove('show');
        })
        document.querySelector('.popup-item[data-id="'+ idModal +'"]').classList.add('show');
      }, 50);
    });
  });

  popupClose.forEach((close) => {
    close.addEventListener('click', () => {
      document.querySelectorAll('.popup-item').forEach((allPop) => {
        allPop.classList.remove('show');
      });
      popupWrap.classList.remove('show');
      document.body.style.overflow = 'initial'
      document.body.classList.remove('pr')

      setTimeout(() => {
        popupWrap.classList.remove('block');
        // document.querySelector('.utubr').setAttribute('src', '')
        window.player = null;
      }, 150);
    });
  });

  document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
      isEscape = (evt.keyCode === 27);
    }
    document.body.style.overflow = 'initial'
    document.body.classList.remove('pr')
    if (isEscape) {
      document.querySelectorAll('.popup-item').forEach((allPop) => {
        allPop.classList.remove('show');
      });
      popupWrap.classList.remove('show');

      setTimeout(() => {
        popupWrap.classList.remove('block');
      }, 150);
    }
  };
})
