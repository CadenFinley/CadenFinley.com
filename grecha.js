const MUNDANE_TAGS = ["canvas", "h1", "h2", "h3", "p", "a", "div", "span", "select"];
for (let tagName of MUNDANE_TAGS) {
    window[tagName] = (...children) => tag(tagName, ...children);
}
export function tag(name, ...children) {
    const result = document.createElement(name);
    for (const child of children) {
        if (typeof(child) === 'string') {
            result.appendChild(document.createTextNode(child));
        } else {
            result.appendChild(child);
        }
    }
    result.att$ = function(name, value) {
        this.setAttribute(name, value);
        return this;
    };
    result.onclick$ = function(callback) {
        this.onclick = callback;
        return this;
    };
    result.onchange$ = function(callback) {
        this.onchange = callback;
        return this;
    };
    result.oninput$ = function(callback) {
        this.oninput = callback;
        return this;
    };
    return result;
}

export function img(src) {
    return tag("img").att$("src", src);
}
export function input(type) {
    return tag("input").att$("type", type);
}

export function router(routes) {
    let result = div();
    function syncHash() {
        let hashLocation = document.location.hash.split('#')[1];
        if (!hashLocation) {
            hashLocation = '/';
        }

        if (!(hashLocation in routes)) {
            // TODO(#2): make the route404 customizable in the router component
            const route404 = '/404';

            console.assert(route404 in routes);
            hashLocation = route404;
        }

        result.replaceChildren(routes[hashLocation]());

        return result;
    };

    syncHash();
    // TODO(#3): there is way to "destroy" an instance of the router to make it remove it's "hashchange" callback
    window.addEventListener("hashchange", syncHash);
    result.refresh = syncHash;
    return result;
}

export const canvas = (...children) => tag("canvas", ...children);
export const h1     = (...children) => tag("h1",     ...children);
export const h2     = (...children) => tag("h2",     ...children);
export const h3     = (...children) => tag("h3",     ...children);
export const p      = (...children) => tag("p",      ...children);
export const a      = (...children) => tag("a",      ...children);
export const div    = (...children) => tag("div",    ...children);
export const span   = (...children) => tag("span",   ...children);
export const select = (...children) => tag("select", ...children);
export const textarea = (...children) => tag("textarea", ...children);