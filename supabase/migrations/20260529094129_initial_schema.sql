-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create redirect_type enum
create type public.redirect_type as enum ('301', '302', '307');

-- Create qr_routes table
create table public.qr_routes (
    id uuid primary key default gen_random_uuid(),
    short_code varchar(255) unique not null,
    destination_url text not null,
    redirect_type public.redirect_type default '302',
    is_active boolean default true,
    expires_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    created_by uuid references auth.users(id) on delete cascade,
    -- Design customization
    fg_color text default '#000000',
    bg_color text default '#FFFFFF',
    gradient_enabled boolean default false,
    gradient_type text,
    gradient_start text,
    gradient_end text,
    border_style text default 'none',
    logo_url text,
    logo_padding integer default 10
);

-- Create qr_analytics table
create table public.qr_analytics (
    id uuid primary key default gen_random_uuid(),
    qr_id uuid references public.qr_routes(id) on delete cascade not null,
    timestamp timestamp with time zone default now(),
    ip_hash text,
    country text,
    city text,
    device text,
    os text,
    browser text,
    referrer text
);

-- Enable RLS
alter table public.qr_routes enable row level security;
alter table public.qr_analytics enable row level security;

-- Policies for qr_routes
create policy "Public can view active QR routes"
    on public.qr_routes
    for select
    using (is_active = true);

create policy "Anyone can create QR routes"
    on public.qr_routes
    for insert
    with check (true);

create policy "Users can manage their own QR routes"
    on public.qr_routes
    for all
    to authenticated
    using (auth.uid() = created_by)
    with check (auth.uid() = created_by);

-- Policies for qr_analytics
create policy "Anyone can insert analytics"
    on public.qr_analytics
    for insert
    with check (true);

create policy "Users can view analytics for their own QR routes"
    on public.qr_analytics
    for select
    to authenticated
    using (
        exists (
            select 1 from public.qr_routes
            where public.qr_routes.id = public.qr_analytics.qr_id
            and public.qr_routes.created_by = auth.uid()
        )
    );

-- Function to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger for qr_routes
create trigger set_updated_at
    before update on public.qr_routes
    for each row
    execute function public.handle_updated_at();

-- Indexes for performance
create index idx_qr_routes_short_code on public.qr_routes(short_code);
create index idx_qr_routes_created_by on public.qr_routes(created_by);
create index idx_qr_analytics_qr_id on public.qr_analytics(qr_id);
create index idx_qr_analytics_timestamp on public.qr_analytics(timestamp);
