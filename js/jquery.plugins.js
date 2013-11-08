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
                        rows: 20,
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

/* ===========================================================
 * bootstrap-modalmanager.js v2.2.0
 * ===========================================================
 * Copyright 2012 Jordan Schroter.
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
 * ========================================================== */

!function ($) {

	"use strict"; // jshint ;_;

	/* MODAL MANAGER CLASS DEFINITION
	* ====================== */

	var ModalManager = function (element, options) {
		this.init(element, options);
	};

	ModalManager.prototype = {

		constructor: ModalManager,

		init: function (element, options) {
			this.$element = $(element);
			this.options = $.extend({}, $.fn.modalmanager.defaults, this.$element.data(), typeof options == 'object' && options);
			this.stack = [];
			this.backdropCount = 0;

			if (this.options.resize) {
				var resizeTimeout,
					that = this;

				$(window).on('resize.modal', function(){
					resizeTimeout && clearTimeout(resizeTimeout);
					resizeTimeout = setTimeout(function(){
						for (var i = 0; i < that.stack.length; i++){
							that.stack[i].isShown && that.stack[i].layout();
						}
					}, 10);
				});
			}
		},

		createModal: function (element, options) {
			$(element).modal($.extend({ manager: this }, options));
		},

		appendModal: function (modal) {
			this.stack.push(modal);

			var that = this;

			modal.$element.on('show.modalmanager', targetIsSelf(function (e) {

				var showModal = function(){
					modal.isShown = true;

					var transition = $.support.transition && modal.$element.hasClass('fade');

					that.$element
						.toggleClass('modal-open', that.hasOpenModal())
						.toggleClass('page-overflow', $(window).height() < that.$element.height());

					modal.$parent = modal.$element.parent();

					modal.$container = that.createContainer(modal);

					modal.$element.appendTo(modal.$container);

					that.backdrop(modal, function () {
						modal.$element.show();

						if (transition) {       
							//modal.$element[0].style.display = 'run-in';       
							modal.$element[0].offsetWidth;
							//modal.$element.one($.support.transition.end, function () { modal.$element[0].style.display = 'block' });  
						}
						
						modal.layout();

						modal.$element
							.addClass('in')
							.attr('aria-hidden', false);

						var complete = function () {
							that.setFocus();
							modal.$element.trigger('shown');
						};

						transition ?
							modal.$element.one($.support.transition.end, complete) :
							complete();
					});
				};

				modal.options.replace ?
					that.replace(showModal) :
					showModal();
			}));

			modal.$element.on('hidden.modalmanager', targetIsSelf(function (e) {

				that.backdrop(modal);
				if (modal.$backdrop){
					var transition = $.support.transition && modal.$element.hasClass('fade');

					// trigger a relayout due to firebox's buggy transition end event 
					if (transition) { modal.$element[0].offsetWidth; }

					$.support.transition && modal.$element.hasClass('fade') ?
						modal.$backdrop.one($.support.transition.end, function () { that.destroyModal(modal) }) :
						that.destroyModal(modal);
				} else {
					that.destroyModal(modal);
				}

			}));

			modal.$element.on('destroy.modalmanager', targetIsSelf(function (e) {
				that.removeModal(modal);
			}));

		},

		destroyModal: function (modal) {
			modal.destroy();

			var hasOpenModal = this.hasOpenModal();

			this.$element.toggleClass('modal-open', hasOpenModal);

			if (!hasOpenModal){
				this.$element.removeClass('page-overflow');
			}

			this.removeContainer(modal);

			this.setFocus();
		},

		getOpenModals: function () {
			var openModals = [];
			for (var i = 0; i < this.stack.length; i++){
				if (this.stack[i].isShown) openModals.push(this.stack[i]);
			}

			return openModals;
		},

		hasOpenModal: function () {
			return this.getOpenModals().length > 0;
		},

		setFocus: function () {
			var topModal;

			for (var i = 0; i < this.stack.length; i++){
				if (this.stack[i].isShown) topModal = this.stack[i];
			}

			if (!topModal) return;

			topModal.focus();

		},

		removeModal: function (modal) {
			modal.$element.off('.modalmanager');
			if (modal.$backdrop) this.removeBackdrop(modal);
			this.stack.splice(this.getIndexOfModal(modal), 1);
		},

		getModalAt: function (index) {
			return this.stack[index];
		},

		getIndexOfModal: function (modal) {
			for (var i = 0; i < this.stack.length; i++){
				if (modal === this.stack[i]) return i;
			}
		},

		replace: function (callback) {
			var topModal;

			for (var i = 0; i < this.stack.length; i++){
				if (this.stack[i].isShown) topModal = this.stack[i];
			}

			if (topModal) {
				this.$backdropHandle = topModal.$backdrop;
				topModal.$backdrop = null;

				callback && topModal.$element.one('hidden',
					targetIsSelf( $.proxy(callback, this) ));

				topModal.hide();
			} else if (callback) {
				callback();
			}
		},

		removeBackdrop: function (modal) {
			modal.$backdrop.remove();
			modal.$backdrop = null;
		},

		createBackdrop: function (animate, tmpl) {
			var $backdrop;

			if (!this.$backdropHandle) {
				$backdrop = $(tmpl)
					.addClass(animate)
					.appendTo(this.$element);
			} else {
				$backdrop = this.$backdropHandle;
				$backdrop.off('.modalmanager');
				this.$backdropHandle = null;
				this.isLoading && this.removeSpinner();
			}

			return $backdrop;
		},

		removeContainer: function (modal) {
			modal.$container.remove();
			modal.$container = null;
		},

		createContainer: function (modal) {
			var $container;

			$container = $('<div class="modal-scrollable">')
				.css('z-index', getzIndex('modal', this.getOpenModals().length))
				.appendTo(this.$element);

			if (modal && modal.options.backdrop != 'static') {
				$container.on('click.modal', targetIsSelf(function (e) {
					modal.hide();
				}));
			} else if (modal) {
				$container.on('click.modal', targetIsSelf(function (e) {
					modal.attention();
				}));
			}

			return $container;

		},

		backdrop: function (modal, callback) {
			var animate = modal.$element.hasClass('fade') ? 'fade' : '',
				showBackdrop = modal.options.backdrop &&
					this.backdropCount < this.options.backdropLimit;

			if (modal.isShown && showBackdrop) {
				var doAnimate = $.support.transition && animate && !this.$backdropHandle;

				modal.$backdrop = this.createBackdrop(animate, modal.options.backdropTemplate);

				modal.$backdrop.css('z-index', getzIndex( 'backdrop', this.getOpenModals().length ));

				if (doAnimate) modal.$backdrop[0].offsetWidth; // force reflow

				modal.$backdrop.addClass('in');

				this.backdropCount += 1;

				doAnimate ?
					modal.$backdrop.one($.support.transition.end, callback) :
					callback();

			} else if (!modal.isShown && modal.$backdrop) {
				modal.$backdrop.removeClass('in');

				this.backdropCount -= 1;

				var that = this;

				$.support.transition && modal.$element.hasClass('fade')?
					modal.$backdrop.one($.support.transition.end, function () { that.removeBackdrop(modal) }) :
					that.removeBackdrop(modal);

			} else if (callback) {
				callback();
			}
		},

		removeSpinner: function(){
			this.$spinner && this.$spinner.remove();
			this.$spinner = null;
			this.isLoading = false;
		},

		removeLoading: function () {
			this.$backdropHandle && this.$backdropHandle.remove();
			this.$backdropHandle = null;
			this.removeSpinner();
		},

		loading: function (callback) {
			callback = callback || function () { };

			this.$element
				.toggleClass('modal-open', !this.isLoading || this.hasOpenModal())
				.toggleClass('page-overflow', $(window).height() < this.$element.height());

			if (!this.isLoading) {

				this.$backdropHandle = this.createBackdrop('fade', this.options.backdropTemplate);

				this.$backdropHandle[0].offsetWidth; // force reflow

				var openModals = this.getOpenModals();

				this.$backdropHandle
					.css('z-index', getzIndex('backdrop', openModals.length + 1))
					.addClass('in');

				var $spinner = $(this.options.spinner)
					.css('z-index', getzIndex('modal', openModals.length + 1))
					.appendTo(this.$element)
					.addClass('in');

				this.$spinner = $(this.createContainer())
					.append($spinner)
					.on('click.modalmanager', $.proxy(this.loading, this));

				this.isLoading = true;

				$.support.transition ?
					this.$backdropHandle.one($.support.transition.end, callback) :
					callback();

			} else if (this.isLoading && this.$backdropHandle) {
				this.$backdropHandle.removeClass('in');

				var that = this;
				$.support.transition ?
					this.$backdropHandle.one($.support.transition.end, function () { that.removeLoading() }) :
					that.removeLoading();

			} else if (callback) {
				callback(this.isLoading);
			}
		}
	};

	/* PRIVATE METHODS
	* ======================= */

	// computes and caches the zindexes
	var getzIndex = (function () {
		var zIndexFactor,
			baseIndex = {};

		return function (type, pos) {

			if (typeof zIndexFactor === 'undefined'){
				var $baseModal = $('<div class="modal hide" />').appendTo('body'),
					$baseBackdrop = $('<div class="modal-backdrop hide" />').appendTo('body');

				baseIndex['modal'] = +$baseModal.css('z-index');
				baseIndex['backdrop'] = +$baseBackdrop.css('z-index');
				zIndexFactor = baseIndex['modal'] - baseIndex['backdrop'];

				$baseModal.remove();
				$baseBackdrop.remove();
				$baseBackdrop = $baseModal = null;
			}

			return baseIndex[type] + (zIndexFactor * pos);

		}
	}());

	// make sure the event target is the modal itself in order to prevent
	// other components such as tabsfrom triggering the modal manager.
	// if Boostsrap namespaced events, this would not be needed.
	function targetIsSelf(callback){
		return function (e) {
			if (this === e.target){
				return callback.apply(this, arguments);
			}
		}
	}


	/* MODAL MANAGER PLUGIN DEFINITION
	* ======================= */

	$.fn.modalmanager = function (option, args) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('modalmanager');

			if (!data) $this.data('modalmanager', (data = new ModalManager(this, option)));
			if (typeof option === 'string') data[option].apply(data, [].concat(args))
		})
	};

	$.fn.modalmanager.defaults = {
		backdropLimit: 999,
		resize: true,
		spinner: '<div class="loading-spinner fade" style="width: 200px; margin-left: -100px;"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div>',
		backdropTemplate: '<div class="modal-backdrop" />'
	};

	$.fn.modalmanager.Constructor = ModalManager

}(jQuery);

