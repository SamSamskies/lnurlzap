const ALIASES: { [key: string]: string } = {
  anonzaps: "npub12j2uhpvh6z5sazvr67vhrv799r5ecl8qdzuer4znwkaqxqs2v0ascuu6ms",
  letthezapsflow:
    "note1uruklq5zazcelfgw4f4s9h7qkhapjxpawt9rm9vdw8ncv9tj00vq7s0tp0",
  notbiebs: "npub1vp8fdcyejd4pqjyrjk9sgz68vuhq7pyvnzk8j0ehlljvwgp8n6eqsrnpsw",
  thezapsmustflow:
    "note1uruklq5zazcelfgw4f4s9h7qkhapjxpawt9rm9vdw8ncv9tj00vq7s0tp0",
  npc: "naddr1qqjrgvphxycngcek95cxgefh956rxwfn95urwwty95mrgwf3x43kvvpkvvmngqg3waehxw309ahx7um5wgh8w6twv5hsygx0gknt5ymr44ldyyaq0rn3p5jpzkh8y8ymg773a06ytr4wldxz55psgqqqwensuy5xvs",
};

export const getNip19Id = (alias: string) => ALIASES[alias];
