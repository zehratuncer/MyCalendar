-- ==============================================================================
-- MYCALENDAR SUPABASE DATABASE SCHEMA
-- Bu scripti Supabase Dashboard -> SQL Editor kısmına yapıştırıp "Run"a basınız.
-- ==============================================================================

-- 1. COURSES TABLE (Ders Programı)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  instructor TEXT,
  room TEXT,
  day TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  credits NUMERIC DEFAULT 3,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ASSIGNMENTS TABLE (Ödevler & Görevler)
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT,
  course_name TEXT,
  title TEXT NOT NULL,
  due_date TEXT,
  due_time TEXT DEFAULT '23:59',
  priority TEXT DEFAULT 'medium',
  completed BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. NOTES TABLE (Hızlı Notlar)
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Genel',
  color TEXT DEFAULT '#fef3c7',
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. EXAMS TABLE (Sınav Takvimi)
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_name TEXT NOT NULL,
  type TEXT DEFAULT 'Vize',
  date TEXT NOT NULL,
  time TEXT DEFAULT '10:00',
  duration_minutes INTEGER DEFAULT 75,
  room TEXT,
  topics TEXT,
  weight TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. GRADES TABLE (Not Ortalaması & Harf Notu)
CREATE TABLE IF NOT EXISTS public.grades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_name TEXT NOT NULL,
  code TEXT,
  credits NUMERIC DEFAULT 3,
  midterm NUMERIC DEFAULT 70,
  final NUMERIC DEFAULT 70,
  letter_grade TEXT DEFAULT 'CC',
  gpa NUMERIC DEFAULT 2.0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - Her kullanıcının sadece kendi verisini görmesi için
-- ==============================================================================

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Courses RLS Policies
CREATE POLICY "Users can view their own courses" ON public.courses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own courses" ON public.courses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own courses" ON public.courses FOR DELETE USING (auth.uid() = user_id);

-- Assignments RLS Policies
CREATE POLICY "Users can view their own assignments" ON public.assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own assignments" ON public.assignments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assignments" ON public.assignments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assignments" ON public.assignments FOR DELETE USING (auth.uid() = user_id);

-- Notes RLS Policies
CREATE POLICY "Users can view their own notes" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- Exams RLS Policies
CREATE POLICY "Users can view their own exams" ON public.exams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own exams" ON public.exams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own exams" ON public.exams FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own exams" ON public.exams FOR DELETE USING (auth.uid() = user_id);

-- Grades RLS Policies
CREATE POLICY "Users can view their own grades" ON public.grades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own grades" ON public.grades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own grades" ON public.grades FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own grades" ON public.grades FOR DELETE USING (auth.uid() = user_id);
