CREATE TABLE public.daily_bonus_claims (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  streak_day INTEGER NOT NULL DEFAULT 1,
  coins_given INTEGER NOT NULL DEFAULT 100
);
ALTER TABLE public.daily_bonus_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bonus claims" ON public.daily_bonus_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bonus claim" ON public.daily_bonus_claims FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.coin_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  amount      INTEGER NOT NULL,
  type        TEXT NOT NULL,
  description TEXT NOT NULL,
  ref_id      TEXT,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.coin_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.coin_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all transactions" ON public.coin_transactions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));