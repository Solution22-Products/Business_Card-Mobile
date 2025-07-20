// src/app/card/[id]/page.tsx


import CardThemePreview from '@/components/cardTheme/preview';
import { supabase } from '@/lib/supabase';

export default async function CardPreview({
  params,
}: {
  params: { id: string };
}) {
  const { data: card, error } = await supabase
    .from('cards')
    .select('*')
    .eq('share_id', params.id)
    .single();

  if (error || !card) {
    console.error('❌ Card not found or error:', error);
    return (
      <main className="flex min-h-screen items-center justify-center bg-red-100 text-red-800">
        <h2>❌ Card not found or failed to load</h2>
      </main>
    );
  }

  return <CardThemePreview  card={card} />;
}
