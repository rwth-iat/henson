// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/*!
 * Bootstrap Context Menu
 * Version: 2.1
 * A small variation of the dropdown plugin by @sydcanem
 * https://github.com/sydcanem/bootstrap-contextmenu
 *
 * New options added by @jeremyhubble for javascript launching
 *  $('#elem').contextmenu({target:'#menu',before:function(e) { return true; } });
 *
 *
 * Twitter Bootstrap (http://twitter.github.com/bootstrap).
 */

/* =========================================================
 * bootstrap-contextmenu.js
 * =========================================================
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!(function($) {

	"use strict"; // jshint ;_;

	/* CONTEXTMENU CLASS DEFINITION
	 * ============================ */

	var ContextMenu = function (elements, options) {
			this.$elements = $(elements)
			this.options = options
			this.before = this.options.before || this.before
			this.onItem = this.options.onItem || this.onItem
			if (this.options.target)
				this.$elements.attr('data-target',this.options.target)

			this.listen()
		}

	ContextMenu.prototype = {

		constructor: ContextMenu
		,show: function(e) {

			var $this = $(this)
				, $menu
				, $contextmenu
				, evt;


			if ($this.is('.disabled, :disabled')) return;

			evt = $.Event('context');
			if (!this.before.call(this,e,$(e.currentTarget))) return;
			this.$elements.trigger(evt);

			$menu = this.getMenu();

			var tp = this.getPosition(e, $menu);
			$menu.attr('style', '')
				.css(tp)
				.data('_context_this_ref', this)
				.addClass('open');


			return false;
		}

		,closemenu: function(e) {
			this.getMenu().removeClass('open');
		}

		,before: function(e) {
			return true;
		}

		,onItem: function(e, context) {
			return true;
		}

		,listen: function () {
			var _this = this;
			this.$elements
					.on('contextmenu.context.data-api', $.proxy(this.show, this));
			$('html')
					.on('click.context.data-api', $.proxy(this.closemenu, this));

			var $target = $(this.$elements.attr('data-target'));

			$target.on('click.context.data-api', function (e) {
				if($(this).data('_context_this_ref') == _this) {
					_this.onItem.call(this,e,$(e.target));
				}
			});

			$('html').on('click.context.data-api', function (e) {
				if (!e.ctrlKey) {
					$target.removeClass('open');
				}
			});
		}

		,destroy: function() {
			this.$elements.off('.context.data-api').removeData('context');
			$('html').off('.context.data-api');

			var $target = $(this.$elements.attr('data-target'));
			$target.off('.context.data-api');
		}

		,getMenu: function () {
			var selector = this.$elements.attr('data-target')
				, $menu;

			if (!selector) {
				selector = this.$elements.attr('href')
				selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
			}

			$menu = $(selector);

			return $menu;
		}

		,getPosition: function(e, $menu) {
			var mouseX = e.clientX
				, mouseY = e.clientY
				, boundsX = $(window).width()
				, boundsY = $(window).height()
				, menuWidth = $menu.find('.dropdown-menu').outerWidth()
				, menuHeight = $menu.find('.dropdown-menu').outerHeight()
				, tp = {"position":"fixed"}
				, Y, X;

			if (mouseY + menuHeight > boundsY) {
				Y = {"top": mouseY - menuHeight};
			} else {
				Y = {"top": mouseY};
			}

			if ((mouseX + menuWidth > boundsX) && ((mouseX - menuWidth) > 0)) {
				X = {"left": mouseX - menuWidth};
			} else {
				X = {"left": mouseX};
			}

			return $.extend(tp, Y, X);
		}

		,clearMenus: function(e) {
			if (!e.ctrlKey) {
				$('[data-toggle=context]').each(function() {
					this.getMenu()
						.removeClass('open');
				});
			}
		}
	}

	/* CONTEXT MENU PLUGIN DEFINITION
	 * ========================== */

	$.fn.contextmenu = function (option,e) {
		var $this = this;
		return (function () {
			var data = $this.data('context')
				, options = typeof option == 'object' && option

			if (!data) $this.data('context', (data = new ContextMenu($this, options)));
			// "show" method must also be passed the event for positioning
			if (typeof option == 'string') data[option].call(data,e);
		})();
	}

	$.fn.contextmenu.Constructor = ContextMenu;

	/* APPLY TO STANDARD CONTEXT MENU ELEMENTS
	 * =================================== */

	$(document)
		.on('contextmenu.context.data-api', '[data-toggle=context]', function(e) {
				$(this).contextmenu('show',e);
				e.preventDefault();
		});

}(window.jQuery));

