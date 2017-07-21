export const checkComments = (link) => {
  return link.href && !link.href.includes('comments')
}

export const hasUndefinedElements = (elements) => {
  return elements[0] === undefined;
}

export const hasProperTextElements = (elements) => {
  let result = false;
  elements.forEach(element => {
    if (element['childNodes'][0] !== undefined) {
      if (element['childNodes'][0]['nodeName'] === '#text' && $(element['childNodes'][0]).parents('figcaption').length === 0) {
        result = true;
      }
    }
    if (element['nextSibling'] !== null) {
      if (element['nextSibling']['nodeName'] === '#text' && element['nodeName'] !== "DIV" && $.trim(element['nextSibling']['textContent']) !== "") {
        result = true;
      }
    }
  });
  return result;
}
