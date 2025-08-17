/*
  # Create profiles table with RLS policies

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text)
      - `role` (text)
      - `created_at` (timestamptz)
      - `avatar_url` (text, nullable)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for:
      - Select: Users can read their own profile
      - Insert: Users can create their own profile
      - Update: Users can update their own profile
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('staff', 'manager')),
  created_at timestamptz DEFAULT now(),
  avatar_url text
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow profile creation during registration
CREATE POLICY "Allow profile creation during registration"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow profile updates
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow profile deletion
CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);