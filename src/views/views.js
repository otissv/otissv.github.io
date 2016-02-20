'use strict';

const style = require('../scripts/style');
const partials = ['index', 'work', 'about', 'contact', 'blog'];

module.exports = [
  {
    partials: partials,
    output: 'index',
    data: {
      title: 'Otissv - Web, JavaScript Developer',
      page: 'home',
      backgroundColor: style.home.backgroundColor
    },
  },
  {
    partials: partials,
    output: 'about',
    data: {
      title: 'About Me - Otissv Web, JavaScript Developer',
      page: 'about',
      backgroundColor: style.about.backgroundColor
    },
  },
  {
    partials: partials,
    output: 'contact',
    data: {
      title: 'Let\'s chat - Otissv Web, JavaScript Developer',
      page: 'contact',
      backgroundColor: style.contact.backgroundColor
    },
  },
  {
    partials: partials,
    output: 'work',
    data: {
      title: 'My work - Otissv Web, JavaScript Developer',
      page: 'work',
      backgroundColor: style.work.backgroundColor
    }
  },
  {
    partials: partials,
    output: 'blog',
    data: {
      title: 'Blog',
      page: 'blog',
      backgroundColor: style.work.backgroundColor
    }
  }
];
