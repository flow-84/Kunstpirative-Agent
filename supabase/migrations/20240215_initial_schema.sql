-- Create conversations table
create table conversations (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  elevenlabs_interaction_id text not null
);

-- Enable RLS on conversations
alter table conversations enable row level security;

-- Create policy to allow users to see only their own conversations
create policy "Users can view their own conversations"
  on conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own conversations"
  on conversations for insert
  with check (auth.uid() = user_id);

-- Create messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  conversation_id uuid references conversations(id) on delete cascade not null,
  content text not null,
  is_user boolean not null default false
);

-- Enable RLS on messages
alter table messages enable row level security;

-- Create policy to allow users to see messages from their conversations
create policy "Users can view messages from their conversations"
  on messages for select
  using (
    exists (
      select 1
      from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can insert messages to their conversations"
  on messages for insert
  with check (
    exists (
      select 1
      from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );
