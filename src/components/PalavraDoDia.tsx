// src/components/PalavraDoDia.tsx

import { getPalavraDoDia } from "@/lib/gemini";
import { unstable_cache } from "next/cache";

const getCachedPalavra = unstable_cache(
  async () => getPalavraDoDia(),
  ["palavra-do-dia"],
  { revalidate: 86400 } // 24 horas
);

export default async function PalavraDoDia() {
  const palavra = await getCachedPalavra();

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="font-display text-2xl font-bold text-gold">
        Palavra do Dia
      </h2>

      <div className="mt-4 rounded-lg border border-line bg-white p-6">
        {palavra.verseReference && (
          <p className="font-mono text-xs uppercase text-navy/50">
            {palavra.verseReference}
          </p>
        )}

        <p className="mt-2 font-display text-lg italic text-navy">
          “{palavra.text}”
        </p>

        {palavra.reflection && (
          <p className="mt-3 font-body text-sm text-navy/70">
            {palavra.reflection}
          </p>
        )}
      </div>
    </section>
  );
}