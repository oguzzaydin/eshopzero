/* Dore Landing Page Scripts */
/* Please do not use together with dore.scripts.js file */

$.dore = function (element, options) {
    var defaults = {};
    var plugin = this;
    plugin.settings = {};
    var $element = $(element);
    var element = element;
  
    var mobileBreakpoint = 992;
  
    var $shiftSelect;
  
    function init() {
      /* Owl Carousel */
      if ($().owlCarousel) {
        if ($(".home-carousel").length > 0) {
          $(".home-carousel")
            .owlCarousel({
              margin: 30,
              stagePadding: 15,
              loop: true,
              autoplay: true,
              responsive: {
                0: {
                  items: 1
                },
                768: {
                  items: 2
                },
                992: {
                  items: 3
                },
                1200: {
                  items: 4
                }
              }
            })
            .data("owl.carousel")
            .onResize();
        }
  
        if ($(".client-carousel").length > 0) {
          $(".client-carousel")
            .owlCarousel({
              margin: 30,
              stagePadding: 15,
              autoplay: true,
              loop: true,
              dotsContainer: $(".client-carousel")
                .parents(".owl-container")
                .find(".slider-dot-container"),
              responsive: {
                0: {
                  items: 1
                },
                768: {
                  items: 2
                },
                992: {
                  items: 4
                },
                1440: {
                  items: 6
                }
              }
            })
            .data("owl.carousel")
            .onResize();
        }
  
  
        if ($(".review-carousel").length > 0) {
          $(".review-carousel")
            .owlCarousel({
              margin: 30,
              stagePadding: 15,
              autoplay: true,
              loop: true,
              dotsContainer: $(".review-carousel")
                .parents(".owl-container")
                .find(".slider-dot-container"),
              responsive: {
                0: {
                  items: 1
                },
                768: {
                  items: 2
                },
                992: {
                  items: 3
                },
                1440: {
                  items: 4
                }
              }
            })
            .data("owl.carousel")
            .onResize();
        }
  
        if ($(".team-carousel").length > 0) {
          $(".team-carousel")
            .owlCarousel({
              margin: 30,
              stagePadding: 15,
              loop: true,
              autoplay: true,
              dotsContainer: $(".team-carousel")
                .parents(".owl-container")
                .find(".slider-dot-container"),
              responsive: {
                0: {
                  items: 2
                },
                576: {
                  items: 3
                },
                992: {
                  items: 2
                },
                1440: {
                  items: 3
                }
              }
            })
            .data("owl.carousel")
            .onResize();
        }
        $(".owl-dot").click(function () {
          var carouselReference = $(
            $(this)
            .parents(".owl-container")
            .find(".owl-carousel")
          ).owlCarousel();
          carouselReference.trigger("to.owl.carousel", [$(this).index(), 300]);
        });
  
        $(".owl-prev").click(function (event) {
          event.preventDefault();
          var carouselReference = $(
            $(this)
            .parents(".owl-container")
            .find(".owl-carousel")
          ).owlCarousel();
          carouselReference.trigger("prev.owl.carousel", [300]);
        });
  
        $(".owl-next").click(function (event) {
          event.preventDefault();
          var carouselReference = $(
            $(this)
            .parents(".owl-container")
            .find(".owl-carousel")
          ).owlCarousel();
          carouselReference.trigger("next.owl.carousel", [300]);
        });
      }
  
      /* Contact Button */
      $("#contactButton").on("click", function (event) {
        event.preventDefault();
        var $button = $(this);
        if (
          $button.hasClass("show-fail") ||
          $button.hasClass("show-spinner") ||
          $button.hasClass("show-success")
        ) {
          return;
        }
  
        $button.addClass("show-spinner");
        $button.addClass("active");
        setTimeout(function () {
          $button.addClass("show-success");
          $button.removeClass("show-spinner");
          $button.find(".icon.success").tooltip("show");
          setTimeout(function () {
            $button.removeClass("show-success");
            $button.removeClass("active");
            $button.find(".icon.success").tooltip("dispose");
          }, 2000);
        }, 3000);
      });
  
      /* Heading hiding */
      if ($().headroom) {
        $(".landing-page nav").headroom({
          offset: 100
        });
  
        if ($(window).scrollTop() > 100) {
          $(".landing-page nav").addClass("headroom--pinned");
        }
      }
  
      /* Ratings with reviews */
      if ($().barrating) {
        $(".rating").each(function () {
          var current = $(this).data("currentRating");
          var readonly = $(this).data("readonly");
          $(this).barrating({
            theme: "bootstrap-stars",
            initialRating: current,
            readonly: readonly
          });
        });
      }
  
      /* Menu */
      $(".landing-page .mobile-menu-button").on("click", function (event) {
        event.preventDefault();
        $(".landing-page").toggleClass("show-mobile-menu");
      });
  
      $(".landing-page").on("click", function (event) {
        if (
          !(
            $(event.target)
            .parents()
            .hasClass("mobile-menu-button") ||
            $(event.target).hasClass("mobile-menu-button") ||
            $(event.target).hasClass("mobile-menu") ||
            $(event.target)
            .parents()
            .hasClass("mobile-menu")
          ) &&
          $(".landing-page").hasClass("show-mobile-menu")
        ) {
          event.preventDefault();
          $(".landing-page").removeClass("show-mobile-menu");
        }
      });
  
      /* Scroll to when clicked a button */
      $(".scrollTo").on("click", function (event) {
        event.preventDefault();
        var $this = $(this);
        var target = $this.attr("href");
        $(window).scrollTo(target, 500, {
          offset: {
            top: -50
          },
          onAfter: function () {
            if ($(".landing-page").hasClass("show-mobile-menu")) {
              $(".landing-page").removeClass("show-mobile-menu");
            }
            if (target != "#home") {
              setTimeout(function () {
                $(".landing-page-nav").removeClass("headroom--pinned");
                $(".landing-page-nav").addClass("headroom--unpinned");
              }, 60);
            }
          }
        });
      });
  
      /* Ellipsis */
      if ($().ellipsis) {
        $(".ellipsis").ellipsis({
          live: true
        });
      }
  
      /* Tooltip */
      if ($().tooltip) {
        $('[data-toggle="tooltip"]').tooltip();
      }
  
      /* Feedback */
      $(".feedback-container").on("click", "a", onFeedbackClick);
  
      function onFeedbackClick(event) {
        event.preventDefault();
        $(".feedback-container").off("click", "a", onFeedbackClick);
        $(".feedback-container a").tooltip("dispose");
        $(".feedback-container a").animate({
          opacity: 0
        }, 300, function () {
          $(".feedback-container a").css("visibility", "hidden");
        });
        $(".feedback-container .feedback-answer").html($(event.currentTarget).data("message"));
      }
  
      function onResizeLandingPage() {
        if ($(".home-row").length > 0) {
          var rowOffestHome = $(".home-row").offset().left;
  
          $(".landing-page .section.home").css(
            "background-position-x",
            rowOffestHome - 580 + "px"
          );
        }
  
        if ($(".footer-row").length > 0) {
          var rowOffestFooter = $(".footer-row").offset().left;
          $(".landing-page .section.footer").css(
            "background-position-x",
            Math.min($(window).width() - rowOffestFooter - 2000, 0) + "px"
          );
        }
  
        if ($(window).width() >= mobileBreakpoint) {
          $(".landing-page").removeClass("show-mobile-menu");
        }
      }
  
  
      $(window).on("resize", onResizeLandingPage);
      onResizeLandingPage();
  
      /* Showing body elements */
      $("body > *")
        .stop()
        .delay(100)
        .animate({
          opacity: 1
        }, 500);
      $(".theme-colors").addClass("default-transition");
      $(".mobile-menu").addClass("default-transition");
      $("body").removeClass("show-spinner");
    }
    init();
  };
  
  $.fn.dore = function (options) {
    return this.each(function () {
      if (undefined == $(this).data("dore")) {
        var plugin = new $.dore(this, options);
        $(this).data("dore", plugin);
      }
    });
  };