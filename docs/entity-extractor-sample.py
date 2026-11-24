"""Run the real Entity Extractor (rule-based pass, no LLM) on a few fictional sentences
and print the JSON for the portfolio. Usage, from the DefenseOSINT project root:

    .venv\\Scripts\\python path\\to\\portfolio_sample.py nlp-001 nlp-002 nlp-003 nlp-005
"""

import json
import sys
from datetime import UTC, datetime
from pathlib import Path

ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / "services" / "entity-agent"))

from defenseosint_common.contracts import EvidenceBundle, EvidenceRecord, Provenance  # noqa: E402
from entity_agent.extract import extract_entities  # noqa: E402

ids = sys.argv[1:] or ["nlp-001", "nlp-002", "nlp-003", "nlp-005"]
docs = {}
with open(ROOT / "evaluation" / "datasets" / "nlp" / "documents.jsonl", encoding="utf-8") as f:
    for line in f:
        if line.strip():
            d = json.loads(line)
            docs[d["id"]] = d["text"]

now = datetime.now(UTC)
records = [
    EvidenceRecord(
        evidence_id=i,
        content=docs[i],
        provenance=Provenance(source_name=i, source_type="news", retrieved_at=now, collector="portfolio-sample"),
    )
    for i in ids
]
bundle = EvidenceBundle(investigation_id="portfolio-sample", task_id="t1", records=records)
result = extract_entities(bundle)

print(json.dumps({"input": {i: docs[i] for i in ids}, "output": result.model_dump(mode="json")}, indent=2, ensure_ascii=False))
