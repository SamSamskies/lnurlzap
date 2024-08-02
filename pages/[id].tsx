import { validateNostrId } from "@/utils";
import { GetServerSideProps } from "next";

export { Lnurl as default } from "@/components/Lnurl";

interface PageProps {
  id: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const normalizedId = id.replace(/^nostr:/, "");
  const isValidId = validateNostrId(normalizedId);

  return {
    props: {
      id: normalizedId,
      error: isValidId ? null : `${id} is not a valid Nostr ID.`,
    },
  };
};