/* ===========================================================
 * bootstrap-modal.js v2.2.0
 * ===========================================================
 * Copyright 2012 Jordan Schroter
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
 * ========================================================== */


!function ($) {

	"use strict"; // jshint ;_;

	/* MODAL CLASS DEFINITION
	* ====================== */

	var Modal = function (element, options) {
		this.init(element, options);
	};

	Modal.prototype = {

		constructor: Modal,

		init: function (element, options) {
			var that = this;

			this.options = options;

			this.$element = $(element)
				.delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this));

			this.options.remote && this.$element.find('.modal-body').load(this.options.remote, function () {
				var e = $.Event('loaded');
				that.$element.trigger(e);
			});

			var manager = typeof this.options.manager === 'function' ?
				this.options.manager.call(this) : this.options.manager;

			manager = manager.appendModal ?
				manager : $(manager).modalmanager().data('modalmanager');

			manager.appendModal(this);
		},

		toggle: function () {
			return this[!this.isShown ? 'show' : 'hide']();
		},

		show: function () {
			var e = $.Event('show');

			if (this.isShown) return;

			this.$element.trigger(e);

			if (e.isDefaultPrevented()) return;

			this.escape();

			this.tab();

			this.options.loading && this.loading();
		},

		hide: function (e) {
			e && e.preventDefault();

			e = $.Event('hide');

			this.$element.trigger(e);

			if (!this.isShown || e.isDefaultPrevented()) return (this.isShown = false);

			this.isShown = false;

			this.escape();

			this.tab();

			this.isLoading && this.loading();

			$(document).off('focusin.modal');

			this.$element
				.removeClass('in')
				.removeClass('animated')
				.removeClass(this.options.attentionAnimation)
				.removeClass('modal-overflow')
				.attr('aria-hidden', true);

			$.support.transition && this.$element.hasClass('fade') ?
				this.hideWithTransition() :
				this.hideModal();
		},

		layout: function () {
			var prop = this.options.height ? 'height' : 'max-height',
				value = this.options.height || this.options.maxHeight;

			if (this.options.width){
				this.$element.css('width', this.options.width);

				var that = this;
				this.$element.css('margin-left', function () {
					if (/%/ig.test(that.options.width)){
						return -(parseInt(that.options.width) / 2) + '%';
					} else {
						return -($(this).width() / 2) + 'px';
					}
				});
			} else {
				this.$element.css('width', '');
				this.$element.css('margin-left', '');
			}

			this.$element.find('.modal-body')
				.css('overflow', '')
				.css(prop, '');

			if (value){
				this.$element.find('.modal-body')
					.css('overflow', 'auto')
					.css(prop, value);
			}

			var modalOverflow = $(window).height() - 10 < this.$element.height();
            
			if (modalOverflow || this.options.modalOverflow) {
				this.$element
					.css('margin-top', 0)
					.addClass('modal-overflow');
			} else {
				this.$element
					.css('margin-top', 0 - this.$element.height() / 2)
					.removeClass('modal-overflow');
			}
		},

		tab: function () {
			var that = this;

			if (this.isShown && this.options.consumeTab) {
				this.$element.on('keydown.tabindex.modal', '[data-tabindex]', function (e) {
			    	if (e.keyCode && e.keyCode == 9){
						var $next = $(this),
							$rollover = $(this);

						that.$element.find('[data-tabindex]:enabled:not([readonly])').each(function (e) {
							if (!e.shiftKey){
						 		$next = $next.data('tabindex') < $(this).data('tabindex') ?
									$next = $(this) :
									$rollover = $(this);
							} else {
								$next = $next.data('tabindex') > $(this).data('tabindex') ?
									$next = $(this) :
									$rollover = $(this);
							}
						});

						$next[0] !== $(this)[0] ?
							$next.focus() : $rollover.focus();

						e.preventDefault();
					}
				});
			} else if (!this.isShown) {
				this.$element.off('keydown.tabindex.modal');
			}
		},

		escape: function () {
			var that = this;
			if (this.isShown && this.options.keyboard) {
				if (!this.$element.attr('tabindex')) this.$element.attr('tabindex', -1);

				this.$element.on('keyup.dismiss.modal', function (e) {
					e.which == 27 && that.hide();
				});
			} else if (!this.isShown) {
				this.$element.off('keyup.dismiss.modal')
			}
		},

		hideWithTransition: function () {
			var that = this
				, timeout = setTimeout(function () {
					that.$element.off($.support.transition.end);
					that.hideModal();
				}, 500);

			this.$element.one($.support.transition.end, function () {
				clearTimeout(timeout);
				that.hideModal();
			});
		},

		hideModal: function () {
			var prop = this.options.height ? 'height' : 'max-height';
			var value = this.options.height || this.options.maxHeight;

			if (value){
				this.$element.find('.modal-body')
					.css('overflow', '')
					.css(prop, '');
			}

			this.$element
				.hide()
				.trigger('hidden');
		},

		removeLoading: function () {
			this.$loading.remove();
			this.$loading = null;
			this.isLoading = false;
		},

		loading: function (callback) {
			callback = callback || function () {};

			var animate = this.$element.hasClass('fade') ? 'fade' : '';

			if (!this.isLoading) {
				var doAnimate = $.support.transition && animate;

				this.$loading = $('<div class="loading-mask ' + animate + '">')
					.append(this.options.spinner)
					.appendTo(this.$element);

				if (doAnimate) this.$loading[0].offsetWidth; // force reflow

				this.$loading.addClass('in');

				this.isLoading = true;

				doAnimate ?
					this.$loading.one($.support.transition.end, callback) :
					callback();

			} else if (this.isLoading && this.$loading) {
				this.$loading.removeClass('in');

				var that = this;
				$.support.transition && this.$element.hasClass('fade')?
					this.$loading.one($.support.transition.end, function () { that.removeLoading() }) :
					that.removeLoading();

			} else if (callback) {
				callback(this.isLoading);
			}
		},

		focus: function () {
			var $focusElem = this.$element.find(this.options.focusOn);

			$focusElem = $focusElem.length ? $focusElem : this.$element;

			$focusElem.focus();
		},

		attention: function (){
			// NOTE: transitionEnd with keyframes causes odd behaviour

			if (this.options.attentionAnimation){
				this.$element
					.removeClass('animated')
					.removeClass(this.options.attentionAnimation);

				var that = this;

				setTimeout(function () {
					that.$element
						.addClass('animated')
						.addClass(that.options.attentionAnimation);
				}, 0);
			}


			this.focus();
		},


		destroy: function () {
			var e = $.Event('destroy');
			this.$element.trigger(e);
			if (e.isDefaultPrevented()) return;

			this.teardown();
		},

		teardown: function () {
			if (!this.$parent.length){
				this.$element.remove();
				this.$element = null;
				return;
			}

			if (this.$parent !== this.$element.parent()){
				this.$element.appendTo(this.$parent);
			}

			this.$element.off('.modal');
			this.$element.removeData('modal');
			this.$element
				.removeClass('in')
				.attr('aria-hidden', true);
		}
	};


	/* MODAL PLUGIN DEFINITION
	* ======================= */

	$.fn.modal = function (option, args) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('modal'),
				options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option);

			if (!data) $this.data('modal', (data = new Modal(this, options)));
			if (typeof option == 'string') data[option].apply(data, [].concat(args));
			else if (options.show) data.show()
		})
	};

	$.fn.modal.defaults = {
		keyboard: true,
		backdrop: true,
		loading: false,
		show: true,
		width: null,
		height: null,
		maxHeight: null,
		modalOverflow: false,
		consumeTab: true,
		focusOn: null,
		replace: false,
		resize: false,
		attentionAnimation: 'shake',
		manager: 'body',
		spinner: '<div class="loading-spinner" style="width: 200px; margin-left: -100px;"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div>',
		backdropTemplate: '<div class="modal-backdrop" />'
	};

	$.fn.modal.Constructor = Modal;


	/* MODAL DATA-API
	* ============== */

	$(function () {
		$(document).off('click.modal').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
			var $this = $(this),
				href = $this.attr('href'),
				$target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))), //strip for ie7
				option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

			e.preventDefault();
			$target
				.modal(option)
				.one('hide', function () {
					$this.focus();
				})
		});
	});

}(window.jQuery);
