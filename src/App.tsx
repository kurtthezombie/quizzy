import { useState } from "react";

import { ImportPage } from "@/pages/ImportPage";
import { ReviewerPage } from "@/pages/ReviewerPage";
import type { Reviewer } from "@/types/reviewer";

function App() {
  const [reviewer, setReviewer] = useState<Reviewer | null>(null);

  if (!reviewer) {
    return <ImportPage onStartReviewer={setReviewer} />;
  }

  return (
    <ReviewerPage
      reviewer={reviewer}
      onBackToImport={() => setReviewer(null)}
    />
  );
}

export default App;
