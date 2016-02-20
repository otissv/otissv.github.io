'use strict';

function headlineText () {
  let maxfontsize = window.innerHeight < 280 ? 50 : 80;

  $('#ov-landing-headline').bigtext({
    maxfontsize: maxfontsize
  });
};


module.exports = function home () {
  headlineText();
}
