/**
 * Created by frank on 2017/5/12.
 */
$(function () {
  // 轮播
  var swiper = new Swiper('#siteBanners', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
  });

  var swiper2 = new Swiper('#albumSlides', {
    pagination: '.swiper-pagination',
    slidesPerView: 4,
    centeredSlides: true,
    paginationClickable: true,
    spaceBetween: 0,
    grabCursor: true
  });


  $(document).on('click', 'a', function (event) {
    event.preventDefault();

    let anchor = $.attr(this, 'href')//#siteBanners
    let top = $(anchor).offset().top
    $('html,body').animate({
      scrollTop: top
    }, 500);
  });

  $('#goTop').on('click', function () {
    $('html,body').animate({
      scrollTop: 0
    }, 200);
  })

  //  sticky topbar
  $(window).on('scroll', function () {
    let top = $('body').scrollTop()
    if (top > $('#topbar').outerHeight()) {
      $('#topbar').addClass('sticky')
    } else {
      $('#topbar').removeClass('sticky')
    }
  })

  let width = $('#canvasWrapper').width()
  let height = $('#canvasWrapper').height()

  let $canvas = $('#canvasWrapper')
    .append(`<canvas width="${width}" height="${height}"/>`).children('canvas')
  $canvas.css({
    position: 'absolute',
    top: 0,
    left: 0
  })
  let canvas = $canvas[0]

  let lastPoint = null
  $canvas.on('touchstart', function (e) {
    let tool = getTool()
    let touch = e.originalEvent.touches[0]
    let {x, y} = getMousePosition($canvas[0], touch)
    touchStartAction(tool, x, y)
  })

  function touchStartAction (tool, x, y) {
    if (tool === 'pen') {
      lastPoint = {x: x, y: y}
    } else if (tool === 'eraser') {
      erase(x, y, 10, 10)
    }
  }

  $canvas.on('touchmove', function (e) {
    e.preventDefault()
    let tool = getTool()
    let touch = e.originalEvent.touches[0]
    let {x, y} = getMousePosition($canvas[0], touch)
    touchMoveAction(tool, x, y)
  })

  function touchMoveAction (tool, x, y) {
    if (tool === 'pen') {
      drawLine(lastPoint.x, lastPoint.y, x, y)
      lastPoint = {x: x, y: y}
    } else if (tool === 'eraser') {
      erase(x, y, 10, 10)
    }

  }

  function drawLine (x1, y1, x2, y2) {
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function getMousePosition (canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function erase (x, y, width, height) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(x - width / 2, y - height / 2, width, height)
  }

  function getTool () {
    return $('[name=tool]:checked').val()
  }

})