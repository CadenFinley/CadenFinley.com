const MUNDANE_TAGS = ["canvas", "h1", "h2", "h3", "p", "a", "div", "span", "select", "textarea"];
const tagFunctions = {};
for (let tagName of MUNDANE_TAGS) {
    const tagFunction = (...children) => tag(tagName, ...children);
    window[tagName] = tagFunction;
    tagFunctions[tagName] = tagFunction;
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

// Export all tag functions dynamically
export const { canvas, h1, h2, h3, p, a, div, span, select, textarea } = tagFunctions;