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
            const route404 = '/404';
            console.assert(route404 in routes);
            hashLocation = route404;
        }
        result.replaceChildren(routes[hashLocation]());
        window.scrollTo({top: 0, behavior: 'auto'});
        return result;
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    result.refresh = syncHash;
    result.destroy = function() {
        window.removeEventListener("hashchange", syncHash);
        return this;
    };
    return result;
}

export const { canvas, h1, h2, h3, p, a, div, span, select, textarea } = tagFunctions;
