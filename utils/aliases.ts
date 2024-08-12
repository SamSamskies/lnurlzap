import { verifyEvent } from "nostr-tools/pure";

const ALIASES = {
  letthezapsflow: {
    sig: "5c1f5c1f6952e6548d3d957b4081511860add01501702e59c226b148bab438306ab234d3d32de8c51d280a59e0ee832f22bab8ac312502524beecd432a56730f",
    id: "e0f96f8282e8b19fa50eaa6b02dfc0b5fa19183d72ca3d958d71e78615727bd8",
    created_at: 1677550598,
    pubkey: "32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245",
    content: "the zaps must flow",
    kind: 1,
    tags: [],
  },
  notbiebs: {
    id: "572c20ce2970e11b2e801f8663654e5dbf7f4415837e72eedf3259726ada4fef",
    pubkey: "604e96e099936a104883958b040b47672e0f048c98ac793f37ffe4c720279eb2",
    created_at: 1721601546,
    kind: 0,
    tags: [],
    content:
      '{"about":"impermanently impermanent 🤙\\n\\nBOLT12 lightning address: ₿dn@nostrstuff.com\\n\\nhttps://quotestr.vercel.app\\nhttps://advancednostrsearch.vercel.app\\nhttps://github.com/SamSamskies/nostr-zap","banner":"https://i.nostr.build/4Ykm.gif","lud16":"samsamskies@strike.me","name":"NotBiebs","nip05":"justinbieber@stemstr.app","picture":"https://i.nostr.build/2RAjA.gif","website":"https://youtu.be/SBiwLibZqfw","bip353":"₿dn@nostrstuff.com"}',
    sig: "5c351137dc02f70c8147f4865764659201acbd760bf9045aa744005fdf87fdfd38f043937400b96a93bfbf4ffde3e5cb7ce3e313d47705b6f1d2c742f39a5166",
  },
};

export const getEventByAlias = (alias: string) => {
  const event = ALIASES[alias];

  return event && verifyEvent(event) ? event : null;
};
