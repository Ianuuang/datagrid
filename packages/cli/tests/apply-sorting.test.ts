import { describe, expect, it } from "vitest";

import { applySorting } from "../datagrid/core/processors/apply-sorting";
import type { DatagridCore } from "../datagrid/core/index.svelte";

type Row = {
  value: number;
};

function createDatagrid({
  globalSearchIsManual = false,
  sortingIsManual = false,
}: {
  globalSearchIsManual?: boolean;
  sortingIsManual?: boolean;
} = {}): DatagridCore<Row> {
  const column = {
    type: "accessor",
    columnId: "value",
    isSortable: () => true,
    getValueFn: (row: Row) => row.value,
  };

  return {
    _columns: [column],
    features: {
      globalSearch: { isManual: globalSearchIsManual },
      sorting: {
        isManual: sortingIsManual,
        sortConfigs: [{ columnId: "value", direction: "ascending" }],
      },
    },
    lifecycleHooks: {
      executePreSort: (rows: Row[]) => rows,
      executePostSort: (rows: Row[]) => rows,
    },
    processors: {
      data: {
        metrics: {
          measure: (_name: string, callback: () => void) => callback(),
        },
      },
    },
  } as unknown as DatagridCore<Row>;
}

describe("applySorting", () => {
  it("sorts locally when only global search is manual", () => {
    const rows = [{ value: 2 }, { value: 1 }];

    expect(
      applySorting(createDatagrid({ globalSearchIsManual: true }), rows),
    ).toEqual([{ value: 1 }, { value: 2 }]);
  });

  it("leaves rows unchanged when sorting itself is manual", () => {
    const rows = [{ value: 2 }, { value: 1 }];

    expect(
      applySorting(createDatagrid({ sortingIsManual: true }), rows),
    ).toEqual(rows);
  });
});
