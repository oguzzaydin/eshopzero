/* 
Plugin : Select Image From Library
Version : 0.0.1
Description : Select from a modal which contains list of media items.
*/
$.selectFromLibrary = function(element, options) {
  var plugin = this;
  var defaults = {
    // Sets how many items can be selected from library. Set to -1 disable selection limit.
    count: 1,

    // Modal id from which items will be selected
    libraryId: "#modal",

    // Submit button class in library modal.
    submitButtonClass: ".sfl-submit",

    // Container class for library item
    itemContainerClass: ".sfl-item-container",

    // Selected item template class
    selectedItemClass: ".sfl-selected-item",

    // Selected item template class to distinction
    selectedItemClassActive: ".sfl-selected-item-active",

    // Selected item template image class
    selectedItemImageClass: ".sfl-selected-item-image",

    // Selected item template label class
    selectedItemLabelClass: ".sfl-selected-item-label",

    // Selected item delete class
    selectedItemDeleteClass: ".sfl-delete-item"
  };
  var $self = $(element);
  plugin.settings = $.extend({}, defaults, options, $self.data());

  var $modal =
    plugin.settings.libraryId.indexOf("#") > -1
      ? $(plugin.settings.libraryId)
      : $("#" + plugin.settings.libraryId);
  var $itemContaines;
  var $submitButton;
  var $submitButtonLabel;
  var $checkedItems;
  var selectedItems;

  function init() {
    $itemContaines = $(plugin.settings.itemContainerClass);
    $submitButton = $modal.find(plugin.settings.submitButtonClass);
    $submitButtonLabel = $submitButton.html();
    clearAllSelections();
    $modal.modal($modal.data());
    if (plugin.settings.count == 1) {
      hideCheckboxes();
    } else {
      showCheckboxes();
    }
    $submitButton.on("click", onSubmitHandler);
    $modal.on(
      "change",
      plugin.settings.itemContainerClass + " .custom-control-input",
      checkChange
    );
    $modal.on('hidden.bs.modal', onModalHide);
  }

  $self.on("click", function(event) {
    event.preventDefault();
    init();
  });

  function checkChange(event) {
    $checkedItems = $(
      plugin.settings.itemContainerClass + " .custom-control-input:checked"
    ).parents(plugin.settings.itemContainerClass);
    if(plugin.settings.count == 1) {
      onSubmitHandler(null);
      hideSelectButton();
      return;
    }
    $submitButton.html(
      $checkedItems.length > 0
        ? $submitButtonLabel + " (" + $checkedItems.length + ")"
        : $submitButtonLabel
    );
  }

  function onSubmitHandler(event) {
    event && event.preventDefault();
    getDataFromDomItems($checkedItems);
    appendSelectedItems();
    $modal.modal("hide");
  }

  function appendSelectedItems() {
    var $emptyParent;
    var $itemTemp;
    var $grandParent = $self.parent().parent();
    for(var i = 0; i<selectedItems.length; i++) {
      $emptyParent = $self.parent().clone().empty();
      $itemTemp = $self.parent().find(plugin.settings.selectedItemClass).clone();
      $itemTemp.find(plugin.settings.selectedItemImageClass).attr("src", selectedItems[i].previewPath);
      $itemTemp.find(plugin.settings.selectedItemLabelClass).html(selectedItems[i].label);
      $itemTemp.css("display", "block");
      $itemTemp.addClass(plugin.settings.selectedItemClassActive.replace(".", ""));
      $emptyParent.append($itemTemp);
      $grandParent.prepend($emptyParent);
      $itemTemp.on("click", plugin.settings.selectedItemDeleteClass, onDeleteClick);
      for(var prop in selectedItems[i]) {
        $itemTemp.data(prop, selectedItems[i][prop]);
      }
    }
  }

  function onDeleteClick(event) {
    event.preventDefault();
    $(this).parents(plugin.settings.selectedItemClass).off("click", plugin.settings.selectedItemDeleteClass, onDeleteClick);
    $(this).parents(plugin.settings.selectedItemClass).parent().remove();
    updateSelectedItemsByDom();
    if(plugin.settings.count == 1) {
      showSelectButton()
    }
  }

  function updateSelectedItemsByDom() {
    var $grandParent = $self.parent().parent();
    var $items = $grandParent.find(plugin.settings.selectedItemClassActive);
    getDataFromDomItems($items);
  }

  function getDataFromDomItems($items) {
    selectedItems = [];
    if(!$items) {
      return;
    }
    $items.each(function() {
      selectedItems.push($(this).data());
    });
  }

  function onModalHide(event) {
    $submitButton.html($submitButtonLabel);
    $submitButton.off("click", onSubmitHandler);
    $modal.off(
      "change",
      plugin.settings.itemContainerClass + " .custom-control-input",
      checkChange
    );
    $modal.off('hidden.bs.modal', onModalHide);
  }

  function hideCheckboxes() {
    $itemContaines.each(function() {
      $(this)
        .find(".custom-checkbox")
        .css("visibility", "hidden");
    });
  }

  function showCheckboxes() {
    $itemContaines.each(function() {
      $(this)
        .find(".custom-checkbox")
        .css("visibility", "visible");
    });
  }

  function clearAllSelections() {
    $itemContaines.each(function() {
      $(this)
        .find(".custom-control-input")
        .prop("checked", false);
      $(this)
        .find(".active")
        .removeClass("active");
    });
  }

  function hideSelectButton() {
    $self.css("visibility", "hidden");
  }

  function showSelectButton() {
    $self.css("visibility", "visible");
  }

  plugin.getData = function() {
    return selectedItems || [];
  }

};

$.fn.selectFromLibrary = function(options) {
  return this.each(function() {
    if (undefined == $(this).data("selectFromLibrary")) {
      var plugin = new $.selectFromLibrary(this, options);
      $(this).data("selectFromLibrary", plugin);
    }
  });
};
