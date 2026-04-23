import Markdown from 'markdown-to-jsx';
import fs from 'fs';
import matter from 'gray-matter';

function getMarkdownData() {
  const contentDirectory = 'src/legacy-markdown/';
  const fileName = 'imprint';
  const filePath = `${contentDirectory}${fileName}.md`;
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const matterResult = matter(fileContents);

  return matterResult.content;
}

function Imprint() {
  const markdownData = getMarkdownData();

  return (
    <div className="mx-auto flex w-full justify-center px-6 py-10">
      <article className="prose-imprint bg-mint prose p-5 text-black sm:prose-2xl">
        <Markdown>{markdownData}</Markdown>
      </article>
    </div>
  );
}

export default Imprint;
