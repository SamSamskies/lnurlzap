const ALIASES: { [key: string]: string } = {
  anonzaps: "npub12j2uhpvh6z5sazvr67vhrv799r5ecl8qdzuer4znwkaqxqs2v0ascuu6ms",
  letthezapsflow:
    "note1uruklq5zazcelfgw4f4s9h7qkhapjxpawt9rm9vdw8ncv9tj00vq7s0tp0",
  notbiebs: "npub1vp8fdcyejd4pqjyrjk9sgz68vuhq7pyvnzk8j0ehlljvwgp8n6eqsrnpsw",
  thezapsmustflow:
    "note1uruklq5zazcelfgw4f4s9h7qkhapjxpawt9rm9vdw8ncv9tj00vq7s0tp0",
  // TODO: remove after 8/12 live stream
  tunestrlivestream:
    "naddr1qq9rzdejxv6nqdpnxc6syg9e6qkt3lw7kxghq8kqvj8r0mgldta6yclqqc8uqcye5c59r5j7qspsgqqqwensd3kj2n",
};

export const getNip19Id = (alias: string) => ALIASES[alias];
