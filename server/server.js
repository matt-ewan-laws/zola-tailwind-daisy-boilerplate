const fastify = require('fastify')({ logger: true });

fastify.get('/api/items', async (request, reply) => {
  reply.send({ items: [] });
});

fastify.listen({ port: 3000 }, (err, address) => {
      if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
});
