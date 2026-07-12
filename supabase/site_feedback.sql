create extension if not exists pgcrypto;

create table if not exists public.site_feedback (
    id uuid primary key default gen_random_uuid(),
    category text not null
        check (
            category in (
                'add',
                'improve',
                'remove',
                'error'
            )
        ),
    message text not null
        check (char_length(message) between 3 and 500),
    section text,
    pathname text,
    status text not null default 'new'
        check (
            status in (
                'new',
                'reviewed',
                'implemented',
                'dismissed'
            )
        ),
    created_at timestamptz not null default now()
);

alter table public.site_feedback enable row level security;

revoke all privileges
on table public.site_feedback
from anon, authenticated;

grant insert
on table public.site_feedback
to service_role;

create index if not exists site_feedback_created_at_idx
on public.site_feedback (created_at desc);

create index if not exists site_feedback_status_idx
on public.site_feedback (status);

create index if not exists site_feedback_category_idx
on public.site_feedback (category);