/** Zen Forms 1.0.3 | MIT License | git.io/zen-form */

(function ($) {

    $.fn.zenForm = function (settings) {

        settings = $.extend({
            trigger: '.go-zen',
            theme: 'dark'
        }, settings);

        /**
         * Helper functions
         */
        var Utils = {

            /**
             * (Un)Wrap body content to hide overflow
             */
            bodyWrap: function () {

                var $body = $('body'),
                    $wrap = $body.children('.zen-forms-body-wrap');

                if ($wrap.length) {
                    $wrap.children().unwrap();
                } else {
                    $body.wrapInner('<div class="zen-forms-body-wrap"/>');
                }

            }, // bodyWrap

            /**
             * Watch inputs and add "empty" class if needed
             */
            watchEmpty: function () {

                App.Environment.find('input, textarea, select').each(function () {

                   $(this).on('change', function () {

                        $(this)[$(this).val() ? 'removeClass' : 'addClass']('empty');

                   }).trigger('change');

                });

            },

            /**
             * Custom styled selects
             */
            customSelect: function ($select, $customSelect) {

                var $selected;

                $customSelect.on('click', function (event) {

                    event.stopPropagation();

                    $selected = $customSelect.find('.selected');

                    $customSelect.toggleClass('is-open');

                    if ($customSelect.hasClass('is-open')) {
                        $customSelect.scrollTop(
                            $selected.position().top - $selected.outerHeight()
                        );
                    }


                }).find('a').on('click', function () {

                    $(this).addClass('selected').siblings().removeClass('selected');

                    $select.val($(this).data('value'));

                });

            }, // customSelect

            /**
             * Hide any elements(mostly selects) when clicked outside them
             */
            manageSelects: function () {

                $(document).on('click', function () {
                    $('.is-open').removeClass('is-open');
                });

            }, // manageSelects

            /**
             * Hide any elements(mostly selects) when clicked outside them
             */
            focusFirst: function () {

                var $first = App.Environment.find('input').first();

                // we need to re-set value to remove focus selection
                $first.focus().val($first.val());

            } // focusFirst

        }, // Utils

        /**
         * Core functionality
         */
        App = {

            /**
             * Orginal form element
             */
            Form: null,

            /**
             * Wrapper element
             */
            Environment: null,

            /**
             * Functions to create and manipulate environment
             */
            env: {


                /**
                 * Object where elements created with App.env.addObject are appended
                 */
                wrapper: null,

                create: function () {

                    // Callback: zf-initialize
                    App.Form.trigger('zf-initialize');

                    Utils.bodyWrap();

                    App.Environment = $('<div>', {
                        class: 'zen-forms' + (settings.theme == 'dark' ? '' : ' light-theme')
                    }).hide().appendTo('body').fadeIn(200);

                    // ESC to exit. Thanks @ktmud
                    $('body').on('keydown', function (event) {

                        if (event.which == 27)
                            App.env.destroy($elements);

                    });

                    return App.Environment;

                }, // create

                /**
                 * Update orginal inputs with new values and destroy Environment
                 */
                destroy: function ($elements) {

                    // Callback: zf-destroy
                    App.Form.trigger('zf-destroy', App.Environment);

                    $('body').off('keydown');

                    // Update orginal inputs with new values
                    $elements.each(function (i) {

                        var $el = $('#zen-forms-input' + i);

                        if ($el.length) {
                            $(this).val($el.val());
                        }

                    });

                    Utils.bodyWrap();

                    // Hide and remove Environment
                    App.Environment.fadeOut(200, function () {

                        App.env.wrapper = null;

                        App.Environment.remove();

                    });

                    // Callback: zf-destroyed
                    App.Form.trigger('zf-destroyed');

                }, // destroy

                /**
                 * Append inputs, textareas to Environment
                 */
                add: function ($elements) {

                    var $el, $label, value, id, ID, label;

                    $elements.each(function (i) {

                        App.env.wrapper = App.env.createObject('div', {
                            class: 'zen-forms-input-wrap'
                        }).appendTo(App.Environment);

                        $el = $(this);

                        value = $el.val();

                        id = $el.attr('id');

                        ID = 'zen-forms-input' + i;

                        label = $el.data('label') || $("label[for=" + id + "]").text() || $el.attr('placeholder') || '';

                        // Exclude specified elements
                        if ($.inArray( $el.attr('type'), ['checkbox', 'radio', 'submit']) == -1) {

                            if ($el.is('input') )
                                App.env.addInput($el, ID, value);
                            else if ($el.is('select') )
                                App.env.addSelect($el, ID);
                            else
                                App.env.addTextarea($el, ID, value);

                            $label = App.env.addObject('label', {
                                for: ID,
                                text: label
                            });

                            if ($el.is('select') )
                                $label.prependTo(App.env.wrapper);

                        }

                    });

                    // Callback: zf-initialized
                    App.Form.trigger('zf-initialized', App.Environment);

                }, // add

                addInput: function ($input, ID, value) {

                    return App.env.addObject('input', {
                        id: ID,
                        value: value,
                        class: 'input',
                        type: $input.attr('type')
                    });

                }, // addInput

                addTextarea: function ($textarea, ID, value) {

                    return App.env.addObject('textarea', {
                        id: ID,
                        text: value,
                        rows: 5,
                        class: 'input'
                    });

                }, // addTextarea

                addSelect: function ($orginalSelect, ID) {

                    var $select = App.env.addObject('select', {
                            id: ID,
                            class: 'select'
                        }),
                        $options = $orginalSelect.find('option'),
                        $customSelect = App.env.addObject('div', {
                            class: 'custom-select-wrap',
                            html: '<div class="custom-select"></div>'
                        }).children();

                    $select.append($options.clone());

                    $.each($options, function (i, option) {

                        App.env.createObject('a', {
                            href: '#',
                            html: '<span>' + $(option).text() + '</span>' ,
                            'data-value': $(option).attr('value'),
                            class: $(option).prop('selected') ? 'selected' : ''
                        }).appendTo($customSelect);

                    });

                    $select.val($orginalSelect.val());

                    Utils.customSelect($select, $customSelect);

                    return $customSelect;

                }, // addSelect

                /**
                 * Wrapper for creating jQuery objects
                 */
                createObject: function (type, params, fn, fnMethod) {

                    return $('<'+type+'>', params).on(fnMethod || 'click', fn);

                }, // createObject

                /**
                 * Wrapper for adding jQuery objects to wrapper
                 */
                addObject: function (type, params, fn, fnMethod) {

                    return App.env.createObject(type, params, fn, fnMethod).appendTo(App.env.wrapper || App.Environment);

                }, // addObject

                switchTheme: function () {

                    App.Environment.toggleClass('light-theme');

                } // switchTheme

            }, // env

            zen: function ($elements) {

                // Create environment
                App.env.create();

                // Add wrapper div for close and theme buttons
                App.env.wrapper = App.env.createObject('div', {
                    class: 'zen-forms-header'
                }).appendTo(App.Environment);

                // Add close button
                App.env.addObject('a', {
                    class: 'zen-forms-close-button',
                    html: '<i class="zen-icon zen-icon--close"></i> Exit Zen Mode'
                }, function () {
                    App.env.destroy($elements);
                });

                // Add theme switch button
                App.env.addObject('a', {
                    class: 'zen-forms-theme-switch',
                    html: '<i class="zen-icon zen-icon--theme"></i> Switch theme'
                }, function () {
                    App.env.switchTheme();
                });

                // Add inputs and textareas from form
                App.env.add($elements);

                // Additional select functionality
                Utils.manageSelects();

                // Select first input
                Utils.focusFirst();

                // Add .empty class for empty inputs
                Utils.watchEmpty();

            } // zen

        }; // App

        App.Form = $(this);

        var $elements = App.Form.is('form') ? App.Form.find('input, textarea, select') : App.Form;

        $(settings.trigger).on('click', function (event) {

            event.preventDefault();

            App.zen($elements);

        });

        // Command: destroy
        App.Form.on('destroy', function () {
            App.env.destroy($elements);
        });

        // Command: init
        App.Form.on('init', function () {
            App.zen($elements);
        });

        return this;

    };

})(jQuery);
