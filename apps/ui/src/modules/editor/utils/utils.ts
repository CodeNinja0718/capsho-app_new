import type { Node as ProseMirrorNode, NodeType } from 'prosemirror-model'

export function equalNodeType(
  {
    node,
    nodeType
  }: {
    node: ProseMirrorNode;
    nodeType: NodeType | NodeType[];
  }
) {
  if (Array.isArray(nodeType)) {
    return nodeType.includes(node.type)
  }
  return node.type === nodeType
}
