import { UpdateStripeCredentialsModalContent } from "@/features/blocks/inputs/payment/components/UpdateStripeCredentialsModalContent";
import { SmtpUpdateModalContent } from "@/features/blocks/integrations/sendEmail/components/SmtpUpdateModalContent";
import { UpdateForgedCredentialsModalContent } from "@/features/forge/components/credentials/UpdateForgedCredentialsModalContent";
import { Modal, ModalOverlay } from "@chakra-ui/react";
import type { Credentials } from "@typebot.io/credentials/schemas";
import { forgedBlocks } from "@typebot.io/forge-repository/definitions";

export const CredentialsUpdateModal = ({
  editingCredentials,
  scope,
  onSubmit,
  onClose,
}: {
  editingCredentials?: {
    id: string;
    type: Credentials["type"];
  };
  scope: "workspace" | "user";
  onClose: () => void;
  onSubmit: () => void;
}) => {
  return (
    <Modal isOpen={editingCredentials !== undefined} onClose={onClose}>
      <ModalOverlay />
      {editingCredentials && (
        <CredentialsUpdateModalContent
          editingCredentials={editingCredentials}
          onSubmit={onSubmit}
          scope={scope}
        />
      )}
    </Modal>
  );
};

const CredentialsUpdateModalContent = ({
  editingCredentials,
  scope,
  onSubmit,
}: {
  editingCredentials: {
    id: string;
    type: Credentials["type"];
  };
  scope: "workspace" | "user";
  onSubmit: () => void;
}) => {
  switch (editingCredentials.type) {
    case "google sheets":
      return null;
    case "smtp":
      return (
        <SmtpUpdateModalContent
          credentialsId={editingCredentials.id}
          onUpdate={onSubmit}
        />
      );
    case "stripe":
      return (
        <UpdateStripeCredentialsModalContent
          credentialsId={editingCredentials.id}
          onUpdate={onSubmit}
        />
      );
    case "whatsApp":
      return null;
    default:
      return (
        <UpdateForgedCredentialsModalContent
          credentialsId={editingCredentials.id}
          blockDef={forgedBlocks[editingCredentials.type]}
          onUpdate={onSubmit}
          scope={scope}
        />
      );
  }
};
