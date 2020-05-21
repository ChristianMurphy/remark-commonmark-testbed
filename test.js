const unified = require("unified");
const remarkParse = require("remark-parse");
const remarkToRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");
const specs = require("./spec.json");

const specTable = specs.map((spec) => [
  spec.example,
  spec.section,
  spec.markdown,
  spec.html,
]);
const pipeline = unified()
  .use(remarkParse, { commonmark: true, gfm: false, pedantic: false })
  .use(remarkToRehype, { allowDangerousHtml: true, commonmark: true })
  .use(rehypeStringify, { closeSelfClosing: true });

describe.each(specTable)("%i %s", (...props) => {
  test("output should match spec", () => {
    expect(pipeline.processSync(props[2]).contents + "\n").toBe(props[3]);
  });
});
