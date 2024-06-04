const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Endpoint to write a markdown file with YAML frontmatter to a specified path within the '/content' folder.
 * @name post/api/write-markdown
 * @param {Object} request.body - The request body containing the file details.
 * @param {string} request.body.filePath - The path of the file to be written, relative to the '/content' directory.
 * @param {string} request.body.content - The markdown content to be written to the file.
 * @param {Object} request.body.frontMatter - The front matter as a JSON object, which will be converted to YAML.
 * @returns {Object} 200 - { message: 'File written successfully' }
 * @returns {Object} 400 - { error: 'Invalid file path' }
 * @returns {Object} 500 - { error: 'Failed to write file' }
 */
fastify.post('/api/write-markdown', async (request, reply) => {
  const { filePath, content, frontMatter } = request.body;

  // Check if the file path is within the '/content' directory
  const contentDir = path.join(__dirname, 'content');
  const resolvedPath = path.resolve(contentDir, filePath);

  if (!resolvedPath.startsWith(contentDir)) {
    reply.code(400).send({ error: 'Invalid file path' });
    return;
  }

  try {
    // Convert the frontMatter JSON object to YAML
    const frontMatterYAML = yaml.dump(frontMatter);

    // Prepend the YAML front matter to the content
    const fileContent = `---\n${frontMatterYAML}---\n\n${content}`;

    // Create directories if they don't exist
    const dirPath = path.dirname(resolvedPath);
    fs.mkdirSync(dirPath, { recursive: true });

    // Write the content to the file
    fs.writeFileSync(resolvedPath, fileContent);

    reply.send({ message: 'File written successfully' });
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Failed to write file' });
  }
});

/**
 * Endpoint to read a markdown file (including YAML frontmatter) from the '/content' folder.
 * @name get/api/read-markdown
 * @param {Object} request.query - The query parameters.
 * @param {string} request.query.filePath - The path of the file to be read, relative to the '/content' directory.
 * @returns {Object} 200 - { content: string, frontMatter: Object }
 * @returns {Object} 400 - { error: 'Invalid file path' }
 * @returns {Object} 404 - { error: 'File not found' }
 */
fastify.get('/api/read-markdown', async (request, reply) => {
  const { filePath } = request.query;

  // Check if the file path is within the '/content' directory
  const contentDir = path.join(__dirname, '../content');
  const resolvedPath = path.resolve(contentDir, filePath);
  console.log({ resolvedPath })

  if (!resolvedPath.startsWith(contentDir)) {
    reply.code(400).send({ error: 'Invalid file path' });
    return;
  }

  try {
    const fileContent = fs.readFileSync(resolvedPath, 'utf-8');

    // Parse the YAML frontmatter and markdown content
    const frontMatterMatch = fileContent.match(/---\n([\s\S]+?)\n---\n([\s\S]+)/);

    if (frontMatterMatch) {
      const frontMatterYAML = frontMatterMatch[1];
      const markdownContent = frontMatterMatch[2];

      const frontMatter = yaml.load(frontMatterYAML);

      reply.send({ content: markdownContent, frontMatter });
    } else {
      reply.send({ content: fileContent, frontMatter: {} });
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      reply.code(404).send({ error: 'File not found' });
    } else {
      fastify.log.error(err);
      reply.code(500).send({ error: 'Failed to read file' });
    }
  }
});

/**
 * Endpoint to retrieve an array of items.
 * @name get/api/items
 * @returns {Object} 200 - { items: [] }
 */
fastify.get('/api/items', async (request, reply) => {
  reply.send({ items: [] });
});

fastify.listen({ port: 5778 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});