import { v4 as uuidv4 } from 'uuid';

export function createAclMessage({
  performative,
  sender,
  receiver,
  content,
  conversationId,
  inReplyTo = null,
  ontology = 'PhishGuardOntology'
}) {
  return {
    id: uuidv4(),
    performative,
    sender,
    receiver,
    ontology,
    conversationId,
    inReplyTo,
    content,
    createdAt: new Date().toISOString()
  };
}
