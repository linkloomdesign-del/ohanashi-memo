-- おはなしメモ Supabase テーブル定義

-- users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('mother', 'family')),
  created_at timestamptz not null default now()
);

-- profiles (家族連絡先)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  display_name text not null,
  relationship text not null,
  phone text,
  message_destination text,
  is_primary_contact boolean not null default false,
  created_at timestamptz not null default now()
);

-- conversations
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer,
  mode text not null default 'text' check (mode in ('voice', 'text')),
  summary_for_mother text,
  summary_for_family text,
  main_topics text[],
  mood text,
  concern_notes text,
  next_opening_message text,
  family_suggestion text,
  created_at timestamptz not null default now()
);

-- conversation_messages
create table if not exists conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender text not null check (sender in ('mother', 'ai')),
  content text not null,
  input_type text not null default 'text' check (input_type in ('voice', 'text', 'system')),
  created_at timestamptz not null default now()
);

-- conversation_cards (前の会話を振り返る用)
create table if not exists conversation_cards (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  title text not null,
  body text not null,
  category text not null default 'general',
  display_to_mother boolean not null default true,
  created_at timestamptz not null default now()
);

-- memos
create table if not exists memos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  conversation_id uuid references conversations(id),
  memo_type text not null check (memo_type in ('shopping', 'todo', 'schedule', 'health', 'family_message', 'general')),
  title text not null,
  items text[],
  original_text text,
  status text not null default 'open' check (status in ('open', 'done', 'deleted')),
  family_confirm_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- app_usage_logs
create table if not exists app_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  feature text not null check (feature in ('home', 'today_talk', 'previous_conversations', 'family_contact')),
  action text not null check (action in ('open', 'start', 'end', 'click', 'send')),
  created_at timestamptz not null default now()
);

-- family_messages
create table if not exists family_messages (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references users(id),
  to_profile_id uuid references profiles(id),
  message_text text not null,
  input_method text not null check (input_method in ('simple', 'voice', 'text')),
  status text not null default 'saved' check (status in ('saved', 'sent', 'read')),
  created_at timestamptz not null default now()
);

-- インデックス
create index if not exists idx_conversations_user_id on conversations(user_id);
create index if not exists idx_conversation_messages_conversation_id on conversation_messages(conversation_id);
create index if not exists idx_memos_user_id on memos(user_id);
create index if not exists idx_memos_status on memos(status);
create index if not exists idx_app_usage_logs_user_id on app_usage_logs(user_id);
create index if not exists idx_family_messages_from_user_id on family_messages(from_user_id);
