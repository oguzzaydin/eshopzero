/* Dore Main Script 

Table of Contents

01. Utils
02. Shift Select
03. Dore Main Plugin
  03.01. Getting Colors from CSS
  03.02. Resize
  03.03. Search
  03.04. Shift Selectable Init
  03.05. Menu
  03.06. App Menu
  03.07. Survey App
  03.08. Rotate Button
  03.09. Charts
  03.10. Calendar
  03.11. Datatable
  03.12. Notification
  03.13. Dropdown Select
  03.14. Slick Slider
  03.15. Form Validation
  03.16. Tooltip
  03.17. Popover
  03.18. Select 2
  03.19. Datepicker
  03.20. Dropzone
  03.21. Cropperjs
  03.22. Range Slider
  03.23. Modal Passing Content
  03.24. Scrollbar
  03.25. Progress
  03.26. Rating
  03.27. Tags Input
  03.28. Sortable
  03.29. State Button
  03.30. Typeahead
  03.31. Full Screen
  03.32. Html Editors
  03.33. Showing Body
  03.34. Keyboard Shortcuts
  03.35. Context Menu
  03.36. Select from Library 
  03.37. Feedback
  03.38. Smart Wizard
  03.39. Countdown
  03.40. Lightbox
  03.41. Ellipsis
  03.42. Glide
  03.43. Validation
*/

/* 01. Utils */
$.fn.addCommas = function (nStr) {
  nStr += "";
  var x = nStr.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
};

// State Button
(function ($) {
  $.fn.stateButton = function (options) {
    if (this.length > 1) {
      this.each(function () { $(this).stateButton(options) });
      return this;
    }

    this.initialize = function () {
      return this;
    };

    this.showSpinner = function () {
      $(this).addClass("show-spinner");
      $(this).addClass("active");
      return this;
    };

    this.hideSpinner = function () {
      $(this).removeClass("show-spinner");
      return this;
    };

    this.showFail = function (tooltip) {
      $(this).addClass("show-fail");
      $(this).removeClass("show-spinner");
      if (tooltip) {
        $(this).find(".icon.fail").tooltip("show");
      }
      return this;
    };

    this.showSuccess = function (tooltip) {
      $(this).addClass("show-success");
      $(this).removeClass("show-spinner");
      if (tooltip) {
        $(this).find(".icon.success").tooltip("show");
      }
      return this;
    };

    this.reset = function () {
      this.hideTooltips();
      this.hideSpinner();
      $(this).removeClass("show-success");
      $(this).removeClass("show-fail");
      $(this).removeClass("active");
    }

    this.hideTooltips = function () {
      this.hideFailTooltip();
      this.hideSuccessTooltip();
      return this;
    };

    this.showSuccessTooltip = function () {
      $(this).find(".icon.success").tooltip("show");
      return this;
    };

    this.hideSuccessTooltip = function () {
      $(this).find(".icon.success").tooltip("dispose");
      return this;
    };

    this.showFailTooltip = function () {
      $(this).find(".icon.fail").tooltip("show");
      return this;
    };

    this.hideFailTooltip = function () {
      $(this).find(".icon.fail").tooltip("dispose");
      return this;
    };

    return this.initialize();
  }
})(jQuery);

/* 02. Shift Select */
$.shiftSelectable = function (element, config) {
  var plugin = this;
  config = $.extend(
    {
      items: ".card"
    },
    config
  );
  var $container = $(element);
  var $checkAll = null;
  var $boxes = $container.find("input[type='checkbox']");
  var lastChecked;
  if ($container.data("checkAll")) {
    $checkAll = $("#" + $container.data("checkAll"));
    $checkAll.on("click", function () {
      $boxes.prop("checked", $($checkAll).prop("checked")).trigger("change");
      document.activeElement.blur();
      controlActiveClasses();
    });
  }

  function itemClick(checkbox, shiftKey) {
    $(checkbox)
      .prop("checked", !$(checkbox).prop("checked"))
      .trigger("change");

    if (!lastChecked) {
      lastChecked = checkbox;
    }
    if (lastChecked) {
      if (shiftKey) {
        var start = $boxes.index(checkbox);
        var end = $boxes.index(lastChecked);
        $boxes
          .slice(Math.min(start, end), Math.max(start, end) + 1)
          .prop("checked", lastChecked.checked)
          .trigger("change");
      }
      lastChecked = checkbox;
    }

    if ($checkAll) {
      var anyChecked = false;
      var allChecked = true;
      $boxes.each(function () {
        if ($(this).prop("checked")) {
          anyChecked = true;
        } else {
          allChecked = false;
        }
      });
      if (anyChecked) {
        $checkAll.prop("indeterminate", anyChecked);
      } else {
        $checkAll.prop("indeterminate", anyChecked);
        $checkAll.prop("checked", anyChecked);
      }
      if (allChecked) {
        $checkAll.prop("indeterminate", false);
        $checkAll.prop("checked", allChecked);
      }
    }
    document.activeElement.blur();
    controlActiveClasses();
  }

  $container.on("click", config.items, function (e) {
    if (
      $(e.target).is("a") ||
      $(e.target)
        .parent()
        .is("a")
    ) {
      return;
    }

    if ($(e.target).is("input[type='checkbox']")) {
      e.preventDefault();
      e.stopPropagation();
    }
    var checkbox = $(this).find("input[type='checkbox']")[0];
    itemClick(checkbox, e.shiftKey);
  });

  function controlActiveClasses() {
    $boxes.each(function () {
      if ($(this).prop("checked")) {
        $(this)
          .parents(".card")
          .addClass("active");
      } else {
        $(this)
          .parents(".card")
          .removeClass("active");
      }
    });
  }

  plugin.update = function () {
    $boxes = $container.find("input[type='checkbox']");
  }

  plugin.selectAll = function () {
    if ($checkAll) {
      $boxes.prop("checked", true).trigger("change");
      $checkAll.prop("checked", true);
      $checkAll.prop("indeterminate", false);
      controlActiveClasses();
    }
  };

  plugin.deSelectAll = function () {
    if ($checkAll) {
      $boxes.prop("checked", false).trigger("change");
      $checkAll.prop("checked", false);
      $checkAll.prop("indeterminate", false);
      controlActiveClasses();
    }
  };

  plugin.rightClick = function (trigger) {
    var checkbox = $(trigger).find("input[type='checkbox']")[0];
    if ($(checkbox).prop("checked")) {
      return;
    }
    plugin.deSelectAll();
    itemClick(checkbox, false);
  };
};

$.fn.shiftSelectable = function (options) {
  return this.each(function () {
    if (undefined == $(this).data("shiftSelectable")) {
      var plugin = new $.shiftSelectable(this, options);
      $(this).data("shiftSelectable", plugin);
    }
  });
};

