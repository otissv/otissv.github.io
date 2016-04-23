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
const projects = require('./projects');
const contact = require('./contact');
const blog = require('./blog');

$(document).ready(function() {

  const path = window.location.pathname;
  const page = path === '/' ? 'home' : path.match(/\w+/g)[0];

  // set up initial events
  const controllers = {
    home: home,
    about: about,
    projects: projects,
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
     case '/projects.html':
       projects();
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
