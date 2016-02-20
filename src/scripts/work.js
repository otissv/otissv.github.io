'use strict';


function portfolioItemsScroll (items) {
  $(window).scroll(() => {
    const BodyScrollFromTop = $('body, html, document').scrollTop() != 0 ? $('body, html, document').scrollTop() : $('body').scrollTop() ;
    const viewportHeight = $(window).height();
    const itemHeightDesktop = 290;

    items.each(function (i) {
      let offsetUp =  0;
      let offsetDown = 0;

      if (itemHeightDesktop !== this.offsetHeight) {
        offsetUp = 100;
        offsetDown = -100;
      }

      const scrollUptrigger =   BodyScrollFromTop  + (viewportHeight /2) + offsetUp;
      const scrollDowntrigger =   BodyScrollFromTop + offsetDown;

      if (scrollUptrigger <= this.offsetTop || scrollDowntrigger  >= this.offsetTop) {
        $(this).removeClass('ov-portfolio-item-inView');
        $(this).find('.ov-portfolio-item-overlay').css({opacity: 0.4});
      } else {
        $(this).addClass('ov-portfolio-item-inView');
        $(this).find('.ov-portfolio-item-overlay').css({opacity: 0});
      }
    });
  });
}

function headlineTextResize () {
  let maxfontsize = window.innerHeight < 280 ? 50 : 80;

  $('#ov-headlineText').bigtext({
    maxfontsize: maxfontsize
  });
}


module.exports = function work () {
  const portfolioItems = $('.ov-portfolio-item');
  const firstItem = portfolioItems[0];

  headlineTextResize();

  $(firstItem).find('.ov-portfolio-item-overlay').css({opacity: 0});
  $(firstItem).addClass('ov-portfolio-item-inView');
  portfolioItemsScroll(portfolioItems);
}
