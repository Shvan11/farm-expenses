-- Create Expenses Table
create table expenses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  amount numeric not null,
  description text not null,
  payer_id text not null,
  date date not null,
  category text,
  split_type text
);

-- Create Payments Table
create table payments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  amount numeric not null,
  from_id text not null,
  to_id text not null,
  date date not null
);

-- Enable Row Level Security (RLS)
alter table expenses enable row level security;
alter table payments enable row level security;

-- Create Policies (Allow public access for this simple app, or configure auth later)
-- For now, we'll allow all operations for anyone with the ANON key (simplest for this use case)
create policy "Enable all access for all users" on expenses for all using (true) with check (true);
create policy "Enable all access for all users" on payments for all using (true) with check (true);
