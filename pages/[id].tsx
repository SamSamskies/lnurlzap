import { validateNostrId } from "@/utils";

export { Lnurl as default } from "@/components/Lnurl";

export const getServerSideProps = ({ params }) => {
  const { id } = params;
  const isValidId = validateNostrId(id);

  return {
    props: { id, error: isValidId ? null : `${id} is not a valid Nostr ID.` },
  };
};