/* 03. Dore Main Plugin */
$.dore = function (element, options) {
  var defaults = {};
  var plugin = this;
  plugin.settings = {};
  var $element = $(element);
  var element = element;
  var $shiftSelect;
  var direction;
  var isRtl = false;

  function init() {
    options = options || {};
    plugin.settings = $.extend({}, defaults, options);
    setDirection();

    /* 03.01. Getting Colors from CSS */
    var rootStyle = getComputedStyle(document.body);
    var themeColor1 = rootStyle.getPropertyValue("--theme-color-1").trim();
    var themeColor2 = rootStyle.getPropertyValue("--theme-color-2").trim();
    var themeColor3 = rootStyle.getPropertyValue("--theme-color-3").trim();
    var themeColor4 = rootStyle.getPropertyValue("--theme-color-4").trim();
    var themeColor5 = rootStyle.getPropertyValue("--theme-color-5").trim();
    var themeColor6 = rootStyle.getPropertyValue("--theme-color-6").trim();
    var themeColor1_10 = rootStyle
      .getPropertyValue("--theme-color-1-10")
      .trim();
    var themeColor2_10 = rootStyle
      .getPropertyValue("--theme-color-2-10")
      .trim();
    var themeColor3_10 = rootStyle
      .getPropertyValue("--theme-color-3-10")
      .trim();
    var themeColor4_10 = rootStyle
      .getPropertyValue("--theme-color-4-10")
      .trim();

    var themeColor5_10 = rootStyle
      .getPropertyValue("--theme-color-5-10")
      .trim();
    var themeColor6_10 = rootStyle
      .getPropertyValue("--theme-color-6-10")
      .trim();

    var primaryColor = rootStyle.getPropertyValue("--primary-color").trim();
    var foregroundColor = rootStyle
      .getPropertyValue("--foreground-color")
      .trim();
    var separatorColor = rootStyle.getPropertyValue("--separator-color").trim();

    /* 03.02. Resize */
    var subHiddenBreakpoint = 1440;
    var searchHiddenBreakpoint = 768;
    var menuHiddenBreakpoint = 768;

    function onResize() {
      var windowHeight = $(window).outerHeight();
      var windowWidth = $(window).outerWidth();
      var navbarHeight = $(".navbar").outerHeight();

      var submenuMargin = parseInt(
        $(".sub-menu .scroll").css("margin-top"),
        10
      );

      if ($(".chat-app .scroll").length > 0 && chatAppScroll) {
        $(".chat-app .scroll").scrollTop(
          $(".chat-app .scroll").prop("scrollHeight")
        );
        chatAppScroll.update();
      }

      if (windowWidth < menuHiddenBreakpoint) {
        $("#app-container").addClass("menu-mobile");
      } else if (windowWidth < subHiddenBreakpoint) {
        $("#app-container").removeClass("menu-mobile");
        if ($("#app-container").hasClass("menu-default")) {
          $("#app-container").removeClass(allMenuClassNames);
          $("#app-container").addClass("menu-default menu-sub-hidden");
        }
      } else {
        $("#app-container").removeClass("menu-mobile");
        if (
          $("#app-container").hasClass("menu-default") &&
          $("#app-container").hasClass("menu-sub-hidden")
        ) {
          $("#app-container").removeClass("menu-sub-hidden");
        }
      }

      setMenuClassNames(0, true);
    }

    function setDirection() {
      if (typeof Storage !== "undefined") {
        if (localStorage.getItem("dore-direction")) {
          direction = localStorage.getItem("dore-direction");
        }
        isRtl = direction == "rtl" && true;
      }
    }

    $(window).on("resize", function (event) {
      if (event.originalEvent.isTrusted) {
        onResize();
      }
    });
    onResize();

    /* 03.03. Search */
    function searchIconClick() {
      if ($(window).outerWidth() < searchHiddenBreakpoint) {
        if ($(".search").hasClass("mobile-view")) {
          $(".search").removeClass("mobile-view");
          navigateToSearchPage();
        } else {
          $(".search").addClass("mobile-view");
          $(".search input").focus();
        }
      } else {
        navigateToSearchPage();
      }
    }

    $(".search .search-icon").on("click", function () {
      searchIconClick();
    });

    $(".search input").on("keyup", function (e) {
      if (e.which == 13) {
        navigateToSearchPage();
      }
      if (e.which == 27) {
        hideSearchArea();
      }
    });

    function navigateToSearchPage() {
      var inputVal = $(".search input").val();
      var searchPath = $(".search").data("searchPath");
      if (inputVal != "") {
        $(".search input").val("");
        window.location.href = searchPath + inputVal;
      }
    }

    function hideSearchArea() {
      if ($(".search").hasClass("mobile-view")) {
        $(".search").removeClass("mobile-view");
        $(".search input").val("");
      }
    }

    $(document).on("click", function (event) {
      if (
        !$(event.target)
          .parents()
          .hasClass("search")
      ) {
        hideSearchArea();
      }
    });

    /* 03.04. Shift Selectable Init */
    $shiftSelect = $(".list").shiftSelectable();

    /* 03.05. Menu */
    var menuClickCount = 0;
    var allMenuClassNames = "menu-default menu-hidden sub-hidden main-hidden menu-sub-hidden main-show-temporary sub-show-temporary menu-mobile";
    function setMenuClassNames(clickIndex, calledFromResize, link) {
      menuClickCount = clickIndex;
      var container = $("#app-container");
      if (container.length == 0) {
        return;
      }

      var link = link || getActiveMainMenuLink();

      //menu-default no subpage
      if (
        $(".sub-menu ul[data-link='" + link + "']").length == 0 &&
        (menuClickCount == 2 || calledFromResize)
        ) {
          if ($(window).outerWidth() >= menuHiddenBreakpoint) {
            if (isClassIncludedApp("menu-default")) {
              if (calledFromResize) {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-default menu-sub-hidden sub-hidden");
              menuClickCount = 0; // This one should be changed from 1 to 0
            } else {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-default main-hidden menu-sub-hidden sub-hidden");
              menuClickCount = 0;
            }
            resizeCarousel();
            return;
          }
        }
      }

      //menu-sub-hidden no subpage
      if (
        $(".sub-menu ul[data-link='" + link + "']").length == 0 &&
        (menuClickCount == 1 || calledFromResize)
      ) {
        if ($(window).outerWidth() >= menuHiddenBreakpoint) {
          if (isClassIncludedApp("menu-sub-hidden")) {
            if (calledFromResize) {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-sub-hidden sub-hidden");
              menuClickCount = 0;
            } else {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-sub-hidden main-hidden sub-hidden");
              menuClickCount = -1;
            }
            resizeCarousel();
            return;
          }
        }
      }

      //menu-hidden no subpage
      if (
        $(".sub-menu ul[data-link='" + link + "']").length == 0 &&
        (menuClickCount == 1 || calledFromResize)
      ) {
        if ($(window).outerWidth() >= menuHiddenBreakpoint) {
          if (isClassIncludedApp("menu-hidden")) {
            if (calledFromResize) {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-hidden main-hidden sub-hidden");
              menuClickCount = 0;
            } else {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-hidden main-show-temporary");
              menuClickCount = 3;
            }
            resizeCarousel();
            return;
          }
        }
      }

      if (clickIndex % 4 == 0) {
        if (isClassIncludedApp("menu-main-hidden")) {
          nextClasses = "menu-main-hidden";
        } else if (
          isClassIncludedApp("menu-default") &&
          isClassIncludedApp("menu-sub-hidden")
        ) {
          nextClasses = "menu-default menu-sub-hidden";
        } else if (isClassIncludedApp("menu-default")) {
          nextClasses = "menu-default";
        } else if (isClassIncludedApp("menu-sub-hidden")) {
          nextClasses = "menu-sub-hidden";
        } else if (isClassIncludedApp("menu-hidden")) {
          nextClasses = "menu-hidden";
        }
        menuClickCount = 0;
      } else if (clickIndex % 4 == 1) {
        if (
          isClassIncludedApp("menu-default") &&
          isClassIncludedApp("menu-sub-hidden")
        ) {
          nextClasses = "menu-default menu-sub-hidden main-hidden sub-hidden";
        } else if (isClassIncludedApp("menu-default")) {
          nextClasses = "menu-default sub-hidden";
        } else if (isClassIncludedApp("menu-main-hidden")) {
          nextClasses = "menu-main-hidden menu-hidden";
        } else if (isClassIncludedApp("menu-sub-hidden")) {
          nextClasses = "menu-sub-hidden main-hidden sub-hidden";
        } else if (isClassIncludedApp("menu-hidden")) {
          nextClasses = "menu-hidden main-show-temporary";
        }
      } else if (clickIndex % 4 == 2) {
        if (isClassIncludedApp("menu-main-hidden") && isClassIncludedApp("menu-hidden")) {
          nextClasses = "menu-main-hidden";
        } else if (
          isClassIncludedApp("menu-default") &&
          isClassIncludedApp("menu-sub-hidden")
        ) {
          nextClasses = "menu-default menu-sub-hidden sub-hidden";
        } else if (isClassIncludedApp("menu-default")) {
          nextClasses = "menu-default main-hidden sub-hidden";
        } else if (isClassIncludedApp("menu-sub-hidden")) {
          nextClasses = "menu-sub-hidden sub-hidden";
        } else if (isClassIncludedApp("menu-hidden")) {
          nextClasses = "menu-hidden main-show-temporary sub-show-temporary";
        }
      } else if (clickIndex % 4 == 3) {
        if (isClassIncludedApp("menu-main-hidden")) {
          nextClasses = "menu-main-hidden menu-hidden";
        }
        else if (
          isClassIncludedApp("menu-default") &&
          isClassIncludedApp("menu-sub-hidden")
        ) {
          nextClasses = "menu-default menu-sub-hidden sub-show-temporary";
        } else if (isClassIncludedApp("menu-default")) {
          nextClasses = "menu-default sub-hidden";
        } else if (isClassIncludedApp("menu-sub-hidden")) {
          nextClasses = "menu-sub-hidden sub-show-temporary";
        } else if (isClassIncludedApp("menu-hidden")) {
          nextClasses = "menu-hidden main-show-temporary";
        }
      }
      if (isClassIncludedApp("menu-mobile")) {
        nextClasses += " menu-mobile";
      }
      container.removeClass(allMenuClassNames);
      container.addClass(nextClasses);
      resizeCarousel();
    }
    $(".menu-button").on("click", function (event) {
      event.preventDefault();
      // event.stopPropagation();
      setMenuClassNames(++menuClickCount);
    });

    $(".menu-button-mobile").on("click", function (event) {
      event.preventDefault();
      // event.stopPropagation();
      $("#app-container")
        .removeClass("sub-show-temporary")
        .toggleClass("main-show-temporary");
      return false;
    });

    $(".main-menu").on("click", "a", function (event) {
      event.preventDefault();
      // event.stopPropagation();
      var link = $(this)
        .attr("href")
        .replace("#", "");
      if ($(".sub-menu ul[data-link='" + link + "']").length == 0) {
        var target = $(this).attr("target");
        if ($(this).attr("target") == null) {
          window.open(link, "_self");
        } else {
          window.open(link, target);
        }
        return;
      }

      showSubMenu($(this).attr("href"));
      var container = $("#app-container");
      if (!$("#app-container").hasClass("menu-mobile")) {
        if (
          $("#app-container").hasClass("menu-sub-hidden") &&
          (menuClickCount == 2 || menuClickCount == 0)
        ) {
          setMenuClassNames(3, false, link);
        } else if (
          $("#app-container").hasClass("menu-hidden") &&
          (menuClickCount == 1 || menuClickCount == 3)
        ) {
          setMenuClassNames(2, false, link);
        } else if (
          $("#app-container").hasClass("menu-default") &&
          !$("#app-container").hasClass("menu-sub-hidden") &&
          (menuClickCount == 1 || menuClickCount == 3)
        ) {
          setMenuClassNames(0, false, link);
        }
      } else {
        $("#app-container").addClass("sub-show-temporary");
      }
      return false;
    });

    $(document).on("click", function (event) {
      if (
        !(
          $(event.target)
            .parents()
            .hasClass("menu-button") ||
          $(event.target).hasClass("menu-button") ||
          $(event.target)
            .parents()
          //   .hasClass("menu-button-mobile") ||
          // $(event.target).hasClass("menu-button-mobile") ||
          // $(event.target)
          //   .parents()
            .hasClass("sidebar") ||
          $(event.target).hasClass("sidebar")
        )
      ) {
        // Prevent sub menu closing on collapse click 
        if ($(event.target).parents("a[data-toggle='collapse']").length > 0 || $(event.target).attr("data-toggle") == 'collapse') {
          return;
        }
        if (
          $("#app-container").hasClass("menu-sub-hidden") &&
          menuClickCount == 3
        ) {
          var link = getActiveMainMenuLink();
          if (link == lastActiveSubmenu) {
            setMenuClassNames(2);
          } else {
            setMenuClassNames(0);
          }
        } else if ($("#app-container").hasClass("menu-main-hidden") && $("#app-container").hasClass("menu-mobile")) {
          setMenuClassNames(0);
        } else if (
          $("#app-container").hasClass("menu-hidden") ||
          $("#app-container").hasClass("menu-mobile")
        ) {
          setMenuClassNames(0);
        }
      }
    });

    function getActiveMainMenuLink() {
      var dataLink = $(".main-menu ul li.active a").attr("href");
      return dataLink ? dataLink.replace("#", "") : "";
    }

    function isClassIncludedApp(className) {
      var container = $("#app-container");
      var currentClasses = container
        .attr("class")
        .split(" ")
        .filter(function (x) {
          return x != "";
        });
      return currentClasses.includes(className);
    }

    var lastActiveSubmenu = "";
    function showSubMenu(dataLink) {
      if ($(".main-menu").length == 0) {
        return;
      }

      var link = dataLink ? dataLink.replace("#", "") : "";
      if ($(".sub-menu ul[data-link='" + link + "']").length == 0) {
        $("#app-container").removeClass("sub-show-temporary");

        if ($("#app-container").length == 0) {
          return;
        }

        if (
          isClassIncludedApp("menu-sub-hidden") ||
          isClassIncludedApp("menu-hidden")
        ) {
          menuClickCount = 0;
        } else {
          menuClickCount = 1;
        }
        $("#app-container").addClass("sub-hidden");
        noTransition();
        return;
      }
      if (link == lastActiveSubmenu) {
        return;
      }
      $(".sub-menu ul").fadeOut(0);
      $(".sub-menu ul[data-link='" + link + "']").slideDown(100);

      $(".sub-menu .scroll").scrollTop(0);
      lastActiveSubmenu = link;
    }

    function noTransition() {
      $(".sub-menu").addClass("no-transition");
      $("main").addClass("no-transition");
      setTimeout(function () {
        $(".sub-menu").removeClass("no-transition");
        $("main").removeClass("no-transition");
      }, 350);
    }

    showSubMenu($(".main-menu ul li.active a").attr("href"));

    function resizeCarousel() {
      setTimeout(function () {
        var event = document.createEvent("HTMLEvents");
        event.initEvent("resize", false, false);
        window.dispatchEvent(event);
      }, 350);
    }

    /* 03.06. App Menu */
    $(".app-menu-button").on("click", function (event) {
      event.preventDefault();
      if ($(".app-menu").hasClass("shown")) {
        $(".app-menu").removeClass("shown");
      } else {
        $(".app-menu").addClass("shown");
      }
    });

    $(document).on("click", function (event) {
      if (
        !(
          $(event.target)
            .parents()
            .hasClass("app-menu") ||
          $(event.target)
            .parents()
            .hasClass("app-menu-button") ||
          $(event.target).hasClass("app-menu-button") ||
          $(event.target).hasClass("app-menu")
        )
      ) {
        if ($(".app-menu").hasClass("shown")) {
          $(".app-menu").removeClass("shown");
        }
      }
    });

    /* 03.07. Survey App */
    $(document).on("click", ".question .view-button", function () {
      editViewClick($(this));
    });

    $(document).on("click", ".question .edit-button", function () {
      editViewClick($(this));
    });

    function editViewClick($this) {
      var $question = $($this.parents(".question"));
      $question.toggleClass("edit-quesiton");
      $question.toggleClass("view-quesiton");
      var $questionCollapse = $question.find(".question-collapse");
      if (!$questionCollapse.hasClass("show")) {
        $questionCollapse.collapse("toggle");
        $question.find(".rotate-icon-click").toggleClass("rotate");
      }
    }

    /* 03.08. Rotate Button */
    $(document).on("click", ".rotate-icon-click", function () {
      $(this).toggleClass("rotate");
    });

    /* 03.09. Charts */
    if (typeof Chart !== "undefined") {
      Chart.defaults.global.defaultFontFamily = "'Nunito', sans-serif";

      Chart.defaults.LineWithShadow = Chart.defaults.line;
      Chart.controllers.LineWithShadow = Chart.controllers.line.extend({
        draw: function (ease) {
          Chart.controllers.line.prototype.draw.call(this, ease);
          var ctx = this.chart.ctx;
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.15)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 10;
          ctx.responsive = true;
          ctx.stroke();
          Chart.controllers.line.prototype.draw.apply(this, arguments);
          ctx.restore();
        }
      });

      Chart.defaults.BarWithShadow = Chart.defaults.bar;
      Chart.controllers.BarWithShadow = Chart.controllers.bar.extend({
        draw: function (ease) {
          Chart.controllers.bar.prototype.draw.call(this, ease);
          var ctx = this.chart.ctx;
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.15)";
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 10;
          ctx.responsive = true;
          Chart.controllers.bar.prototype.draw.apply(this, arguments);
          ctx.restore();
        }
      });

      Chart.defaults.LineWithLine = Chart.defaults.line;
      Chart.controllers.LineWithLine = Chart.controllers.line.extend({
        draw: function (ease) {
          Chart.controllers.line.prototype.draw.call(this, ease);
          if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
            var activePoint = this.chart.tooltip._active[0];
            var ctx = this.chart.ctx;
            var x = activePoint.tooltipPosition().x;
            var topY = this.chart.scales["y-axis-0"].top;
            var bottomY = this.chart.scales["y-axis-0"].bottom;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(0,0,0,0.1)";
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      Chart.defaults.DoughnutWithShadow = Chart.defaults.doughnut;
      Chart.controllers.DoughnutWithShadow = Chart.controllers.doughnut.extend({
        draw: function (ease) {
          Chart.controllers.doughnut.prototype.draw.call(this, ease);
          let ctx = this.chart.chart.ctx;
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.15)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 10;
          ctx.responsive = true;
          Chart.controllers.doughnut.prototype.draw.apply(this, arguments);
          ctx.restore();
        }
      });

      Chart.defaults.PieWithShadow = Chart.defaults.pie;
      Chart.controllers.PieWithShadow = Chart.controllers.pie.extend({
        draw: function (ease) {
          Chart.controllers.pie.prototype.draw.call(this, ease);
          let ctx = this.chart.chart.ctx;
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.15)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 10;
          ctx.responsive = true;
          Chart.controllers.pie.prototype.draw.apply(this, arguments);
          ctx.restore();
        }
      });

      Chart.defaults.ScatterWithShadow = Chart.defaults.scatter;
      Chart.controllers.ScatterWithShadow = Chart.controllers.scatter.extend({
        draw: function (ease) {
          Chart.controllers.scatter.prototype.draw.call(this, ease);
          let ctx = this.chart.chart.ctx;
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.2)";
          ctx.shadowBlur = 7;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 7;
          ctx.responsive = true;
          Chart.controllers.scatter.prototype.draw.apply(this, arguments);
          ctx.restore();
        }
      });

      Chart.defaults.RadarWithShadow = Chart.defaults.radar;
      Chart.controllers.RadarWithShadow = Chart.controllers.radar.extend({
        draw: function (ease) {
          Chart.controllers.radar.prototype.draw.call(this, ease);
          let ctx = this.chart.chart.ctx;
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.2)";
          ctx.shadowBlur = 7;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 7;
          ctx.responsive = true;
          Chart.controllers.radar.prototype.draw.apply(this, arguments);
          ctx.restore();
        }
      });

      Chart.defaults.PolarWithShadow = Chart.defaults.polarArea;
      Chart.controllers.PolarWithShadow = Chart.controllers.polarArea.extend({
        draw: function (ease) {
          Chart.controllers.polarArea.prototype.draw.call(this, ease);
          let ctx = this.chart.chart.ctx;
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.2)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 10;
          ctx.responsive = true;
          Chart.controllers.polarArea.prototype.draw.apply(this, arguments);
          ctx.restore();
        }
      });

      var chartTooltip = {
        backgroundColor: foregroundColor,
        titleFontColor: primaryColor,
        borderColor: separatorColor,
        borderWidth: 0.5,
        bodyFontColor: primaryColor,
        bodySpacing: 10,
        xPadding: 15,
        yPadding: 15,
        cornerRadius: 0.15,
        displayColors: false
      };

      if (document.getElementById("visitChartFull")) {
        var visitChartFull = document
          .getElementById("visitChartFull")
          .getContext("2d");
        var myChart = new Chart(visitChartFull, {
          type: "LineWithShadow",
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "Data",
                borderColor: themeColor1,
                pointBorderColor: themeColor1,
                pointBackgroundColor: themeColor1,
                pointHoverBackgroundColor: themeColor1,
                pointHoverBorderColor: themeColor1,
                pointRadius: 3,
                pointBorderWidth: 3,
                pointHoverRadius: 3,
                fill: true,
                backgroundColor: themeColor1_10,
                borderWidth: 2,
                data: [180, 140, 150, 120, 180, 110, 160],
                datalabels: {
                  align: "end",
                  anchor: "end"
                }
              }
            ]
          },
          options: {
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 40,
                bottom: 0
              }
            },
            plugins: {
              datalabels: {
                backgroundColor: "transparent",
                borderRadius: 30,
                borderWidth: 1,
                padding: 5,
                borderColor: function (context) {
                  return context.dataset.borderColor;
                },
                color: function (context) {
                  return context.dataset.borderColor;
                },
                font: {
                  weight: "bold",
                  size: 10
                },
                formatter: Math.round
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            tooltips: chartTooltip,
            scales: {
              yAxes: [
                {
                  ticks: {
                    min: 0
                  },
                  display: false
                }
              ],
              xAxes: [
                {
                  ticks: {
                    min: 0
                  },
                  display: false
                }
              ]
            }
          }
        });
      }

      if (document.getElementById("visitChart")) {
        var visitChart = document.getElementById("visitChart").getContext("2d");
        var myChart = new Chart(visitChart, {
          type: "LineWithShadow",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)",
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 5,
                    min: 50,
                    max: 70,
                    padding: 0
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            },
            legend: {
              display: false
            },
            tooltips: chartTooltip
          },
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "",
                data: [54, 63, 60, 65, 60, 68, 60],
                borderColor: themeColor1,
                pointBackgroundColor: foregroundColor,
                pointBorderColor: themeColor1,
                pointHoverBackgroundColor: themeColor1,
                pointHoverBorderColor: foregroundColor,
                pointRadius: 4,
                pointBorderWidth: 2,
                pointHoverRadius: 5,
                fill: true,
                borderWidth: 2,
                backgroundColor: themeColor1_10
              }
            ]
          }
        });
      }

      if (document.getElementById("conversionChart")) {
        var conversionChart = document
          .getElementById("conversionChart")
          .getContext("2d");
        var myChart = new Chart(conversionChart, {
          type: "LineWithShadow",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)",
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 5,
                    min: 50,
                    max: 70,
                    padding: 0
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            },
            legend: {
              display: false
            },
            tooltips: chartTooltip
          },
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "",
                data: [65, 60, 68, 54, 63, 60, 60],
                borderColor: themeColor2,
                pointBackgroundColor: foregroundColor,
                pointBorderColor: themeColor2,
                pointHoverBackgroundColor: themeColor2,
                pointHoverBorderColor: foregroundColor,
                pointRadius: 4,
                pointBorderWidth: 2,
                pointHoverRadius: 5,
                fill: true,
                borderWidth: 2,
                backgroundColor: themeColor2_10
              }
            ]
          }
        });
      }

      var smallChartOptions = {
        layout: {
          padding: {
            left: 5,
            right: 5,
            top: 10,
            bottom: 10
          }
        },
        plugins: {
          datalabels: {
            display: false
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          intersect: false,
          enabled: false,
          custom: function (tooltipModel) {
            if (tooltipModel && tooltipModel.dataPoints) {
              var $textContainer = $(this._chart.canvas.offsetParent);
              var yLabel = tooltipModel.dataPoints[0].yLabel;
              var xLabel = tooltipModel.dataPoints[0].xLabel;
              var label = tooltipModel.body[0].lines[0].split(":")[0];
              $textContainer.find(".value").html("$" + $.fn.addCommas(yLabel));
              $textContainer.find(".label").html(label + "-" + xLabel);
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              display: false
            }
          ],
          xAxes: [
            {
              display: false
            }
          ]
        }
      };

      var smallChartInit = {
        afterInit: function (chart, options) {
          var $textContainer = $(chart.canvas.offsetParent);
          var yLabel = chart.data.datasets[0].data[0];
          var xLabel = chart.data.labels[0];
          var label = chart.data.datasets[0].label;
          $textContainer.find(".value").html("$" + $.fn.addCommas(yLabel));
          $textContainer.find(".label").html(label + "-" + xLabel);
        }
      };

      if (document.getElementById("smallChart1")) {
        var smallChart1 = document
          .getElementById("smallChart1")
          .getContext("2d");
        var myChart = new Chart(smallChart1, {
          type: "LineWithLine",
          plugins: [smallChartInit],
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "Total Orders",
                borderColor: themeColor1,
                pointBorderColor: themeColor1,
                pointHoverBackgroundColor: themeColor1,
                pointHoverBorderColor: themeColor1,
                pointRadius: 2,
                pointBorderWidth: 3,
                pointHoverRadius: 2,
                fill: false,
                borderWidth: 2,
                data: [1250, 1300, 1550, 921, 1810, 1106, 1610],
                datalabels: {
                  align: "end",
                  anchor: "end"
                }
              }
            ]
          },
          options: smallChartOptions
        });
      }

      if (document.getElementById("smallChart2")) {
        var smallChart2 = document
          .getElementById("smallChart2")
          .getContext("2d");
        var myChart = new Chart(smallChart2, {
          type: "LineWithLine",
          plugins: [smallChartInit],
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "Pending Orders",
                borderColor: themeColor1,
                pointBorderColor: themeColor1,
                pointHoverBackgroundColor: themeColor1,
                pointHoverBorderColor: themeColor1,
                pointRadius: 2,
                pointBorderWidth: 3,
                pointHoverRadius: 2,
                fill: false,
                borderWidth: 2,
                data: [115, 120, 300, 222, 105, 85, 36],
                datalabels: {
                  align: "end",
                  anchor: "end"
                }
              }
            ]
          },
          options: smallChartOptions
        });
      }

      if (document.getElementById("smallChart3")) {
        var smallChart3 = document
          .getElementById("smallChart3")
          .getContext("2d");
        var myChart = new Chart(smallChart3, {
          type: "LineWithLine",
          plugins: [smallChartInit],
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "Active Orders",
                borderColor: themeColor1,
                pointBorderColor: themeColor1,
                pointHoverBackgroundColor: themeColor1,
                pointHoverBorderColor: themeColor1,
                pointRadius: 2,
                pointBorderWidth: 3,
                pointHoverRadius: 2,
                fill: false,
                borderWidth: 2,
                data: [350, 452, 762, 952, 630, 85, 158],
                datalabels: {
                  align: "end",
                  anchor: "end"
                }
              }
            ]
          },
          options: smallChartOptions
        });
      }

      if (document.getElementById("smallChart4")) {
        var smallChart4 = document
          .getElementById("smallChart4")
          .getContext("2d");
        var myChart = new Chart(smallChart4, {
          type: "LineWithLine",
          plugins: [smallChartInit],
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "Shipped Orders",
                borderColor: themeColor1,
                pointBorderColor: themeColor1,
                pointHoverBackgroundColor: themeColor1,
                pointHoverBorderColor: themeColor1,
                pointRadius: 2,
                pointBorderWidth: 3,
                pointHoverRadius: 2,
                fill: false,
                borderWidth: 2,
                data: [200, 452, 250, 630, 125, 85, 20],
                datalabels: {
                  align: "end",
                  anchor: "end"
                }
              }
            ]
          },
          options: smallChartOptions
        });
      }

      if (document.getElementById("salesChart")) {
        var salesChart = document.getElementById("salesChart").getContext("2d");
        var myChart = new Chart(salesChart, {
          type: "LineWithShadow",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)",
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 5,
                    min: 50,
                    max: 70,
                    padding: 20
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            },
            legend: {
              display: false
            },
            tooltips: chartTooltip
          },
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "",
                data: [54, 63, 60, 65, 60, 68, 60],
                borderColor: themeColor1,
                pointBackgroundColor: foregroundColor,
                pointBorderColor: themeColor1,
                pointHoverBackgroundColor: themeColor1,
                pointHoverBorderColor: foregroundColor,
                pointRadius: 6,
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                fill: false
              }
            ]
          }
        });
      }

      if (document.getElementById("areaChart")) {
        var areaChart = document.getElementById("areaChart").getContext("2d");
        var myChart = new Chart(areaChart, {
          type: "LineWithShadow",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)",
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 5,
                    min: 50,
                    max: 70,
                    padding: 0
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            },
            legend: {
              display: false
            },
            tooltips: chartTooltip
          },
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "",
                data: [54, 63, 60, 65, 60, 68, 60],
                borderColor: themeColor1,
                pointBackgroundColor: foregroundColor,
                pointBorderColor: themeColor1,
                pointHoverBackgroundColor: themeColor1,
                pointHoverBorderColor: foregroundColor,
                pointRadius: 4,
                pointBorderWidth: 2,
                pointHoverRadius: 5,
                fill: true,
                borderWidth: 2,
                backgroundColor: themeColor1_10
              }
            ]
          }
        });
      }

      if (document.getElementById("areaChartNoShadow")) {
        var areaChartNoShadow = document
          .getElementById("areaChartNoShadow")
          .getContext("2d");
        var myChart = new Chart(areaChartNoShadow, {
          type: "line",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)",
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 5,
                    min: 50,
                    max: 70,
                    padding: 0
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            },
            legend: {
              display: false
            },
            tooltips: chartTooltip
          },
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "",
                data: [54, 63, 60, 65, 60, 68, 60],
                borderColor: themeColor1,
                pointBackgroundColor: foregroundColor,
                pointBorderColor: themeColor1,
                pointHoverBackgroundColor: themeColor1,
                pointHoverBorderColor: foregroundColor,
                pointRadius: 4,
                pointBorderWidth: 2,
                pointHoverRadius: 5,
                fill: true,
                borderWidth: 2,
                backgroundColor: themeColor1_10
              }
            ]
          }
        });
      }

      if (document.getElementById("scatterChart")) {
        var scatterChart = document
          .getElementById("scatterChart")
          .getContext("2d");
        var myChart = new Chart(scatterChart, {
          type: "ScatterWithShadow",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)",
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 20,
                    min: -80,
                    max: 80,
                    padding: 20
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)"
                  }
                }
              ]
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          },
          data: {
            datasets: [
              {
                borderWidth: 2,
                label: "Cakes",
                borderColor: themeColor1,
                backgroundColor: themeColor1_10,
                data: [
                  { x: 62, y: -78 },
                  { x: -0, y: 74 },
                  { x: -67, y: 45 },
                  { x: -26, y: -43 },
                  { x: -15, y: -30 },
                  { x: 65, y: -68 },
                  { x: -28, y: -61 }
                ]
              },
              {
                borderWidth: 2,
                label: "Desserts",
                borderColor: themeColor2,
                backgroundColor: themeColor2_10,
                data: [
                  { x: 79, y: 62 },
                  { x: 62, y: 0 },
                  { x: -76, y: -81 },
                  { x: -51, y: 41 },
                  { x: -9, y: 9 },
                  { x: 72, y: -37 },
                  { x: 62, y: -26 }
                ]
              }
            ]
          }
        });
      }

      if (document.getElementById("scatterChartNoShadow")) {
        var scatterChartNoShadow = document
          .getElementById("scatterChartNoShadow")
          .getContext("2d");
        var myChart = new Chart(scatterChartNoShadow, {
          type: "scatter",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)",
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 20,
                    min: -80,
                    max: 80,
                    padding: 20
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)"
                  }
                }
              ]
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          },
          data: {
            datasets: [
              {
                borderWidth: 2,
                label: "Cakes",
                borderColor: themeColor1,
                backgroundColor: themeColor1_10,
                data: [
                  { x: 62, y: -78 },
                  { x: -0, y: 74 },
                  { x: -67, y: 45 },
                  { x: -26, y: -43 },
                  { x: -15, y: -30 },
                  { x: 65, y: -68 },
                  { x: -28, y: -61 }
                ]
              },
              {
                borderWidth: 2,
                label: "Desserts",
                borderColor: themeColor2,
                backgroundColor: themeColor2_10,
                data: [
                  { x: 79, y: 62 },
                  { x: 62, y: 0 },
                  { x: -76, y: -81 },
                  { x: -51, y: 41 },
                  { x: -9, y: 9 },
                  { x: 72, y: -37 },
                  { x: 62, y: -26 }
                ]
              }
            ]
          }
        });
      }

      if (document.getElementById("radarChartNoShadow")) {
        var radarChartNoShadow = document
          .getElementById("radarChartNoShadow")
          .getContext("2d");
        var myChart = new Chart(radarChartNoShadow, {
          type: "radar",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scale: {
              ticks: {
                display: false
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          },
          data: {
            datasets: [
              {
                label: "Stock",
                borderWidth: 2,
                pointBackgroundColor: themeColor1,
                borderColor: themeColor1,
                backgroundColor: themeColor1_10,
                data: [80, 90, 70]
              },
              {
                label: "Order",
                borderWidth: 2,
                pointBackgroundColor: themeColor2,
                borderColor: themeColor2,
                backgroundColor: themeColor2_10,
                data: [68, 80, 95]
              }
            ],
            labels: ["Cakes", "Desserts", "Cupcakes"]
          }
        });
      }

      if (document.getElementById("radarChart")) {
        var radarChart = document.getElementById("radarChart").getContext("2d");
        var myChart = new Chart(radarChart, {
          type: "RadarWithShadow",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scale: {
              ticks: {
                display: false
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          },
          data: {
            datasets: [
              {
                label: "Stock",
                borderWidth: 2,
                pointBackgroundColor: themeColor1,
                borderColor: themeColor1,
                backgroundColor: themeColor1_10,
                data: [80, 90, 70]
              },
              {
                label: "Order",
                borderWidth: 2,
                pointBackgroundColor: themeColor2,
                borderColor: themeColor2,
                backgroundColor: themeColor2_10,
                data: [68, 80, 95]
              }
            ],
            labels: ["Cakes", "Desserts", "Cupcakes"]
          }
        });
      }

      if (document.getElementById("polarChart")) {
        var polarChart = document.getElementById("polarChart").getContext("2d");
        var myChart = new Chart(polarChart, {
          type: "PolarWithShadow",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scale: {
              ticks: {
                display: false
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          },
          data: {
            datasets: [
              {
                label: "Stock",
                borderWidth: 2,
                pointBackgroundColor: themeColor1,
                borderColor: [themeColor1, themeColor2, themeColor3],
                backgroundColor: [
                  themeColor1_10,
                  themeColor2_10,
                  themeColor3_10
                ],
                data: [80, 90, 50]
              }
            ],
            labels: ["Cakes", "Desserts", "Cupcakes"]
          }
        });
      }

      if (document.getElementById("polarChartNoShadow")) {
        var polarChartNoShadow = document
          .getElementById("polarChartNoShadow")
          .getContext("2d");
        var myChart = new Chart(polarChartNoShadow, {
          type: "polarArea",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scale: {
              ticks: {
                display: false
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          },
          data: {
            datasets: [
              {
                label: "Stock",
                borderWidth: 2,
                pointBackgroundColor: themeColor1,
                borderColor: [themeColor1, themeColor2, themeColor3],
                backgroundColor: [
                  themeColor1_10,
                  themeColor2_10,
                  themeColor3_10
                ],
                data: [80, 90, 70]
              }
            ],
            labels: ["Cakes", "Desserts", "Cupcakes"]
          }
        });
      }

      if (document.getElementById("salesChartNoShadow")) {
        var salesChartNoShadow = document
          .getElementById("salesChartNoShadow")
          .getContext("2d");
        var myChart = new Chart(salesChartNoShadow, {
          type: "line",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)",
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 5,
                    min: 50,
                    max: 70,
                    padding: 20
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            },
            legend: {
              display: false
            },
            tooltips: chartTooltip
          },
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "",
                data: [54, 63, 60, 65, 60, 68, 60],
                borderColor: themeColor1,
                pointBackgroundColor: foregroundColor,
                pointBorderColor: themeColor1,
                pointHoverBackgroundColor: themeColor1,
                pointHoverBorderColor: foregroundColor,
                pointRadius: 6,
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                fill: false
              }
            ]
          }
        });
      }

      if (document.getElementById("productChart")) {
        var productChart = document
          .getElementById("productChart")
          .getContext("2d");
        var myChart = new Chart(productChart, {
          type: "BarWithShadow",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)",
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 100,
                    min: 300,
                    max: 800,
                    padding: 20
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          },
          data: {
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                label: "Cakes",
                borderColor: themeColor1,
                backgroundColor: themeColor1_10,
                data: [456, 479, 324, 569, 702, 600],
                borderWidth: 2
              },
              {
                label: "Desserts",
                borderColor: themeColor2,
                backgroundColor: themeColor2_10,
                data: [364, 504, 605, 400, 345, 320],
                borderWidth: 2
              }
            ]
          }
        });
      }

      if (document.getElementById("productChartNoShadow")) {
        var productChartNoShadow = document
          .getElementById("productChartNoShadow")
          .getContext("2d");
        var myChart = new Chart(productChartNoShadow, {
          type: "bar",
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: "rgba(0,0,0,0.1)",
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 100,
                    min: 300,
                    max: 800,
                    padding: 20
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          },
          data: {
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                label: "Cakes",
                borderColor: themeColor1,
                backgroundColor: themeColor1_10,
                data: [456, 479, 324, 569, 702, 600],
                borderWidth: 2
              },
              {
                label: "Desserts",
                borderColor: themeColor2,
                backgroundColor: themeColor2_10,
                data: [364, 504, 605, 400, 345, 320],
                borderWidth: 2
              }
            ]
          }
        });
      }

      var contributionChartOptions = {
        type: "LineWithShadow",
        options: {
          plugins: {
            datalabels: {
              display: false
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                gridLines: {
                  display: true,
                  lineWidth: 1,
                  color: "rgba(0,0,0,0.1)",
                  drawBorder: false
                },
                ticks: {
                  beginAtZero: true,
                  stepSize: 5,
                  min: 50,
                  max: 70,
                  padding: 20
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                  display: false
                }
              }
            ]
          },
          legend: {
            display: false
          },
          tooltips: chartTooltip
        },
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          datasets: [
            {
              borderWidth: 2,
              label: "",
              data: [54, 63, 60, 65, 60, 68, 60, 63, 60, 65, 60, 68],
              borderColor: themeColor1,
              pointBackgroundColor: foregroundColor,
              pointBorderColor: themeColor1,
              pointHoverBackgroundColor: themeColor1,
              pointHoverBorderColor: foregroundColor,
              pointRadius: 4,
              pointBorderWidth: 2,
              pointHoverRadius: 5,
              fill: false
            }
          ]
        }
      };

      if (document.getElementById("contributionChart1")) {
        var contributionChart1 = new Chart(
          document.getElementById("contributionChart1").getContext("2d"),
          contributionChartOptions
        );
      }

      if (document.getElementById("contributionChart2")) {
        var contributionChart2 = new Chart(
          document.getElementById("contributionChart2").getContext("2d"),
          contributionChartOptions
        );
      }

      if (document.getElementById("contributionChart3")) {
        var contributionChart3 = new Chart(
          document.getElementById("contributionChart3").getContext("2d"),
          contributionChartOptions
        );
      }

      var centerTextPlugin = {
        afterDatasetsUpdate: function (chart) { },
        beforeDraw: function (chart) {
          var width = chart.chartArea.right;
          var height = chart.chartArea.bottom;
          var ctx = chart.chart.ctx;
          ctx.restore();

          var activeLabel = chart.data.labels[0];
          var activeValue = chart.data.datasets[0].data[0];
          var dataset = chart.data.datasets[0];
          var meta = dataset._meta[Object.keys(dataset._meta)[0]];
          var total = meta.total;

          var activePercentage = parseFloat(
            ((activeValue / total) * 100).toFixed(1)
          );
          activePercentage = chart.legend.legendItems[0].hidden
            ? 0
            : activePercentage;

          if (chart.pointAvailable) {
            activeLabel = chart.data.labels[chart.pointIndex];
            activeValue =
              chart.data.datasets[chart.pointDataIndex].data[chart.pointIndex];

            dataset = chart.data.datasets[chart.pointDataIndex];
            meta = dataset._meta[Object.keys(dataset._meta)[0]];
            total = meta.total;
            activePercentage = parseFloat(
              ((activeValue / total) * 100).toFixed(1)
            );
            activePercentage = chart.legend.legendItems[chart.pointIndex].hidden
              ? 0
              : activePercentage;
          }

          ctx.font = "36px" + " Nunito, sans-serif";
          ctx.fillStyle = primaryColor;
          ctx.textBaseline = "middle";

          var text = activePercentage + "%",
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;
          ctx.fillText(text, textX, textY);

          ctx.font = "14px" + " Nunito, sans-serif";
          ctx.textBaseline = "middle";

          var text2 = activeLabel,
            textX = Math.round((width - ctx.measureText(text2).width) / 2),
            textY = height / 2 - 30;
          ctx.fillText(text2, textX, textY);

          ctx.save();
        },
        beforeEvent: function (chart, event, options) {
          var firstPoint = chart.getElementAtEvent(event)[0];

          if (firstPoint) {
            chart.pointIndex = firstPoint._index;
            chart.pointDataIndex = firstPoint._datasetIndex;
            chart.pointAvailable = true;
          }
        }
      };

      if (document.getElementById("categoryChart")) {
        var categoryChart = document.getElementById("categoryChart");
        var myDoughnutChart = new Chart(categoryChart, {
          plugins: [centerTextPlugin],
          type: "DoughnutWithShadow",
          data: {
            labels: ["Cakes", "Cupcakes", "Desserts"],
            datasets: [
              {
                label: "",
                borderColor: [themeColor3, themeColor2, themeColor1],
                backgroundColor: [
                  themeColor3_10,
                  themeColor2_10,
                  themeColor1_10
                ],
                borderWidth: 2,
                data: [15, 25, 20]
              }
            ]
          },
          draw: function () { },
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 80,
            title: {
              display: false
            },
            layout: {
              padding: {
                bottom: 20
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          }
        });
      }

      if (document.getElementById("categoryChartNoShadow")) {
        var categoryChartNoShadow = document.getElementById(
          "categoryChartNoShadow"
        );
        var myDoughnutChart = new Chart(categoryChartNoShadow, {
          plugins: [centerTextPlugin],
          type: "doughnut",
          data: {
            labels: ["Cakes", "Cupcakes", "Desserts"],
            datasets: [
              {
                label: "",
                borderColor: [themeColor3, themeColor2, themeColor1],
                backgroundColor: [
                  themeColor3_10,
                  themeColor2_10,
                  themeColor1_10
                ],
                borderWidth: 2,
                data: [15, 25, 20]
              }
            ]
          },
          draw: function () { },
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 80,
            title: {
              display: false
            },
            layout: {
              padding: {
                bottom: 20
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          }
        });
      }

      if (document.getElementById("pieChartNoShadow")) {
        var pieChart = document.getElementById("pieChartNoShadow");
        var myChart = new Chart(pieChart, {
          type: "pie",
          data: {
            labels: ["Cakes", "Cupcakes", "Desserts"],
            datasets: [
              {
                label: "",
                borderColor: [themeColor1, themeColor2, themeColor3],
                backgroundColor: [
                  themeColor1_10,
                  themeColor2_10,
                  themeColor3_10
                ],
                borderWidth: 2,
                data: [15, 25, 20]
              }
            ]
          },
          draw: function () { },
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            title: {
              display: false
            },
            layout: {
              padding: {
                bottom: 20
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          }
        });
      }

      if (document.getElementById("pieChart")) {
        var pieChart = document.getElementById("pieChart");
        var myChart = new Chart(pieChart, {
          type: "PieWithShadow",
          data: {
            labels: ["Cakes", "Cupcakes", "Desserts"],
            datasets: [
              {
                label: "",
                borderColor: [themeColor1, themeColor2, themeColor3],
                backgroundColor: [
                  themeColor1_10,
                  themeColor2_10,
                  themeColor3_10
                ],
                borderWidth: 2,
                data: [15, 25, 20]
              }
            ]
          },
          draw: function () { },
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            title: {
              display: false
            },
            layout: {
              padding: {
                bottom: 20
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          }
        });
      }

      if (document.getElementById("frequencyChart")) {
        var frequencyChart = document.getElementById("frequencyChart");
        var myDoughnutChart = new Chart(frequencyChart, {
          plugins: [centerTextPlugin],
          type: "DoughnutWithShadow",
          data: {
            labels: ["Adding", "Editing", "Deleting"],
            datasets: [
              {
                label: "",
                borderColor: [themeColor1, themeColor2, themeColor3],
                backgroundColor: [
                  themeColor1_10,
                  themeColor2_10,
                  themeColor3_10
                ],
                borderWidth: 2,
                data: [15, 25, 20]
              }
            ]
          },
          draw: function () { },
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 80,
            title: {
              display: false
            },
            layout: {
              padding: {
                bottom: 20
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          }
        });
      }

      if (document.getElementById("ageChart")) {
        var ageChart = document.getElementById("ageChart");
        var myDoughnutChart = new Chart(ageChart, {
          plugins: [centerTextPlugin],
          type: "DoughnutWithShadow",
          data: {
            labels: ["12-24", "24-30", "30-40", "40-50", "50-60"],
            datasets: [
              {
                label: "",
                borderColor: [
                  themeColor1,
                  themeColor2,
                  themeColor3,
                  themeColor4,
                  themeColor5
                ],
                backgroundColor: [
                  themeColor1_10,
                  themeColor2_10,
                  themeColor3_10,
                  themeColor4_10,
                  themeColor5_10
                ],
                borderWidth: 2,
                data: [15, 25, 20, 30, 14]
              }
            ]
          },
          draw: function () { },
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 80,
            title: {
              display: false
            },
            layout: {
              padding: {
                bottom: 20
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          }
        });
      }

      if (document.getElementById("genderChart")) {
        var genderChart = document.getElementById("genderChart");
        var myDoughnutChart = new Chart(genderChart, {
          plugins: [centerTextPlugin],
          type: "DoughnutWithShadow",
          data: {
            labels: ["Male", "Female", "Other"],
            datasets: [
              {
                label: "",
                borderColor: [themeColor1, themeColor2, themeColor3],
                backgroundColor: [
                  themeColor1_10,
                  themeColor2_10,
                  themeColor3_10
                ],
                borderWidth: 2,
                data: [85, 45, 20]
              }
            ]
          },
          draw: function () { },
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 80,
            title: {
              display: false
            },
            layout: {
              padding: {
                bottom: 20
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          }
        });
      }

      if (document.getElementById("workChart")) {
        var workChart = document.getElementById("workChart");
        var myDoughnutChart = new Chart(workChart, {
          plugins: [centerTextPlugin],
          type: "DoughnutWithShadow",
          data: {
            labels: [
              "Employed for wages",
              "Self-employed",
              "Looking for work",
              "Retired"
            ],
            datasets: [
              {
                label: "",
                borderColor: [
                  themeColor1,
                  themeColor2,
                  themeColor3,
                  themeColor4
                ],
                backgroundColor: [
                  themeColor1_10,
                  themeColor2_10,
                  themeColor3_10,
                  themeColor4_10
                ],
                borderWidth: 2,
                data: [15, 25, 20, 8]
              }
            ]
          },
          draw: function () { },
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 80,
            title: {
              display: false
            },
            layout: {
              padding: {
                bottom: 20
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          }
        });
      }

      if (document.getElementById("codingChart")) {
        var codingChart = document.getElementById("codingChart");
        var myDoughnutChart = new Chart(codingChart, {
          plugins: [centerTextPlugin],
          type: "DoughnutWithShadow",
          data: {
            labels: ["Python", "JavaScript", "PHP", "Java", "C#"],
            datasets: [
              {
                label: "",
                borderColor: [
                  themeColor1,
                  themeColor2,
                  themeColor3,
                  themeColor4,
                  themeColor5
                ],
                backgroundColor: [
                  themeColor1_10,
                  themeColor2_10,
                  themeColor3_10,
                  themeColor4_10,
                  themeColor5_10
                ],
                borderWidth: 2,
                data: [15, 25, 20, 8, 25]
              }
            ]
          },
          draw: function () { },
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 80,
            title: {
              display: false
            },
            layout: {
              padding: {
                bottom: 20
              }
            },
            legend: {
              position: "bottom",
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            tooltips: chartTooltip
          }
        });
      }
    }

    /* 03.10. Calendar */
    if ($().fullCalendar) {
      var testEvent = new Date(new Date().setHours(new Date().getHours()));
      var day = testEvent.getDate();
      var month = testEvent.getMonth() + 1;
      $(".calendar").fullCalendar({
        themeSystem: "bootstrap4",
        height: "auto",
        isRTL: isRtl,
        buttonText: {
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          list: "List"
        },
        bootstrapFontAwesome: {
          prev: " simple-icon-arrow-left",
          next: " simple-icon-arrow-right",
          prevYear: " simple-icon-control-start",
          nextYear: " simple-icon-control-end"
        },
        events: [
          {
            title: "Account",
            start: "2018-05-18"
          },
          {
            title: "Delivery",
            start: "2019-07-22",
            end: "2019-07-24"
          },
          {
            title: "Conference",
            start: "2019-06-07",
            end: "2019-06-09"
          },
          {
            title: "Delivery",
            start: "2019-09-03",
            end: "2019-09-06"
          },
          {
            title: "Meeting",
            start: "2019-06-17",
            end: "2019-06-18"
          },
          {
            title: "Taxes",
            start: "2019-08-07",
            end: "2019-08-09"
          }
        ]
      });
    }

    /* 03.11. Datatable */
    if ($().DataTable) {
      $(".data-table-standard").DataTable({
        bLengthChange: false,
        searching: false,
        destroy: true,
        info: false,
        sDom: '<"row view-filter"<"col-sm-12"<"float-left"l><"float-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
        pageLength: 6,
        language: {
          paginate: {
            previous: "<i class='simple-icon-arrow-left'></i>",
            next: "<i class='simple-icon-arrow-right'></i>"
          }
        },
        drawCallback: function () {
          $($(".dataTables_wrapper .pagination li:first-of-type"))
            .find("a")
            .addClass("prev");
          $($(".dataTables_wrapper .pagination li:last-of-type"))
            .find("a")
            .addClass("next");

          $(".dataTables_wrapper .pagination").addClass("pagination-sm");
        }
      });

      $(".data-tables-pagination").DataTable({
        bLengthChange: false,
        searching: false,
        destroy: true,
        info: false,
        sDom: '<"row view-filter"<"col-sm-12"<"float-left"l><"float-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
        pageLength: 8,
        language: {
          paginate: {
            previous: "<i class='simple-icon-arrow-left'></i>",
            next: "<i class='simple-icon-arrow-right'></i>"
          }
        },
        drawCallback: function () {
          $($(".dataTables_wrapper .pagination li:first-of-type"))
            .find("a")
            .addClass("prev");
          $($(".dataTables_wrapper .pagination li:last-of-type"))
            .find("a")
            .addClass("next");

          $(".dataTables_wrapper .pagination").addClass("pagination-sm");
        }
      });

      var dataTablePs;
      $(".data-table-scrollable").DataTable({
        searching: false,
        bLengthChange: false,
        destroy: true,
        info: false,
        paging: false,
        sDom: '<"row view-filter"<"col-sm-12"<"float-left"l><"float-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
        responsive: !0,
        deferRender: !0,
        scrollY: "calc(100vh - 400px)",
        scrollCollapse: !0,
        "fnInitComplete": function () {
          dataTablePs = new PerfectScrollbar('.dataTables_scrollBody', { suppressScrollX: true });
          dataTablePs.isRtl = false;
        },
        "fnDrawCallback": function (oSettings) {
          dataTablePs = new PerfectScrollbar('.dataTables_scrollBody', { suppressScrollX: true });
          dataTablePs.isRtl = false;
        }
      });

      $(".data-table-feature").DataTable({
        sDom: '<"row view-filter"<"col-sm-12"<"float-right"l><"float-left"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
        "columns": [
          { "data": "name" },
          { "data": "position" },
          { "data": "office" },
          { "data": "age" },
          { "data": "start_date" },
          { "data": "salary" }
        ],
        drawCallback: function () {
          $($(".dataTables_wrapper .pagination li:first-of-type"))
            .find("a")
            .addClass("prev");
          $($(".dataTables_wrapper .pagination li:last-of-type"))
            .find("a")
            .addClass("next");

          $(".dataTables_wrapper .pagination").addClass("pagination-sm");
        },
        language: {
          paginate: {
            previous: "<i class='simple-icon-arrow-left'></i>",
            next: "<i class='simple-icon-arrow-right'></i>"
          },
          search: "_INPUT_",
          searchPlaceholder: "Search...",
          lengthMenu: "Items Per Page _MENU_"
        },
      });

      // Datatable with rows
      var $dataTableRows = $("#datatableRows").DataTable({
        bLengthChange: false,
        buttons: [
          'copy',
          'excel',
          'csv',
          'pdf'
        ],
        destroy: true,
        info: false,
        sDom: '<"row view-filter"<"col-sm-12"<"float-left"l><"float-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
        pageLength: 10,
        columns: [
          { data: "Name" },
          { data: "Sales" },
          { data: "Stock" },
          { data: "Category" },
          { data: "Check" }
        ],
        language: {
          paginate: {
            previous: "<i class='simple-icon-arrow-left'></i>",
            next: "<i class='simple-icon-arrow-right'></i>"
          }
        },
        drawCallback: function () {
          unCheckAllRows();
          $("#checkAllDataTables").prop("checked", false);
          $("#checkAllDataTables").prop("indeterminate", false).trigger("change");

          $($(".dataTables_wrapper .pagination li:first-of-type"))
            .find("a")
            .addClass("prev");
          $($(".dataTables_wrapper .pagination li:last-of-type"))
            .find("a")
            .addClass("next");
          $(".dataTables_wrapper .pagination").addClass("pagination-sm");
          var api = $(this).dataTable().api();
          $("#pageCountDatatable span").html("Displaying " + parseInt(api.page.info().start + 1) + "-" + api.page.info().end + " of " + api.page.info().recordsTotal + " items");
        }
      });

      $("#dataTablesCopy").on("click", function(event) {
        event.preventDefault();
        $dataTableRows.buttons(0).trigger();
      });

      $("#dataTablesExcel").on("click", function(event) {
        event.preventDefault();
        $dataTableRows.buttons(1).trigger();
      });
      
      $("#dataTablesCsv").on("click", function(event) {
        event.preventDefault();
        $dataTableRows.buttons(2).trigger();
      });
      
      $("#dataTablesPdf").on("click", function(event) {
        event.preventDefault();
        $dataTableRows.buttons(3).trigger();
      });

      $('#datatableRows tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected');
        var $checkBox = $(this).find(".custom-checkbox input");
        $checkBox.prop("checked", !$checkBox.prop("checked")).trigger("change");
        controlCheckAll();
      });

      function controlCheckAll() {
        var anyChecked = false;
        var allChecked = true;
        $('#datatableRows tbody tr .custom-checkbox input').each(function () {
          if ($(this).prop("checked")) {
            anyChecked = true;
          } else {
            allChecked = false;
          }
        });
        if (anyChecked) {
          $("#checkAllDataTables").prop("indeterminate", anyChecked);
        } else {
          $("#checkAllDataTables").prop("indeterminate", anyChecked);
          $("#checkAllDataTables").prop("checked", anyChecked);
        }
        if (allChecked) {
          $("#checkAllDataTables").prop("indeterminate", false);
          $("#checkAllDataTables").prop("checked", allChecked);
        }
      }

      function unCheckAllRows() {
        $('#datatableRows tbody tr').removeClass('selected');
        $('#datatableRows tbody tr .custom-checkbox input').prop("checked", false).trigger("change");
      }

      function checkAllRows() {
        $('#datatableRows tbody tr').addClass('selected');
        $('#datatableRows tbody tr .custom-checkbox input').prop("checked", true).trigger("change");
      }

      $("#checkAllDataTables").on("click", function (event) {
        var isCheckedAll = $("#checkAllDataTables").prop("checked");
        if (isCheckedAll) {
          checkAllRows();
        } else {
          unCheckAllRows();
        }
      });

      function getSelectedRows() {
        //Getting Selected Ones
        console.log($dataTableRows.rows('.selected').data());
      }

      $("#searchDatatable").on("keyup", function (event) {
        $dataTableRows.search($(this).val()).draw();
      });

      $("#pageCountDatatable .dropdown-menu a").on("click", function (event) {
        var selText = $(this).text();
        $dataTableRows.page.len(parseInt(selText)).draw();
      });

      var $addToDatatableButton = $("#addToDatatable").stateButton();

      // Validation when modal shown
      $('#rightModal').on('shown.bs.modal', function (e) {
        $("#addToDatatableForm").validate(
          {
            rules: {
              Sales: {
                required: true,
                number: true,
                min: 3000
              },
              Stock: {
                required: true,
                number: true,
              },
              Category: {
                required: true
              },
              Name: {
                required: true
              }
            }
          }
        )
      })

      //Adding to datatable from right modal
      $("#addToDatatable").on("click", function (event) {
        if ($("#addToDatatableForm").valid()) {
          $addToDatatableButton.showSpinner();
          var inputs = $("#addToDatatableForm").find(':input');
          var data = {};
          inputs.each(function () {
            data[$(this).attr("name")] = $(this).val();
          });
          data["Check"] = '<label class="custom-control custom-checkbox mb-1 align-self-center data-table-rows-check"><input type="checkbox" class="custom-control-input"><span class="custom-control-label">&nbsp;</span></label>';
          $dataTableRows.row.add(data).draw();
          setTimeout(function () {
            $addToDatatableButton.showSuccess(true, "New row added!");
            setTimeout(function () {
              $("#rightModal").modal("toggle");
              $addToDatatableButton.reset();
              inputs.each(function () {
                $(this).val("");
              });
              if ($("#addToDatatableForm").find('select').data('select2')) {
                $("#addToDatatableForm").find('select').val('').trigger('change');
              }
              $("#addToDatatableForm").validate().resetForm();
            }, 1000);
          }, 1000);
        }
      });
    }

    /* 03.12. Notification */
    function showNotification(placementFrom, placementAlign, type) {
      $.notify(
        {
          title: "Bootstrap Notify",
          message: "Here is a notification!",
          target: "_blank"
        },
        {
          element: "body",
          position: null,
          type: type,
          allow_dismiss: true,
          newest_on_top: false,
          showProgressbar: false,
          placement: {
            from: placementFrom,
            align: placementAlign
          },
          offset: 20,
          spacing: 10,
          z_index: 1031,
          delay: 4000,
          timer: 2000,
          url_target: "_blank",
          mouse_over: null,
          animate: {
            enter: "animated fadeInDown",
            exit: "animated fadeOutUp"
          },
          onShow: null,
          onShown: null,
          onClose: null,
          onClosed: null,
          icon_type: "class",
          template:
            '<div data-notify="container" class="col-11 col-sm-3 alert  alert-{0} " role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            "</div>" +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            "</div>"
        }
      );
    }

    $("body").on("click", ".notify-btn", function (event) {
      event.preventDefault();
      showNotification($(this).data("from"), $(this).data("align"), "primary");
    });

    /* 03.13. Dropdown Select */
    $(".dropdown-as-select .dropdown-menu a").click(function () {
      var selText = $(this).text();
      $(this).parents(".dropdown-as-select").find('.dropdown-toggle').html(selText);
      $(this).parents(".dropdown-as-select").find('a').removeClass("active");
      $(this).addClass("active");
    });

    /* 03.14. Slick Slider */
    if ($().slick) {
      $(".slick.basic").slick({
        dots: true,
        infinite: true,
        speed: 300,
        rtl: isRtl,
        slidesToShow: 3,
        slidesToScroll: 4,
        appendDots: $(".slick.basic")
          .parents(".slick-container")
          .find(".slider-dot-container"),
        prevArrow: $(".slick.basic")
          .parents(".slick-container")
          .find(".slider-nav .left-arrow"),
        nextArrow: $(".slick.basic")
          .parents(".slick-container")
          .find(".slider-nav .right-arrow"),
        customPaging: function (slider, i) {
          return '<button role="button" class="slick-dot"><span></span></button>';
        },
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });

      $(".slick.center").slick({
        dots: true,
        infinite: true,
        centerMode: true,
        speed: 300,
        rtl: isRtl,
        slidesToShow: 4,
        slidesToScroll: 4,
        appendDots: $(".slick.center")
          .parents(".slick-container")
          .find(".slider-dot-container"),
        prevArrow: $(".slick.center")
          .parents(".slick-container")
          .find(".slider-nav .left-arrow"),
        nextArrow: $(".slick.center")
          .parents(".slick-container")
          .find(".slider-nav .right-arrow"),
        customPaging: function (slider, i) {
          return '<button role="button" class="slick-dot"><span></span></button>';
        },
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
              centerMode: false
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              centerMode: false
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: false
            }
          }
        ]
      });

      $(".slick.single").slick({
        dots: true,
        infinite: true,
        rtl: isRtl,
        speed: 300,
        appendDots: $(".slick.single")
          .parents(".slick-container")
          .find(".slider-dot-container"),
        prevArrow: $(".slick.single")
          .parents(".slick-container")
          .find(".slider-nav .left-arrow"),
        nextArrow: $(".slick.single")
          .parents(".slick-container")
          .find(".slider-nav .right-arrow"),
        customPaging: function (slider, i) {
          return '<button role="button" class="slick-dot"><span></span></button>';
        }
      });
    }

    /* 03.15. Form Validation */
    var forms = document.getElementsByClassName("needs-validation");
    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
        },
        false
      );
    });

    /* 03.16. Tooltip */
    if ($().tooltip) {
      $('[data-toggle="tooltip"]').tooltip();
    }

    /* 03.17. Popover */
    if ($().popover) {
      $('[data-toggle="popover"]').popover({ trigger: "focus" });
    }

    /* 03.18. Select 2 */
    if ($().select2) {
      $(".select2-single, .select2-multiple").select2({
        theme: "bootstrap",
        dir: direction,
        placeholder: "",
        maximumSelectionSize: 6,
        containerCssClass: ":all:"
      });
    }

    /* 03.19. Datepicker */
    if ($().datepicker) {
      $("input.datepicker").datepicker({
        autoclose: true,
        rtl: isRtl,
        templates: {
          leftArrow: '<i class="simple-icon-arrow-left"></i>',
          rightArrow: '<i class="simple-icon-arrow-right"></i>'
        }
      });

      $(".input-daterange").datepicker({
        autoclose: true,
        rtl: isRtl,
        templates: {
          leftArrow: '<i class="simple-icon-arrow-left"></i>',
          rightArrow: '<i class="simple-icon-arrow-right"></i>'
        }
      });

      $(".input-group.date").datepicker({
        autoclose: true,
        rtl: isRtl,
        templates: {
          leftArrow: '<i class="simple-icon-arrow-left"></i>',
          rightArrow: '<i class="simple-icon-arrow-right"></i>'
        }
      });

      $(".date-inline").datepicker({
        autoclose: true,
        rtl: isRtl,
        templates: {
          leftArrow: '<i class="simple-icon-arrow-left"></i>',
          rightArrow: '<i class="simple-icon-arrow-right"></i>'
        }
      });
    }

    /* 03.20. Dropzone */
    if ($().dropzone && !$(".dropzone").hasClass("disabled")) {
      $(".dropzone").dropzone({
        url: "https://httpbin.org/post",
        init: function () {
          this.on("success", function (file, responseText) {
            console.log(responseText);
          });
        },
        thumbnailWidth: 160,
        previewTemplate: '<div class="dz-preview dz-file-preview mb-3"><div class="d-flex flex-row "><div class="p-0 w-30 position-relative"><div class="dz-error-mark"><span><i></i></span></div><div class="dz-success-mark"><span><i></i></span></div><div class="preview-container"><img data-dz-thumbnail class="img-thumbnail border-0" /><i class="simple-icon-doc preview-icon" ></i></div></div><div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative"><div><span data-dz-name></span></div><div class="text-primary text-extra-small" data-dz-size /><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div></div><a href="#/" class="remove" data-dz-remove><i class="glyph-icon simple-icon-trash"></i></a></div>'
      });
    }



    /* 03.21. Cropperjs */
    var Cropper = window.Cropper;
    if (typeof Cropper !== "undefined") {
      function each(arr, callback) {
        var length = arr.length;
        var i;

        for (i = 0; i < length; i++) {
          callback.call(arr, arr[i], i, arr);
        }

        return arr;
      }
      var previews = document.querySelectorAll(".cropper-preview");
      var options = {
        aspectRatio: 4 / 3,
        preview: ".img-preview",
        ready: function () {
          var clone = this.cloneNode();

          clone.className = "";
          clone.style.cssText =
            "display: block;" +
            "width: 100%;" +
            "min-width: 0;" +
            "min-height: 0;" +
            "max-width: none;" +
            "max-height: none;";
          each(previews, function (elem) {
            elem.appendChild(clone.cloneNode());
          });
        },
        crop: function (e) {
          var data = e.detail;
          var cropper = this.cropper;
          var imageData = cropper.getImageData();
          var previewAspectRatio = data.width / data.height;

          each(previews, function (elem) {
            var previewImage = elem.getElementsByTagName("img").item(0);
            var previewWidth = elem.offsetWidth;
            var previewHeight = previewWidth / previewAspectRatio;
            var imageScaledRatio = data.width / previewWidth;
            elem.style.height = previewHeight + "px";
            if (previewImage) {
              previewImage.style.width =
                imageData.naturalWidth / imageScaledRatio + "px";
              previewImage.style.height =
                imageData.naturalHeight / imageScaledRatio + "px";
              previewImage.style.marginLeft = -data.x / imageScaledRatio + "px";
              previewImage.style.marginTop = -data.y / imageScaledRatio + "px";
            }
          });
        },
        zoom: function (e) { }
      };

      if ($("#inputImage").length > 0) {
        var inputImage = $("#inputImage")[0];
        var image = $("#cropperImage")[0];

        var cropper;
        inputImage.onchange = function () {
          var files = this.files;
          var file;

          if (files && files.length) {
            file = files[0];
            $("#cropperContainer").css("display", "block");

            if (/^image\/\w+/.test(file.type)) {
              uploadedImageType = file.type;
              uploadedImageName = file.name;

              image.src = uploadedImageURL = URL.createObjectURL(file);
              if (cropper) {
                cropper.destroy();
              }
              cropper = new Cropper(image, options);
              inputImage.value = null;
            } else {
              window.alert("Please choose an image file.");
            }
          }
        };
      }
    }

    /* 03.22. Range Slider */
    if (typeof noUiSlider !== "undefined") {
      if ($("#dashboardPriceRange").length > 0) {
        noUiSlider.create($("#dashboardPriceRange")[0], {
          start: [800, 2100],
          connect: true,
          tooltips: true,
          direction: direction,
          range: {
            min: 200,
            max: 2800
          },
          step: 10,
          format: {
            to: function (value) {
              return "$" + $.fn.addCommas(Math.floor(value));
            },
            from: function (value) {
              return value;
            }
          }
        });
      }

      if ($("#doubleSlider").length > 0) {
        noUiSlider.create($("#doubleSlider")[0], {
          start: [800, 1200],
          connect: true,
          tooltips: true,
          direction: direction,
          range: {
            min: 500,
            max: 1500
          },
          step: 10,
          format: {
            to: function (value) {
              return "$" + $.fn.addCommas(Math.round(value));
            },
            from: function (value) {
              return value;
            }
          }
        });
      }

      if ($("#singleSlider").length > 0) {
        noUiSlider.create($("#singleSlider")[0], {
          start: 0,
          connect: true,
          tooltips: true,
          direction: direction,
          range: {
            min: 0,
            max: 150
          },
          step: 1,
          format: {
            to: function (value) {
              return $.fn.addCommas(Math.round(value));
            },
            from: function (value) {
              return value;
            }
          }
        });
      }
    }

    /* 03.23. Modal Passing Content */
    $("#exampleModalContent").on("show.bs.modal", function (event) {
      var button = $(event.relatedTarget);
      var recipient = button.data("whatever");
      var modal = $(this);
      modal.find(".modal-title").text("New message to " + recipient);
      modal.find(".modal-body input").val(recipient);
    });

    /* 03.24. Scrollbar */
    if (typeof PerfectScrollbar !== "undefined") {
      var chatAppScroll;
      $(".scroll").each(function () {
        if ($(this).parents(".chat-app").length > 0) {
          var scrollElement = $(this)[0];
          var $scrollContent = $(this).find(".scroll-content");
          var initialized = false;

          function createChatAppScroll() {
            chatAppScroll = new PerfectScrollbar(scrollElement, { suppressScrollX: true });
            chatAppScroll.isRtl = false;
            initialized = false;
          }

          function calculateHeight() {
            var elementsHeight = 0;
            if ($("main").length > 0) {
              elementsHeight += parseInt($("main").css("margin-top"));
            }
            if ($(".chat-input-container").length > 0) {
              elementsHeight += $(".chat-input-container").outerHeight(true);
            }
            if ($(".chat-heading-container").length > 0) {
              elementsHeight += $(".chat-heading-container").outerHeight(true);
            }
            if ($(".separator").length > 0) {
              elementsHeight += $(".separator").outerHeight(true);
            }
            $(".chat-app .scroll").css("height", (window.innerHeight - elementsHeight) + "px");

            if (chatAppScroll) {
              $(".chat-app .scroll").scrollTop(
                $(".chat-app .scroll").prop("scrollHeight")
              );
              chatAppScroll.update();
            }
            if (window.innerWidth < 576) {
              if (chatAppScroll) {
                chatAppScroll.destroy();
                chatAppScroll = null;
              }
              $(".chat-app .scroll-content > div:last-of-type").css("padding-bottom", ($(".chat-input-container").outerHeight(true)) + "px");

              if (!initialized) {
                setTimeout(function () {
                  $("html, body").animate({ scrollTop: $(document).height() + 30 }, 100);
                }, 300);
                initialized = true;
              }
            } else {
              if (!chatAppScroll) {
                createChatAppScroll();
              }
              $(".chat-app .scroll-content > div:last-of-type").css("padding-bottom", 0);
            }
          }
          $(window).on("resize", function (event) {
            calculateHeight();
          });
          calculateHeight();

          return;
        }
        var ps = new PerfectScrollbar($(this)[0], { suppressScrollX: true });
        ps.isRtl = false;
      });
    }

    /* 03.25. Progress */
    $(".progress-bar").each(function () {
      $(this).css("width", $(this).attr("aria-valuenow") + "%");
    });

    if (typeof ProgressBar !== "undefined") {
      $(".progress-bar-circle").each(function () {
        var val = $(this).attr("aria-valuenow");
        var color = $(this).data("color") || themeColor1;
        var trailColor = $(this).data("trailColor") || "#d7d7d7";
        var max = $(this).attr("aria-valuemax") || 100;
        var showPercent = $(this).data("showPercent");
        var circle = new ProgressBar.Circle(this, {
          color: color,
          duration: 20,
          easing: "easeInOut",
          strokeWidth: 4,
          trailColor: trailColor,
          trailWidth: 4,
          text: {
            autoStyleContainer: false
          },
          step: function (state, bar) {
            if (showPercent) {
              bar.setText(Math.round(bar.value() * 100) + "%");
            } else {
              bar.setText(val + "/" + max);
            }
          }
        }).animate(val / max);
      });
    }

    /* 03.26. Rating */
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

    /* 03.27. Tags Input */
    if ($().tagsinput) {
      $(".tags").tagsinput({
        cancelConfirmKeysOnEmpty: true,
        confirmKeys: [13]
      });

      $("body").on("keypress", ".bootstrap-tagsinput input", function (e) {
        if (e.which == 13) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    /* 03.28. Sortable */
    if (typeof Sortable !== "undefined") {
      $(".sortable").each(function () {
        if ($(this).find(".handle").length > 0) {
          Sortable.create($(this)[0], { handle: ".handle" });
        } else {
          Sortable.create($(this)[0]);
        }
      });
      if ($(".sortable-survey").length > 0) {
        Sortable.create($(".sortable-survey")[0]);
      }
    }

    /* 03.29. State Button */
    var $successButton = $("#successButton").stateButton();
    $successButton.on("click", function (event) {
      event.preventDefault();
      $successButton.showSpinner();
      //Demonstration states with a timeout
      setTimeout(function () {
        $successButton.showSuccess(true);
        setTimeout(function () {
          $successButton.reset();
        }, 2000);
      }, 3000);
    });

    var $failButton = $("#failButton").stateButton();
    $("#failButton").on("click", function (event) {
      event.preventDefault();
      $failButton.showSpinner();
      //Demonstration states with a timeout
      setTimeout(function () {
        $failButton.showFail(true);
        setTimeout(function () {
          $failButton.reset();
        }, 2000);
      }, 3000);
    });

    /* 03.30. Typeahead */
    var testData = [
      {
        name: "May",
        index: 0,
        id: "5a8a9bfd8bf389ba8d6bb211"
      },
      {
        name: "Fuentes",
        index: 1,
        id: "5a8a9bfdee10e107f28578d4"
      },
      {
        name: "Henderson",
        index: 2,
        id: "5a8a9bfd4f9e224dfa0110f3"
      },
      {
        name: "Hinton",
        index: 3,
        id: "5a8a9bfde42b28e85df34630"
      },
      {
        name: "Barrera",
        index: 4,
        id: "5a8a9bfdc0cba3abc4532d8d"
      },
      {
        name: "Therese",
        index: 5,
        id: "5a8a9bfdedfcd1aa0f4c414e"
      },
      {
        name: "Nona",
        index: 6,
        id: "5a8a9bfdd6686aa51b953c4e"
      },
      {
        name: "Frye",
        index: 7,
        id: "5a8a9bfd352e2fd4c101507d"
      },
      {
        name: "Cora",
        index: 8,
        id: "5a8a9bfdb5133142047f2600"
      },
      {
        name: "Miles",
        index: 9,
        id: "5a8a9bfdadb1afd136117928"
      },
      {
        name: "Cantrell",
        index: 10,
        id: "5a8a9bfdca4795bcbb002057"
      },
      {
        name: "Benson",
        index: 11,
        id: "5a8a9bfdaa51e9a4aeeddb7d"
      },
      {
        name: "Susanna",
        index: 12,
        id: "5a8a9bfd57dd857535ef5998"
      },
      {
        name: "Beatrice",
        index: 13,
        id: "5a8a9bfd68b6f12828da4175"
      },
      {
        name: "Tameka",
        index: 14,
        id: "5a8a9bfd2bc4a368244d5253"
      },
      {
        name: "Lowe",
        index: 15,
        id: "5a8a9bfd9004fda447204d30"
      },
      {
        name: "Roth",
        index: 16,
        id: "5a8a9bfdb4616dbc06af6172"
      },
      {
        name: "Conley",
        index: 17,
        id: "5a8a9bfdfae43320dd8f9c5a"
      },
      {
        name: "Nelda",
        index: 18,
        id: "5a8a9bfd534d9e0ba2d7c9a7"
      },
      {
        name: "Angie",
        index: 19,
        id: "5a8a9bfd57de84496dc42259"
      }
    ];

    if ($().typeahead) {
      $("#query").typeahead({ source: testData });
    }

    /* 03.31. Full Screen */

    function isFullScreen() {
      var isInFullScreen =
        (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement &&
          document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement &&
          document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
      return isInFullScreen;
    }

    function fullscreen() {
      var isInFullScreen = isFullScreen();

      var docElm = document.documentElement;
      if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }

    $("#fullScreenButton").on("click", function (event) {
      event.preventDefault();
      if (isFullScreen()) {
        $($(this).find("i")[1]).css("display", "none");
        $($(this).find("i")[0]).css("display", "inline");
      } else {
        $($(this).find("i")[1]).css("display", "inline");
        $($(this).find("i")[0]).css("display", "none");
      }
      fullscreen();
    });

    /* 03.32. Html Editors */
    if (typeof Quill !== "undefined") {
      var quillToolbarOptions = [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],

        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: direction }],

        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],

        ["clean"]
      ];

      var quillBubbleToolbarOptions = [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }],
        [{ direction: direction }],
        [{ align: [] }]
      ];

      var editor = new Quill("#quillEditor", {
        modules: { toolbar: quillToolbarOptions },
        theme: "snow"
      });

      var editorBubble = new Quill("#quillEditorBubble", {
        modules: { toolbar: quillBubbleToolbarOptions },
        theme: "bubble"
      });
    }

    if (typeof ClassicEditor !== "undefined") {
      ClassicEditor.create(document.querySelector("#ckEditorClassic")).catch(function (error) { });
    }

    /* 03.33. Showing Body */
    $("body > *").css({ opacity: 0 });

    setTimeout(function () {
      $("body").removeClass("show-spinner");
      $("main").addClass("default-transition");
      $(".sub-menu").addClass("default-transition");
      $(".main-menu").addClass("default-transition");
      $(".theme-colors").addClass("default-transition");
      $("body > *").animate({ opacity: 1 }, 100);
    }, 300);


    /*03.34. Keyboard Shortcuts*/
    if (typeof Mousetrap !== "undefined") {
      //Go to next page on sub menu
      Mousetrap.bind(["ctrl+down", "command+down"], function (e) {
        var $nextItem = $(".sub-menu li.active").next();
        if ($nextItem.length == 0) {
          $nextItem = $(".sub-menu li.active")
            .parent()
            .children()
            .first();
        }
        window.location.href = $nextItem.find("a").attr("href");
        return false;
      });

      //Go to prev page on sub menu
      Mousetrap.bind(["ctrl+up", "command+up"], function (e) {
        var $prevItem = $(".sub-menu li.active").prev();
        if ($prevItem.length == 0) {
          $prevItem = $(".sub-menu li.active")
            .parent()
            .children()
            .last();
        }
        window.location.href = $prevItem.find("a").attr("href");
        return false;
      });

      //Go to next page on main menu
      Mousetrap.bind(["ctrl+shift+down", "command+shift+down"], function (e) {
        var $nextItem = $(".main-menu li.active").next();
        if ($nextItem.length == 0) {
          $nextItem = $(".main-menu li:first-of-type");
        }
        var $link = $nextItem
          .find("a")
          .attr("href")
          .replace("#", "");
        var $firstSubLink = $(
          ".sub-menu ul[data-link='" + $link + "'] li:first-of-type"
        );
        window.location.href = $firstSubLink.find("a").attr("href");
        return false;
      });

      //Go to prev page on main menu
      Mousetrap.bind(["ctrl+shift+up", "command+shift+up"], function (e) {
        var $prevItem = $(".main-menu li.active").prev();
        if ($prevItem.length == 0) {
          $prevItem = $(".main-menu li:last-of-type");
        }
        var $link = $prevItem
          .find("a")
          .attr("href")
          .replace("#", "");
        var $firstSubLink = $(
          ".sub-menu ul[data-link='" + $link + "'] li:first-of-type"
        );
        window.location.href = $firstSubLink.find("a").attr("href");
        return false;
      });

      /*Select all with ctrl+a and deselect all with ctrl+d at list pages */
      if ($(".list") && $(".list").length > 0) {
        Mousetrap.bind(["ctrl+a", "command+a"], function (e) {
          $(".list")
            .shiftSelectable()
            .data("shiftSelectable")
            .selectAll();
          return false;
        });

        Mousetrap.bind(["ctrl+d", "command+d"], function (e) {
          $(".list")
            .shiftSelectable()
            .data("shiftSelectable")
            .deSelectAll();
          return false;
        });
      }
    }

    /*03.35. Context Menu */
    if ($().contextMenu) {
      $.contextMenu({
        selector: ".list .card",
        callback: function (key, options) {
          var m = "clicked: " + key;
        },
        events: {
          show: function (options) {
            var $list = options.$trigger.parents(".list");
            if ($list && $list.length > 0) {
              $list.data("shiftSelectable").rightClick(options.$trigger);
            }
          }
        },
        items: {
          copy: {
            name: "Copy",
            className: "simple-icon-docs"
          },
          archive: { name: "Move to archive", className: "simple-icon-drawer" },
          delete: { name: "Delete", className: "simple-icon-trash" }
        }
      });
    }

    /* 03.36. Select from Library */
    if ($().selectFromLibrary) {
      $(".sfl-multiple").selectFromLibrary();
      $(".sfl-single").selectFromLibrary();
      /*
      Getting selected items
      console.log($(".sfl-multiple").selectFromLibrary().data("selectFromLibrary").getData());
      console.log($(".sfl-single").selectFromLibrary().data("selectFromLibrary").getData());
      */
    }

    /* 03.37. Feedback */
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


    /* 03.38. Smart Wizard */
    if ($().smartWizard) {
      $('#smartWizardDefault').smartWizard({
        selected: 0,
        theme: 'default',
        transitionEffect: 'fade',
        showStepURLhash: false
      });

      $('#smartWizardDot').smartWizard({
        selected: 0,
        theme: 'dots',
        transitionEffect: 'fade',
        showStepURLhash: false
      });

      $('#smartWizardCheck').smartWizard({
        selected: 0,
        theme: 'check',
        transitionEffect: 'fade',
        showStepURLhash: false
      });

      $('#smartWizardClickable').smartWizard({
        selected: 0,
        theme: 'default',
        transitionEffect: 'fade',
        showStepURLhash: false,
        anchorSettings: {
          enableAllAnchors: true
        }
      });

      //Custom Buttons
      $('#smartWizardCustomButtons').smartWizard({
        selected: 0,
        theme: 'default',
        transitionEffect: 'fade',
        showStepURLhash: false,
        toolbarSettings: {
          toolbarPosition: 'none'
        }
      });

      $("#smartWizardCustomButtons .prev-btn").on("click", function () {
        $('#smartWizardCustomButtons').smartWizard("prev");
        return true;
      });

      $("#smartWizardCustomButtons .next-btn").on("click", function () {
        $('#smartWizardCustomButtons').smartWizard("next");
        return true;
      });

      $("#smartWizardCustomButtons .reset-btn").on("click", function (event) {
        $('#smartWizardCustomButtons').smartWizard("reset");
        return true;
      });

      // Validation
      $("#smartWizardValidation").on("showStep", function (e, anchorObject, stepNumber, stepDirection, stepPosition) {
        if (stepPosition === 'first') {
          $("#smartWizardValidation .prev-btn").addClass('disabled');
          $("#smartWizardValidation .finish-btn").hide();
          $("#smartWizardValidation .next-btn").show();
        } else if (stepPosition === 'final') {
          $("#smartWizardValidation .next-btn").hide();
          $("#smartWizardValidation .finish-btn").show();
          $("#smartWizardValidation .prev-btn").removeClass('disabled');
        } else {
          $("#smartWizardValidation .finish-btn").hide();
          $("#smartWizardValidation .next-btn").show();
          $("#smartWizardValidation .prev-btn").removeClass('disabled');
        }
      });

      $('#smartWizardValidation').smartWizard({
        selected: 0,
        theme: 'check',
        transitionEffect: 'fade',
        showStepURLhash: false,
        toolbarSettings: {
          toolbarPosition: 'none'
        }
      });

      $("#smartWizardValidation").on("leaveStep", function (e, anchorObject, stepNumber, stepDirection) {
        var elmForm = $("#form-step-" + stepNumber);
        if (stepDirection === 'forward' && elmForm) {
          return checkWizardValidation(elmForm);
        }
      });

      $("#smartWizardValidation .prev-btn").on("click", function () {
        $('#smartWizardValidation').smartWizard("prev");
        return true;
      });

      $("#smartWizardValidation .next-btn").on("click", function () {
        $('#smartWizardValidation').smartWizard("next");
        return true;
      });

      $("#smartWizardValidation .finish-btn").on("click", function (event) {
        if (checkWizardValidation($('#smartWizardValidation #form-step-1'))) {
          console.log("Form Done");
          return false;
        }
        return true;
      });

      function checkWizardValidation(form) {
        if ($().validate) {
          if ($(form).valid()) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    }

    /* 03.39. Countdown */
    if (typeof Countdown !== "undefined") {
      var dateToCount = new Date(new Date().setMinutes(new Date().getMinutes() + 5000));
      var countdown = new Countdown({
        selector: '#timer',
        leadingZeros: true,
        msgBefore: "",
        msgAfter: "",
        msgPattern: ' <span class="timer-column"><p class="lead text-center">{days}</p><p>Days</p></span><span class="timer-column"><p class="lead text-center">{hours}</p><p>Hours</p></span><span class="timer-column"><p class="lead text-center">{minutes}</p><p>Minutes</p></span><span class="timer-column"><p class="lead text-center">{seconds}</p><p>Seconds</p></span>',
        dateEnd: dateToCount
      });
    }

    /* 03.40. Lightbox */
    if (typeof baguetteBox !== "undefined") {
      baguetteBox.run('.gallery');
      baguetteBox.run('.lightbox');
    }

    /* 03.41. Ellipsis */
    if ($().ellipsis) {
      $(".ellipsis").ellipsis({
        live: true
      });
    }

    /* 03.42. Glide */
    if (typeof Glide !== "undefined") {

      // Details Images
      if ($(".glide.details").length > 0) {
        var glideThumbCountMax = 5;
        var glideLength = $(".glide.thumbs li").length;
        var perView = Math.min(glideThumbCountMax, glideLength);

        var glideLarge = new Glide(".glide.details", {
          bound: true,
          rewind: false,
          focusAt: 0,
          perView: 1,
          startAt: 0,
          direction: direction,
        });

        var glideThumbs = new Glide(".glide.thumbs", {
          bound: true,
          rewind: false,
          perView: perView,
          perTouch: 1,
          focusAt: 0,
          startAt: 0,
          direction: direction,
          breakpoints: {
            576: {
              perView: Math.min(4, glideLength)
            },
            420: {
              perView: Math.min(3, glideLength)
            }
          }
        });

        $(".glide.thumbs").css("width", perView * 70);
        addActiveThumbClass(0);

        $(".glide.thumbs li").on("click", function (event) {
          var clickedIndex = $(event.currentTarget).index();
          glideLarge.go("=" + clickedIndex);
          addActiveThumbClass(clickedIndex);
        });

        glideLarge.on(["swipe.end"], function () {
          addActiveThumbClass(glideLarge.index);
        });

        glideThumbs.on("resize", function () {
          perView = Math.min(glideThumbs.settings.perView, glideLength);
          $(".glide.thumbs").css("width", perView * 70);
          if (perView >= $(".glide.thumbs li").length) {
            $(".glide.thumbs .glide__arrows").css("display", "none");
          } else {
            $(".glide.thumbs .glide__arrows").css("display", "block");
          }
        });

        function addActiveThumbClass(index) {
          $(".glide.thumbs li").removeClass("active");
          $($(".glide.thumbs li")[index]).addClass("active");
          var gap = glideThumbs.index + perView;
          if (index >= gap) {
            glideThumbs.go(">");
          }
          if (index < glideThumbs.index) {
            glideThumbs.go("<");
          }
        }
        glideThumbs.mount();
        glideLarge.mount();
      }

      // Dashboard Numbers
      if ($(".glide.dashboard-numbers").length > 0) {
        new Glide(".glide.dashboard-numbers", {
          bound: true,
          rewind: false,
          perView: 4,
          perTouch: 1,
          focusAt: 0,
          startAt: 0,
          direction: direction,
          gap: 7,
          breakpoints: {
            1800: {
              perView: 3
            },
            576: {
              perView: 2
            },
            320: {
              perView: 1
            }
          }
        }).mount();
      }

      // Dashboard Best Rated
      if ($(".best-rated-items").length > 0) {
        new Glide(".best-rated-items", {
          gap: 10,
          perView: 1,
          direction: direction,
          type: "carousel",
          peek: { before: 0, after: 100 },
          breakpoints: {
            480: { perView: 1 },
            992: { perView: 2 },
            1200: { perView: 1 }
          },
        }).mount();
      }


      if ($(".glide.basic").length > 0) {
        new Glide(".glide.basic", {
          gap: 0,
          rewind: false,
          bound: true,
          perView: 3,
          direction: direction,
          breakpoints: {
            600: { perView: 1 },
            1000: { perView: 2 }
          },
        }).mount();
      }

      if ($(".glide.center").length > 0) {
        new Glide(".glide.center", {
          gap: 0,
          type: "carousel",
          perView: 4,
          direction: direction,
          peek: { before: 50, after: 50 },
          breakpoints: {
            600: { perView: 1 },
            1000: { perView: 2 }
          },
        }).mount();
      }

      if ($(".glide.single").length > 0) {
        new Glide(".glide.single", {
          gap: 0,
          type: "carousel",
          perView: 1,
          direction: direction,
        }).mount();
      }



      if ($(".glide.gallery").length > 0) {
        var enableClick = true;
        var glideGallery = new Glide(".glide.gallery", {
          gap: 10,
          perTouch: 1,
          perView: 1,
          type: "carousel",
          peek: { before: 100, after: 100 },
          direction: direction
        })

        glideGallery.on(["swipe.move"], function () {
          enableClick = false;
        });

        glideGallery.on(["run.after"], function () {
          enableClick = true;
        });

        glideGallery.mount();

        $(".glide.gallery").get(0).addEventListener('click', function (event) {
          if (!enableClick) {
            event.stopPropagation();
            event.preventDefault();
            return false;
          } else {
            return true;
          }
        }, true);

      }
    }

    /* 03.43. Validation */
    // Bootstrap Validate
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        $(form).find(".custom-control input").parents(".form-group").each(function () {
          $(this).find(".custom-control input").parents(".form-group").removeClass("is-invalid");
          if ($(this).find(".custom-control input:invalid").length == $(this).find(".custom-control input").length) {
            $(this).find(".custom-control input:invalid").parents(".form-group").addClass("is-invalid");
          }
        });
        form.classList.add('was-validated');
      }, false);

      $(form).find("input").each(function () {
        $(this).on("change", function () {
          $(this).parents(".form-group").removeClass("is-invalid");
        });
      });
    });

    // jQuery Validate
    if ($().validate) {
      $.validator.setDefaults({
        ignore: [],
        errorElement: "div",
        submitHandler: function () {
          alert("submitted!");
        },
        errorPlacement: function (error, element) {
          if (element.attr("class").indexOf("custom-control") != -1) {
            error.insertAfter(element.parent());
          } else {
            error.insertAfter(element);
          }
        }
      });

      $("#exampleForm").validate();
      $("#exampleFormTopLabels").validate();
      $("#exampleFormLabelsInInput").validate();
      $("#tooltipPositions").validate();
      $("#tooltipHelpers").validate();

      $("#rulesForm").validate({
        rules: {
          rulesName: {
            required: true,
            lettersonly: true
          },
          rulesEmail: {
            required: true,
            email: true
          },
          rulesId: {
            required: true,
            minlength: 8,
            maxlength: 8,
            number: true
          },
          rulesDetail: {
            required: true,
            maxlength: 20
          },
          rulesPassword: {
            required: true,
            minlength: 6,
          },
          rulesPasswordConfirm: {
            required: true,
            minlength: 6,
            equalTo: "#rulesPassword"
          },
          rulesCreditCard: {
            creditcard: true,
            nowhitespace: true,
            required: true,
          },
          rulesAge: {
            number: true,
            min: 18,
            required: true
          }
        },
        messages: {
          rulesName: {
            lettersonly: "Only letters are accepted!"
          },
          rulesEmail: {
            email: "Your email address must be in correct format!"
          },
          rulesId: {
            number: "Must be a number!",
            minlength: "Id must be {0} characters!",
            maxlength: "Id must be {0} characters!"
          },
          rulesPassword: {
            minlength: "Password must be at least {0} characters!"
          },
          rulesPasswordConfirm: {
            equalTo: "Passwords must match!",
            minlength: "Password must be at least {0} characters!"
          },
          rulesDetail: {
            maxlength: "Details must be maximum {0} characters!"
          },
          rulesCreditCard: {
            creditcard: "Must be a valid credit card number!",
            nowhitespace: "Must not contain whitespace!"
          }
        }
      });

      $('select, .tags-input, .datepicker').on('change', function () {
        $(this).valid();
      });
    }
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
