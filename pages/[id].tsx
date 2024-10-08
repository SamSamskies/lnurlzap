import { normalizeId, validateNostrId } from "@/utils";
import { GetServerSideProps } from "next";

export { Lnurl as default } from "@/components/Lnurl";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const normalizedId = await normalizeId(id);
  const isValidId = validateNostrId(normalizedId);

  return {
    props: {
      id,
      normalizedId,
      error: isValidId ? null : `${id} is not a valid Nostr ID.`,
    },
  };
};
