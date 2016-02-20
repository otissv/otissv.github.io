'use strict';

const addClass = require('./helpers/add-class');
const removeClass = require('./helpers/remove-class');
const velocity = require('velocity-animate');
const style = require('./style');


function pageController (args) {
  const navlink = args.navlink;
  const controllers = args.controllers;

  // change url path name
  const page = navlink === 'home' ? '/' : `${navlink}.html`;

  if(history.pushState) {
    history.pushState(null, null, page);
  }
  else {
    location.hash = `${navlink}`;
  }

  // execute page script
  controllers[navlink]();
}

function parallaxBackgroundSize (navlink) {
  const parallax = [...$(`#ov-${navlink}-main [data-uk-parallax]`)];

  parallax.forEach(p => {
    const dataset = JSON.parse(p.dataset.ukParallax);

    if (!isNaN(dataset['bg'])) {

      const dataset = JSON.parse(p.dataset.ukParallax);
      const diff = parseInt(dataset['bg']) * -1;
      const w = p.offsetWidth;
      const h = p.offsetHeight ;
      const ratio = h / w;
      const width = w + (diff * ratio);
      const height = h + diff;

      p.style.backgroundSize = `${width}px ${height}px`;
    }
  });
}


function onNavItemClick (controllers) {
  $('.ov-nav-list>li').click(event => {
    event.preventDefault();
    const currentTarget = event.currentTarget;
    const navlink = currentTarget.dataset.navlink;
    const body = $('body');
    const backgroundDuration = 280;


    // set active link
    $('.ov-nav-list>li').each(function () {
      removeClass(this, 'uk-active');
    });


    addClass(currentTarget, 'uk-active');


    // scroll to top
    body.scrollTop('0');


    // remove old background
    $('.ov-background').remove();


    // add new background
    body.prepend(`<div class="ov-background ov-${navlink}" data-pagebg='${navlink}'></div>`);

    // animate background
    $(`.ov-background.ov-${navlink}`)
      .css({
        height: 0,
        left: event.pageX,
        opacity: 0.5,
        width: 0
      })
      .velocity({
        height: ['100vh', [1, 0.1, 0.4, 0.93]],
        left: 0,
        width: '100%',
        opacity: 1,
      }, backgroundDuration);


      // load controller
      pageController({
        navlink    : navlink,
        controllers: controllers
      });


      // add page class to body
      const oldPage = body[0].className;

      body.removeClass().addClass(`ov-${navlink}`);

      setTimeout(() => {
        $(`#ov-${navlink}-main`).velocity({opacity: 1});
      }, backgroundDuration);


      // change page backound color
      setTimeout(() => {
        $('html').css({backgroundColor: style[navlink].backgroundColor});
      }, 800);

      // Set parallax background images sizes
      parallaxBackgroundSize(navlink);

  });
}


function onNavScroll () {
  $(window).scroll(() => {
    const BodyScrollFromTop = $('body').scrollTop();
    const navbar = $('.ov-navbar');

    if (BodyScrollFromTop < 50) {
      navbar.css({background: 'rgba(33, 33, 33, 0.5)'});
    } else {
      navbar.css({background: 'rgba(33, 33, 33, 0.8)'});
    }
  });
}


module.exports = function common (controllers, page) {
  parallaxBackgroundSize(page);
  $(`.ov-nav-list>li.${page}`).addClass('uk-active');

  onNavItemClick(controllers);
  onNavScroll();

  // stop landing from being resized on mobile due to vieport resizing;
  const viewport = $(window).height();
  $('ov-landing').css({height: viewport});
}
