-- Fix RLS policies to be secure and support inactive assets

-- Re-drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public can view active QR routes" ON public.qr_routes;
DROP POLICY IF EXISTS "Owners can view all their routes" ON public.qr_routes;
DROP POLICY IF EXISTS "Anyone with management token can view" ON public.qr_routes;
DROP POLICY IF EXISTS "Anyone can update via management token" ON public.qr_routes;
DROP POLICY IF EXISTS "Anyone with management token can update" ON public.qr_routes;
DROP POLICY IF EXISTS "Owners can update their routes" ON public.qr_routes;
DROP POLICY IF EXISTS "Owners can delete their routes" ON public.qr_routes;
DROP POLICY IF EXISTS "Anyone with management token can delete" ON public.qr_routes;
DROP POLICY IF EXISTS "Users can view their own QR routes" ON public.qr_routes;
DROP POLICY IF EXISTS "Users can update their own QR routes" ON public.qr_routes;

-- 1. SELECT: Public can ONLY view active QR routes
CREATE POLICY "Public can view active QR routes"
    ON public.qr_routes
    FOR SELECT
    USING (is_active = true);

-- 2. SELECT: Owners can view ALL their routes
CREATE POLICY "Owners can view all their routes"
    ON public.qr_routes
    FOR SELECT
    TO authenticated
    USING (auth.uid() = created_by);

-- 3. INSERT: Anyone can create
-- (Policy already exists, but we'll ensure it's there)
-- CREATE POLICY "Anyone can create QR routes" ON public.qr_routes FOR INSERT WITH CHECK (true);

-- 4. UPDATE/DELETE: Handled by API layer via service_role to allow guest management.
-- However, we still want RLS protection for authenticated users.

CREATE POLICY "Owners can update their routes"
    ON public.qr_routes
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owners can delete their routes"
    ON public.qr_routes
    FOR DELETE
    TO authenticated
    USING (auth.uid() = created_by);

-- Analytics policies
DROP POLICY IF EXISTS "Users can view analytics for their own QR routes" ON public.qr_analytics;

CREATE POLICY "Owners can view analytics"
    ON public.qr_analytics
    FOR SELECT
    TO authenticated
    USING (
        exists (
            select 1 from public.qr_routes
            where public.qr_routes.id = public.qr_analytics.qr_id
            and public.qr_routes.created_by = auth.uid()
        )
    );
