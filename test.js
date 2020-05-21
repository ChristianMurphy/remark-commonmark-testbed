const unified = require("unified");
const remarkParse = require("remark-parse");
const remarkToRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");
const remarkStringify = require("remark-stringify");
const commonmarkSpecs = require("commonmark.json");

const commonmarkSpecTable = commonmarkSpecs.map(
  ({ section, markdown, html }) => [[section, markdown, html]]
);
const markdownToHtml = unified()
  .use(remarkParse, { commonmark: true, gfm: false, pedantic: false })
  .use(remarkToRehype, { allowDangerousHtml: true, commonmark: true })
  .use(rehypeStringify, { closeSelfClosing: true });

const markdownToMarkdown = unified()
  .use(remarkParse, { commonmark: true, gfm: false, pedantic: false })
  .use(remarkStringify, { allowDangerousHtml: true, commonmark: true });

describe.each(commonmarkSpecTable)("%# %p", ([section, markdown, html]) => {
  it("should produce html to spec", async () => {
    await expect(markdownToHtml.process(markdown)).resolves.toHaveProperty(
      "contents",
      html
    );
  });

  it("should produce same markdown", async () => {
    await expect(markdownToMarkdown.process(markdown)).resolves.toHaveProperty(
      "contents",
      markdown
    );
  });
});
