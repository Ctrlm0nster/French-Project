-- Run in Supabase → SQL Editor (once per project). Same idea as Vercel’s “notes” sample,
-- but for Cinémathèque movies/series. The static site reads these via REST + anon key.

-- Create movies table
CREATE TABLE IF NOT EXISTS public.movies (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL UNIQUE,
  year integer,
  director text,
  genre text,
  image text
);

-- Create series table
CREATE TABLE IF NOT EXISTS public.series (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL UNIQUE,
  genre text,
  year integer,
  episodes integer,
  image text
);

ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;

-- Public read for unauthenticated requests (anon JWT), like the Vercel tutorial policy
DROP POLICY IF EXISTS "Allow public read access on movies" ON public.movies;
DROP POLICY IF EXISTS "Allow public read access on series" ON public.series;
DROP POLICY IF EXISTS "anon can read movies" ON public.movies;
CREATE POLICY "anon can read movies"
  ON public.movies FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon can read series" ON public.series;
CREATE POLICY "anon can read series"
  ON public.series FOR SELECT TO anon USING (true);

-- Insert movies data
INSERT INTO public.movies (title, year, director, genre, image) VALUES
('À bout de souffle', 1960, 'Jean-Luc Godard', 'Nouvelle Vague', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO2k2LN3aylrLZWACadXeEwq4ecxnyOkW1jrrYI-ApKX_bMWU-W8kSM1j6N4bxDTC2WVXKz_hvku0d_taH3sCe88_BAl_Xuf2A3EFKNFoFqyBMm8IdVFE0yNCOosMb97jGXwAH3FvClN9SD51CEH1JzyxU4KFlc9tOX2ESFA5L6k5dnd1mEW02s-JhD7NNy5nOLXq6WFM8zTwHG9HUfKOKNaCLzy_6RIaGYciNW2lpzDuq-8y92HGLt3xWGZ1RJWow8gwz9y3Oc3k'),
('La règle du jeu', 1939, 'Jean Renoir', 'Nouvelle Vague', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthf.bing.com%2Fth%2Fid%2FOIP.knQpkAnusZA5IGTRxBZ7TAAAAA%3Fcb%3Dthfc1%26pid%3DApi&f=1&ipt=434646a3f3f7ebb0fc014ddf9cae93eaa48eb7f1d707642def13c55751fae267&ipo=images'),
('Les Quatre Cents Coups', 1959, 'François Truffaut', 'Nouvelle Vague', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZvI6IA6qmY43ghCsiw2nTWXeVEMA7mCOipsQKTkh1-9oJO9GFge94O8QRqAGt6qxuFwbaHpD0IbsEoEckjjN3e9yoxftje4tQ61W1O5Ml5xcC9yu2RhGvWXejpeOUdxrJKWXZWhYoFBKBaL1oYKTf4TlE1ycTmClETdNxSQFwq4bKUIV0f195K9RbL9_tKDBWf1GlupmfoJUgAVM2RIOwpnnQPeU1i0LsV-FlDVzNLD2H4ct9Yw8bbffQwGp5vC4XJlMV06h5mGA'),
('Portrait de la jeune fille en feu', 2019, 'Céline Sciamma', 'Drame Psychologique', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTDICqjC3gpwmAquX9S0j7e0Hg5SXTht5ZmpaPZEZrpGWAGk_0MI60upK3SeJ7d5RrarLlzcACU__kwEbri0Oic6m1JSuTsUUXPobNjk3kZlZlguxhlBXorZcqMSFC94_Gtx4JAG_0zuBFb9EqzUUcOAZoeNgCvBaePXSkyOxpASV-kSwmzuGC_2OYB0VFymev3Vq4yMeyyKzE3hfa5QU7hLY-wvLXyVQ4rjrIle7bbf9TzyvrxBHIaj9DE6fvDLUIId0s74vrNms'),
('La Haine', 1995, 'Mathieu Kassovitz', 'Polar Français', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMchufuIsWFDWPVEPGWRJ2wmauv0MMNJumHep1-MHBqewwUX49fnxuum-Lc4xi1YGyswBiPnyPV0duVZKN9Jxd_b2q_3rfGwfI3OrqXKI7lKoAa-CXvnqT1W1D_LjQyXtPNQOxObJljhnH_LFyJbuofnFiqRa8r8BFYmNK3E506A0CFTe8xRACDAm8w5XaJX838wW2WLhGRxOgQVCZ-3GulWzQPW7gv-ODCpJ9Amy-SJdPlLMtrs1i5ucfdeYM1gfYDjxq04vvPIA'),
('Cléo de 5 à 7', 1962, 'Agnès Varda', 'Comédie Dramatique', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZomzSpjdob207xc0HTITz8sm2e2Hpd0B61tsBWZPejS-oxb4dy6_u8ZiJn78D2eFn2UoLHLGqY_cQAFm0l1WSGnxpIY3N5lVq9ASaY_P5NGfUZPGZoDhd0H3MsMR_KtBXTK3UIuf5eNm-PeZaJYH3wd9DcwewUWhX9nFymaJRaB-tNqNi0bZuwHRfoY_xToiUtQSqHkVJCC0nADUDGoEFtPALjR73RLqy9PYup4-bZifWd9fHqnx2cGEF9eLLrSZHho51DygSgGE'),
('Le Samouraï', 1967, 'Jean-Pierre Melville', 'Polar Français', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj6y_sAoXVX82PqjV-RqqDZqdMyEetAgG0bvVtZ9BghsBhnQmdmdJ_a0WCLfEm8_bIG2TxgDAd_2OGQgG40nmCRUPIXlJzSt7GWqbWswMSkykfWW33cCTrvgS_TYOsKWJvlzmCFJeTghUF482_Zytf9Km6uZTxq92YaMxPPyR2igHBVPw5_Q19fV165ewYgpYmy1Zd9uvSacTvW1_M8IAxCYnV82ISW9WzULbDboZMDyNkZCTbdF71KUVCR5wtPBN8chsl5xSba0U')
ON CONFLICT (title) DO NOTHING;

-- Insert series data
INSERT INTO public.series (title, genre, year, episodes, image) VALUES
('Le Bureau des Légendes', 'Drame', 2024, 8, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeah_M8qii9LF4blFI3KovBrK-s7oOLws1uZBeG9JOtq4DAQ2ZggWRzQlV2Y9BQBqlmf4ZIIl02o7EeonTfCyxcMUudkThfsNe1gAMuNsUS0PVw7t6tWFdVrfJ3zT421WqZGUEcc0vN2Dy9IMHB2WR3ZekPPsKqyULfUVUy1_K136ctGsYp-0XhocWuQ_EJvOUuBCWiHXDaaXfDydh7gTpU3RPWYj-VEO-d1pG2YwtbUmPzrq4HPR0JzqQSTNQGcYheGSBoVgeZCI'),
('Versailles', 'Histoire', 2015, 30, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEW4w8tggSbnTkWkn0wdgHD41_0eAF3qXvkI05dLLcncRqwUO56NUlY9NshajCI2lLfuI_9ps8W3reTIRBGpgitx2imF_meZgJjwZJfB7_MxmfjBqWFr8hKkwjtBE2CTDF0LV6PQna-lOBsPZ6sG1uucSLFl5uwuA9IAOY2DPh26_yy75xHGPMQMYo9BIa0xwfTVAHPj75mq_0YZZ32WM53Z6iyhQ2DpbtFo7u6es_XLlFAkHSc4P3rc0zL6989HWKImF9lS4VYqg'),
('Lupin', 'Polar', 2021, 17, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYXS5MmgN6T-GjLWKyHi955_J_jrorq9AMc6fsMH-6X_RQxVKHMndb1bXAG3bw4nmcfpr_WsRIOuCPaQlYvS-XFqTkUfComgmH3I9KiDmNSl56Ygqlrlyd8wg8W4_oocw6BvlUIyrcp0jmsYZDO4hIhtJmupW2BdYrPN3eELXKACn4tnqfboNuQcHdkukkR_4zJ6QZr3GLme5Swyd6IxpXbvGbTcFO2EgyX62S7FPbzvaa8WfUHKJvlIs7_lbczPOoE1WZqfKPyP8'),
('Dix Pour Cent', 'Comédie', 2015, 24, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN8rf5bTgMEhFPpQehuchaBwJ6dWqwDafP4DCjmoXAHJbpEqd9xSv0zyLJksQXI1QzY8FQ1h-aC_t2bN6kEQIVtFbuIea1GtymMD_pySls4kDfA3Ix2BqdpGNox3asjlVv9htRhgPInJBzVxdlibNXHWdsZqNXQ_poYi_63Ir3Y11Wan9OTJI_5bxFFy8jlYDuzO4qItYjnuTKOrsuq8pkP4cCj5VRuveD9zh30fSlkJQYE582GKSN5eOVSjagO7RXsEYvXvgabkc'),
('Zone Blanche', 'Drame', 2017, 16, 'https://lh3.googleusercontent.com/aida-public/AB6AXuABdoag3-v4czxdmp3y8alcWGMSz32oxZlT8BWVl_41VQiaMUE01et1bnMzMNMADvd1ksQIBQJh0zSXHoVxmcU7bFKusRU_qxmhU_t0uZd7VATzLIpjsZNvHyfBOMeEe-4X0ZvsD7GMzP3a96uTAeEQOPJf3T2HOjnAd1Sp2SucNW3I6ck1u9qAGCLveeUIxZX-trDN2FGNC_cC4U8Ll2MnVcmaD5ZQW-PRyIfmoIVhsz3yVwwcuHN7FaH8yLHy2F9cz2YcBfOCUpo'),
('Ad Vitam', 'Polar', 2018, 6, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwRxufTuVxWayczMclhCNVjpSVnotdBPpSyRX7s8vL_hjprk0nAuMvP86wbvXRYVIYBBzf30w-O_fHIUafeoK58V2IlTuBNY1CDYjueD5MPPdz4K4d5-xSg_H-z-Jl3yFXu5tpMcQpTVSeZ5-02o34w_5aXSLiXye6p-dAlThq9DKJhCN3jGEyEwrt5ACKXF890RbeXq6b_NJvQw4rL-ktF2Fq9-2AKrrDiTnef3_iiNzRVLaiPeQUohsWp3fXnt49rptgl3aJgCc')
ON CONFLICT (title) DO NOTHING;
