export const getUrl = function(url) {
    return new URL(`../static/${url}`, import.meta.url).href
}