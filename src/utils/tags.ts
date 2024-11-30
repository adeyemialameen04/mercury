export const Link = (text: string, href: string) => {
  return `<a href=${href}>${text}</a>`;
};

export const BoldUnderline = (text: string) => {
  return `<b><u>${text}</u></b>`;
};
export const Code = (text: string) => {
  return `<code>${text}</code>`
}
