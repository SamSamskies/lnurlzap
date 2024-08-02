import { bech32 } from "bech32";
import { utf8ToBytes } from "@noble/hashes/utils";

export const encodeLnurl = (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_LNURLZAP_BASE_URL}/api/zap/${id}`;
  const words = bech32.toWords(utf8ToBytes(url));

  return bech32.encode("lnurl", words, 1023).toUpperCase();
};
