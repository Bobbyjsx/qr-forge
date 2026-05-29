-- Add columns for advanced QR styling
ALTER TABLE public.qr_routes 
ADD COLUMN dot_type text DEFAULT 'square',
ADD COLUMN corner_type text DEFAULT 'square',
ADD COLUMN corner_dot_type text DEFAULT 'square',
ADD COLUMN margin integer DEFAULT 0;
