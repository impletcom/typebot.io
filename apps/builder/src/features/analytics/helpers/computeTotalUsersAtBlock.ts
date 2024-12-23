import { isInputBlock } from "@typebot.io/blocks-core/helpers";
import { isNotDefined } from "@typebot.io/lib/utils";
import type {
  EdgeWithTotalUsers,
  TotalAnswers,
} from "@typebot.io/schemas/features/analytics";
import type { PublicTypebotV6 } from "@typebot.io/typebot/schemas/publicTypebot";

export const computeTotalUsersAtBlock = (
  currentBlockId: string,
  {
    publishedTypebot,
    edgesWithTotalUsers,
    totalAnswers,
  }: {
    publishedTypebot: PublicTypebotV6;
    edgesWithTotalUsers: EdgeWithTotalUsers[];
    totalAnswers: TotalAnswers[];
  },
): number => {
  let totalUsers = 0;
  const currentGroup = publishedTypebot.groups.find((group) =>
    group.blocks.find((block) => block.id === currentBlockId),
  );
  if (!currentGroup) return 0;
  const currentBlockIndex = currentGroup.blocks.findIndex(
    (block) => block.id === currentBlockId,
  );
  const previousBlocks = currentGroup.blocks.slice(0, currentBlockIndex + 1);
  for (const block of previousBlocks.reverse()) {
    if (currentBlockId !== block.id && isInputBlock(block))
      return totalAnswers.find((t) => t.blockId === block.id)?.total ?? 0;
    const incomingEdges = publishedTypebot.edges.filter(
      (edge) => edge.to.blockId === block.id,
    );
    if (!incomingEdges.length) continue;
    totalUsers += incomingEdges.reduce(
      (acc, incomingEdge) =>
        acc +
        (edgesWithTotalUsers.find(
          (totalEdge) => totalEdge.edgeId === incomingEdge.id,
        )?.total ?? 0),
      0,
    );
  }
  const edgesConnectedToGroup = publishedTypebot.edges.filter(
    (edge) =>
      edge.to.groupId === currentGroup.id && isNotDefined(edge.to.blockId),
  );

  totalUsers += edgesConnectedToGroup.reduce(
    (acc, connectedEdge) =>
      acc +
      (edgesWithTotalUsers.find(
        (totalEdge) => totalEdge.edgeId === connectedEdge.id,
      )?.total ?? 0),
    0,
  );

  return totalUsers;
};
