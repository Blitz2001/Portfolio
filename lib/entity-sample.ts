// Real output of the DefenseOSINT Entity Extractor (extract_entities(), rule-based pass),
// run on four fictional sentences from the hand-labelled test set. Source: docs/entity-extractor-sample.json.
export type EntityType = "PERSON" | "ORG" | "LOCATION" | "EVENT";
export type SampleEntity = { id: string; name: string; type: EntityType; confidence: number; evidence: string[] };
export type SampleRelation = { subject: string; predicate: string; object: string; evidence: string[] };

export const entitySample = {
  records: [
    { id: "nlp-001", text: "Jane Smith works for Acme Corporation, which is based in Riga." },
    { id: "nlp-002", text: "Acme Corporation announced a new office in Riga last year." },
    { id: "nlp-003", text: "Maria Kalnina founded Nexus Trading Group in 2015." },
    { id: "nlp-005", text: "Blackridge Holdings acquired Nexus Trading Group in March." },
  ],
  entities: [
    { id: "org_a153f2d2547c", name: "Acme Corporation", type: "ORG", confidence: 0.79, evidence: ["nlp-001", "nlp-002"] },
    { id: "org_3ea9e45f359c", name: "Nexus Trading Group", type: "ORG", confidence: 0.79, evidence: ["nlp-003", "nlp-005"] },
    { id: "loc_d7f966e97624", name: "Riga", type: "LOCATION", confidence: 0.79, evidence: ["nlp-001", "nlp-002"] },
    { id: "org_5ec0cc12a96b", name: "Blackridge Holdings", type: "ORG", confidence: 0.62, evidence: ["nlp-005"] },
    { id: "per_4db45f6d5c9e", name: "Jane Smith", type: "PERSON", confidence: 0.62, evidence: ["nlp-001"] },
    { id: "per_a4869c2f411f", name: "Maria Kalnina", type: "PERSON", confidence: 0.62, evidence: ["nlp-003"] },
  ] satisfies SampleEntity[],
  relations: [
    { subject: "org_a153f2d2547c", predicate: "headquartered_in", object: "loc_d7f966e97624", evidence: ["nlp-001"] },
    { subject: "per_4db45f6d5c9e", predicate: "works_for", object: "org_a153f2d2547c", evidence: ["nlp-001"] },
    { subject: "per_a4869c2f411f", predicate: "founded", object: "org_3ea9e45f359c", evidence: ["nlp-003"] },
    { subject: "org_5ec0cc12a96b", predicate: "acquired", object: "org_3ea9e45f359c", evidence: ["nlp-005"] },
  ] satisfies SampleRelation[],
  // evaluation/results/nlp-20260917-201313.json: 23 hand-labelled documents
  evaluation: { documents: 23, entityF1: 0.81, entityPrecision: 0.82, entityRecall: 0.81, relationPrecision: 1.0, relationRecall: 0.71 },
};
