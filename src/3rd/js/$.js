// SPDX-FileCopyrightText: 2023 Leon van Kammen/NLNET
//
// SPDX-License-Identifier: MPL-2.0

// the core project uses #vanillajs #proxies #clean #noframework
var $      = typeof $   != 'undefined' ? $  : (s) => document.querySelector(s)            // respect jquery
var $$     = typeof $$  != 'undefined' ? $$ : (s) => [...document.querySelectorAll(s)]    // zepto etc.

var $el = (html,tag) => {
  let el = document.createElement('div')
  el.innerHTML = html
  return el.children[0]
}
