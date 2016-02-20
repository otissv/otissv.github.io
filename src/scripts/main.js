'use strict';

// uikit modules
require('../../vendor/uikit/js/uikit');
require('../../vendor/uikit/js/components/parallax');

/*
* My scripts
 */
const common = require('./common');
const home = require('./home');
const about = require('./about');
const work = require('./work');
const contact = require('./contact');
const blog = require('./blog');

$(document).ready(function() {

  const path = window.location.pathname;
  const page = path === '/' ? 'home' : path.match(/\w+/g)[0];

  // set up initial events
  const controllers = {
    home: home,
    about: about,
    work: work,
    contact: contact,
    blog: blog,
  }

  common(controllers, page);


  // set initail page
  $(`#ov-${page}-main`).css({opacity: 1});

   switch (path) {
     case '/':
       home();
       break;
     case '/about.html':
       about();
       break;
     case '/work.html':
       work();
       break;
     case '/contact.html':
       contact();
       break;
     case '/blog.html':
       contact();
     default:
       home();
   }
});
