export type CsvValue = string | number | boolean | null | undefined

export function downloadCsv(filename: string, rows: readonly (readonly CsvValue[])[]) {
  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\r\n")
  const objectUrl = URL.createObjectURL(
    new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
  )
  const link = document.createElement("a")

  link.href = objectUrl
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}
