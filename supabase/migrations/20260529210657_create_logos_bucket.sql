-- Create a storage bucket for logos
insert into storage.buckets (id, name, public) 
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Set up storage policies for public access and authenticated uploads
create policy "Public Access" 
  on storage.objects for select 
  using ( bucket_id = 'logos' );

create policy "Authenticated Uploads" 
  on storage.objects for insert 
  with check ( 
    bucket_id = 'logos' 
    and auth.role() = 'authenticated' 
  );

create policy "Anyone can upload anonymously"
  on storage.objects for insert
  with check (
    bucket_id = 'logos'
  );
