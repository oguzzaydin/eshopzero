/* Dore Theme Select & Initializer Script 

Table of Contents

01. Css Loading Util
02. Theme Selector And Initializer
*/

/* 01. Css Loading Util */
function loadStyle(href, callback) {
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href == href) {
      return;
    }
  }
  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = href;
  if (callback) {
    link.onload = function () {
      callback();
    };
  }
  var mainCss = $(head).find('[href$="main.css"]');
  if (mainCss.length !== 0) {
    mainCss[0].before(link);
  } else {
    head.appendChild(link);
  }
}

/* 02. Theme Selector, Layout Direction And Initializer */
(function ($) {
  if ($().dropzone) {
    Dropzone.autoDiscover = false;
  }

  var themeColorsDom = /*html*/`
  <div class="theme-colors">
    <div class="p-4">
    <p class="text-muted mb-2">Light Theme</p>
    <div class="d-flex flex-row justify-content-between mb-3">
      <a href="#" data-theme="dore.light.bluenavy.min.css" class="theme-color theme-color-bluenavy"></a>
      <a href="#" data-theme="dore.light.blueyale.min.css" class="theme-color theme-color-blueyale"></a>
      <a href="#" data-theme="dore.light.blueolympic.min.css" class="theme-color theme-color-blueolympic"></a>
      <a href="#" data-theme="dore.light.greenmoss.min.css" class="theme-color theme-color-greenmoss"></a>
      <a href="#" data-theme="dore.light.greenlime.min.css" class="theme-color theme-color-greenlime"></a>
    </div>
    <div class="d-flex flex-row justify-content-between mb-4">
      <a href="#" data-theme="dore.light.purplemonster.min.css" class="theme-color theme-color-purplemonster"></a>
      <a href="#" data-theme="dore.light.orangecarrot.min.css" class="theme-color theme-color-orangecarrot"></a>
      <a href="#" data-theme="dore.light.redruby.min.css" class="theme-color theme-color-redruby"></a>
      <a href="#" data-theme="dore.light.yellowgranola.min.css" class="theme-color theme-color-yellowgranola"></a>
      <a href="#" data-theme="dore.light.greysteel.min.css" class="theme-color theme-color-greysteel"></a>
    </div>
    <p class="text-muted mb-2">Dark Theme</p>
    <div class="d-flex flex-row justify-content-between mb-3">
      <a href="#" data-theme="dore.dark.bluenavy.min.css" class="theme-color theme-color-bluenavy"></a>
      <a href="#" data-theme="dore.dark.blueyale.min.css" class="theme-color theme-color-blueyale"></a>
      <a href="#" data-theme="dore.dark.blueolympic.min.css" class="theme-color theme-color-blueolympic"></a>
      <a href="#" data-theme="dore.dark.greenmoss.min.css" class="theme-color theme-color-greenmoss"></a>
      <a href="#" data-theme="dore.dark.greenlime.min.css" class="theme-color theme-color-greenlime"></a>
    </div>
    <div class="d-flex flex-row justify-content-between">
    <a href="#" data-theme="dore.dark.purplemonster.min.css" class="theme-color theme-color-purplemonster"></a>
    <a href="#" data-theme="dore.dark.orangecarrot.min.css" class="theme-color theme-color-orangecarrot"></a>
    <a href="#" data-theme="dore.dark.redruby.min.css" class="theme-color theme-color-redruby"></a>
    <a href="#" data-theme="dore.dark.yellowgranola.min.css" class="theme-color theme-color-yellowgranola"></a>
    <a href="#" data-theme="dore.dark.greysteel.min.css" class="theme-color theme-color-greysteel"></a>
  </div>
  </div>
  <div class="p-4">
    <p class="text-muted mb-2">Border Radius</p>
    <div class="custom-control custom-radio custom-control-inline">
      <input type="radio" id="roundedRadio" name="radiusRadio" class="custom-control-input radius-radio" data-radius="rounded">
      <label class="custom-control-label" for="roundedRadio">Rounded</label>
    </div>
    <div class="custom-control custom-radio custom-control-inline">
      <input type="radio" id="flatRadio" name="radiusRadio" class="custom-control-input radius-radio" data-radius="flat">
      <label class="custom-control-label" for="flatRadio">Flat</label>
    </div>
  </div>
  <div class="p-4">
    <p class="text-muted mb-2">Direction</p>
    <div class="custom-control custom-radio custom-control-inline">
    <input type="radio" id="ltrRadio" name="directionRadio" class="custom-control-input direction-radio" data-direction="ltr">
    <label class="custom-control-label" for="ltrRadio">Ltr</label>
  </div>
  <div class="custom-control custom-radio custom-control-inline">
    <input type="radio" id="rtlRadio" name="directionRadio" class="custom-control-input direction-radio" data-direction="rtl">
    <label class="custom-control-label" for="rtlRadio">Rtl</label>
  </div>
</div>
<a href="#" class="theme-button"> <i class="simple-icon-magic-wand"></i> </a>
</div>
`;

  $("body").append(themeColorsDom);


  /* Default Theme Color, Border Radius and  Direction */
  var theme = "dore.light.bluenavy.min.css";
  var direction = "ltr";
  var radius = "rounded";

  if (typeof Storage !== "undefined") {
    if (localStorage.getItem("dore-theme-color")) {
      theme = localStorage.getItem("dore-theme-color");
    } else {
      localStorage.setItem("dore-theme-color", theme);
    }
    if (localStorage.getItem("dore-direction")) {
      direction = localStorage.getItem("dore-direction");
    } else {
      localStorage.setItem("dore-direction", direction);
    }
    if (localStorage.getItem("dore-radius")) {
      radius = localStorage.getItem("dore-radius");
    } else {
      localStorage.setItem("dore-radius", radius);
    }
  }

  $(".theme-color[data-theme='" + theme + "']").addClass("active");
  $(".direction-radio[data-direction='" + direction + "']").attr("checked", true);
  $(".radius-radio[data-radius='" + radius + "']").attr("checked", true);
  $("#switchDark").attr("checked", theme.indexOf("dark") > 0 ? true : false);

  loadStyle("css/" + theme, onStyleComplete);
  function onStyleComplete() {
    setTimeout(onStyleCompleteDelayed, 300);
  }

  function onStyleCompleteDelayed() {
    $("body").addClass(direction);
    $("html").attr("dir", direction);
    $("body").addClass(radius);
    $("body").dore();
  }

  $("body").on("click", ".theme-color", function (event) {
    event.preventDefault();
    var dataTheme = $(this).data("theme");
    if (typeof Storage !== "undefined") {
      localStorage.setItem("dore-theme-color", dataTheme);
      window.location.reload();
    }
  });

  $("input[name='directionRadio']").on("change", function (event) {
    var direction = $(event.currentTarget).data("direction");
    if (typeof Storage !== "undefined") {
      localStorage.setItem("dore-direction", direction);
      window.location.reload();
    }
  });

  $("input[name='radiusRadio']").on("change", function (event) {
    var radius = $(event.currentTarget).data("radius");
    if (typeof Storage !== "undefined") {
      localStorage.setItem("dore-radius", radius);
      window.location.reload();
    }
  });

  $("#switchDark").on("change", function (event) {
    var mode = $(event.currentTarget)[0].checked ? "dark" : "light";
    if (mode == "dark") {
      theme = theme.replace("light", "dark");
    } else if (mode == "light") {
      theme = theme.replace("dark", "light");
    }
    if (typeof Storage !== "undefined") {
      localStorage.setItem("dore-theme-color", theme);
      window.location.reload();
    }
  });

  $(".theme-button").on("click", function (event) {
    event.preventDefault();
    $(this)
      .parents(".theme-colors")
      .toggleClass("shown");
  });

  $(document).on("click", function (event) {
    if (
      !(
        $(event.target)
          .parents()
          .hasClass("theme-colors") ||
        $(event.target)
          .parents()
          .hasClass("theme-button") ||
        $(event.target).hasClass("theme-button") ||
        $(event.target).hasClass("theme-colors")
      )
    ) {
      if ($(".theme-colors").hasClass("shown")) {
        $(".theme-colors").removeClass("shown");
      }
    }
  });
})(jQuery);
