export function arrayToHtmlArticleList(
  values: string[],
  title: string,
): string {
  if (!values.length) return '';
  const listItems = arrayToHtmlListItems(values);
  return `
  <article>
    <h4>${title}:</h4>
    <ul>
      ${listItems}
    </ul>
  </article>`;
}

export function arrayToHtmlListItems(values: string[]): string {
  return values.map((lan) => `<li>${lan}</li>`).join('');
}

export function stringToHtmlAnchor(href: string, label: string): string {
  return `<a href="${href}" target="_blank">${label}</a>`;
}

export function stringToHtmlImg(src: string, alt?: string) {
  return `<img src="${src}" alt="${alt}">`;
}
