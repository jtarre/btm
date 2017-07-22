export const checkComments = (link) => {
  return link.href && !link.href.includes('comments')
}

export const checkLinkSection = (link) => {
  return link.href && (link.href.includes("/politics/") || link.href.includes("/opinion/")) && !link.href.includes("index.html");
}

const checkUndefinedDescendants = (descendants) => {
  return descendants[0] === undefined;
}

const checkHasProperTextElements = (descendants) => {
  let result = false;
  descendants.forEach(descendant => {
    if (descendant['childNodes'][0] !== undefined) {
      if (descendant['childNodes'][0]['nodeName'] === '#text' && $(descendant['childNodes'][0]).parents('figcaption').length === 0) {
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
