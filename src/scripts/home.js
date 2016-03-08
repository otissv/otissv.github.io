'use strict';

function headlineText () {
  let maxfontsize = window.innerHeight < 280 ? 50 : 100;

  $('#ov-landing-headline').bigtext({
    maxfontsize: maxfontsize
  });
};


module.exports = function home () {
  headlineText();
  $('.ov-landing').css('height', $(window).height());
}
