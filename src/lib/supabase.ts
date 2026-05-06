import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://pyqxitcvirwafmlhdeyp.supabase.co',
  'sb_publishable_JYDuEg5TL7yW_637LuB3Cw_DLkdormw',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage,
    },
  }
);
