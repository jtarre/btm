/* ------ Helpers ------ */

export const checkIsArticle = (link) => {
  return link.href && !link.href.includes('/comments/') && !link.href.includes('/video/')
}

export const checkLinkSection = (link) => {
  return link.href && (link.href.includes("/politics/") || link.href.includes("/opinion/"))
          && !link.href.includes("index.html") && $(link).parents('p').length === 0
          && !link.href.endsWith("#");
}

const checkUndefinedDescendants = (descendants) => {
  return descendants[0] === undefined;
}

const checkHasProperTextElements = (descendants) => {
  let result = false;
  let firstChildOfDescendant = undefined;
  descendants.forEach(descendant => {
    if (descendant['childNodes'][0] !== undefined) {
      firstChildOfDescendant = descendant['childNodes'][0];
      if (firstChildOfDescendant['nodeName'] === '#text' &&
          $(firstChildOfDescendant).parents('figcaption').length === 0) {
        result = true;
      }
    }
    if (descendant['nextSibling'] !== null) {
      if (descendant['nextSibling']['nodeName'] === '#text' && descendant['nodeName'] !== "DIV" && $.trim(descendant['nextSibling']['textContent']) !== "") {
        result = true;
      }
    }
  });
  return result;
}

export const checkDescendants = (descendants) => {
  return checkUndefinedDescendants(descendants) || checkHasProperTextElements(descendants)
}

/* ------ getLinks() ------ */

import _ from 'lodash';

export const getLinks = () => {
  const allLinks = $('a').not('.button').toArray()
    .filter(link => {
      const descendants = $(link).find('*').toArray();
      return link.href && checkIsArticle(link) && checkLinkSection(link) && checkDescendants(descendants)
    })
  return _.uniqBy(allLinks, link => link.href)
}
