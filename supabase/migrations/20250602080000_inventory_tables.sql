/*
  # Create inventory tables with RLS policies

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `inventory_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, nullable)
      - `sku` (text, unique)
      - `category_id` (uuid, references categories)
      - `quantity` (integer)
      - `price` (decimal)
      - `threshold` (integer)
      - `image_url` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references profiles)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage inventory
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  sku text UNIQUE NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 0,
  price decimal(10,2) NOT NULL DEFAULT 0,
  threshold integer NOT NULL DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can view all categories"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create categories"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update categories"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete categories"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Inventory items policies
CREATE POLICY "Users can view all inventory items"
  ON public.inventory_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create inventory items"
  ON public.inventory_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update inventory items"
  ON public.inventory_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete inventory items"
  ON public.inventory_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_category_id ON public.inventory_items(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON public.inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_items_created_by ON public.inventory_items(created_by);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default categories
INSERT INTO public.categories (name, description) VALUES
  ('Electronics', 'Electronic devices and accessories'),
  ('Clothing', 'Apparel and fashion items'),
  ('Food & Beverages', 'Food and drink products'),
  ('Furniture', 'Home and office furniture'),
  ('Books', 'Books and publications'),
  ('Sports', 'Sports equipment and accessories')
ON CONFLICT (name) DO NOTHING; 