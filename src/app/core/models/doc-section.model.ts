export interface DocSection {
  id: string;           // URL-safe slug  e.g. "getting-started"
  title: string;        // Human-readable heading text
  level: number;        // 1 = H1, 2 = H2, 3 = H3
  content: string;      // Raw markdown for this section only
  children: DocSection[];
}
