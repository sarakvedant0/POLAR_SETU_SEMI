insert into public.evidence (id, claim_id, title)
values
  ('dd96f9ad-63ea-58fb-893c-33f23610d184', '6d5f3b4d-4153-56a8-a332-69479b118c25', 'Satellite Gravimetry GRACE-FO Mass Balance Records'),
  ('5b0c2d54-e4d2-5a4c-af77-94bf79e82e9b', '6d5f3b4d-4153-56a8-a332-69479b118c25', 'Maitri vs Casey Station Automated Weather Observations'),
  ('794e5ab6-04ee-5d9d-8838-bf97075ecafc', 'ed19c2e9-bb49-5070-b4f1-ee5c267d0877', 'BedMachine Antarctica: High-Resolution Ice Volume Census'),
  ('dcb01d8a-8a47-5902-823d-dd1bca107efb', 'a8f99273-c3d0-5444-a201-f3b771ff2c8d', 'Biogeographical Range Distribution Database'),
  ('c0210ff2-2e40-53c9-bd5a-49d44ed6432e', '7ae93ee6-556d-511f-90f7-20c35f338f6c', 'MoES Annual Winter-Over Mission Roster')
on conflict (id) do update set
  claim_id = excluded.claim_id,
  title = excluded.title;
