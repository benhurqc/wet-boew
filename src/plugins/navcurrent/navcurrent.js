/**
 * @title WET-BOEW NavCurrent
 * @overview Identify URL in a navigation system that matches current page URL or a URL in the breadcrumb trail. Call by applying .trigger( "navcurr.wb", breadcrumb ) where the breadcrumb parameter is an optional object (DOM or jQuery)
 * @license wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html
 * @author @pjackson28
 */
(function( $, window, wb ) {
"use strict";

/*
 * Variable and function definitions.
 * These are global to the plugin - meaning that they will be initialized once per page,
 * not once per instance of plugin on the page. So, this is a good place to define
 * variables that are common to all instances of the plugin on a page.
 */
var $document = wb.doc,
	breadcrumbLinksArray, breadcrumbLinksUrlArray,
	navClass = "wb-navcurr",

	/**
	 * We start the logic for what the plugin truly does
	 * For demonstration purposes lets display some text with an alert
	 * @method otherEvent
	 * @param {jQuery Event} event The event that triggered this method call
	 * @param {jQuery DOM element | DOM element} breadcrumb Optional breadcrumb element
	 */
	navCurrent = function( event, breadcrumb ) {
		if ( event.namespace === "wb" ) {
			var menu = event.target,
				menuLinks = menu.getElementsByTagName( "a" ),
				menuLinksArray = [],
				menuLinksUrlArray = [],
				windowLocation = window.location,
				pageUrl = windowLocation.hostname + windowLocation.pathname.replace( /^([^\/])/, "/$1" ),
				pageUrlQuery = windowLocation.search,
				match = false,
				len, i, j, link, linkHref, linkUrl, linkQuery, linkQueryLen,
				localBreadcrumbLinks, localBreadcrumbLinksArray, localBreadcrumbLinksUrlArray,
				localBreadcrumbQuery, localBreadcrumbLinkUrl;

			// Try to find a match with the page Url and cache link + Url for later if no match found
			// Perform the check and caching in reverse to go from more specific links to more general links
			for ( i = menuLinks.length - 1; i !== -1; i -= 1 ) {
				link = menuLinks[ i ];
				linkHref = link.getAttribute( "href" );
				if ( linkHref !== null ) {
					if ( linkHref.length !== 0 && linkHref.charAt( 0 ) !== "#" ) {
						linkUrl = link.hostname + link.pathname.replace( /^([^\/])/, "/$1" );
						linkQuery = link.search;
						linkQueryLen = linkQuery.length;
						if ( pageUrl.slice( -linkUrl.length ) === linkUrl && ( linkQueryLen === 0 || pageUrlQuery.slice( -linkQueryLen ) === linkQuery ) ) {
							match = true;
							break;
						}
						menuLinksArray.push( link );
						menuLinksUrlArray.push( linkUrl );
					}
				}
			}

			// No page Url match found, try a breadcrumb link match instead
			if ( !match && breadcrumb ) {

				// Check to see if the data has been cached already
				if ( !breadcrumbLinksArray ) {

					// Pre-process the breadcrumb links
					localBreadcrumbLinksArray = [];
					localBreadcrumbLinksUrlArray = [];
					localBreadcrumbLinks = ( breadcrumb.jquery ? breadcrumb[ 0 ] : breadcrumb ).getElementsByTagName( "a" );
					len = localBreadcrumbLinks.length;
					for ( i = 0; i !== len; i += 1 ) {
						link = localBreadcrumbLinks[ i ];
						linkHref = link.getAttribute( "href" );
						if ( linkHref.length !== 0 && linkHref.charAt( 0 ) !== "#" ) {
							localBreadcrumbLinksArray.push( link );
							localBreadcrumbLinksUrlArray.push( link.hostname + link.pathname.replace( /^([^\/])/, "/$1" ) );
						}
					}

					// Cache the data in case of more than one execution (e.g., site menu + secondary navigation)
					breadcrumbLinksArray = localBreadcrumbLinksArray;
					breadcrumbLinksUrlArray = localBreadcrumbLinksUrlArray;
				} else {

					// Retrieve the cached data
					localBreadcrumbLinksArray = breadcrumbLinksArray;
					localBreadcrumbLinksUrlArray = breadcrumbLinksUrlArray;
				}

				// Try to match each breadcrumb link
				len = menuLinksArray.length;
				for ( j = localBreadcrumbLinksArray.length - 1; j !== -1; j -= 1 ) {
					localBreadcrumbLinkUrl = localBreadcrumbLinksUrlArray[ j ];
					localBreadcrumbQuery = localBreadcrumbLinksArray[ j ].search;

					for ( i = 0; i !== len; i += 1 ) {
						link = menuLinksArray[ i ];
						linkUrl = menuLinksUrlArray[ i ];
						linkQuery = link.search;
						linkQueryLen = linkQuery.length;

						if ( localBreadcrumbLinkUrl.slice( -linkUrl.length ) === linkUrl && ( linkQueryLen === 0 || localBreadcrumbQuery.slice( -linkQueryLen ) === linkQuery ) ) {
							match = true;
							break;
						}
					}
					if ( match ) {
						break;
					}
				}
			}

			if ( match ) {
				link.className += " " + navClass;
				if ( menu.className.indexOf( "wb-menu" ) !== -1 && link.className.indexOf( "item" ) === -1 ) {
					$( link ).closest( ".sm" ).parent().children( "a" ).addClass( navClass );
				}
			}
		}
	};

// Bind the navcurrent event of the plugin
$document.on( "navcurr.wb", navCurrent );

})( jQuery, window, wb );
