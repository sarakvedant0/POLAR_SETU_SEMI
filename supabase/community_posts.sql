insert into public.community_posts (
  id,
  title,
  content,
  created_at,
  author_id,
  moderation_status,
  scientific_status
)
values
  (
    '8f8e9cf8-5bd6-5fda-b0fd-ef94124da0b4',
    'Anomalous meltwater ponds observed at Schirmacher Oasis in late February',
    'During our UAV photogrammetry survey around Lake Priyadarshini near Maitri station, we detected supraglacial ponding at elevations 40m higher than historical summer baselines. We are cross-referencing this with Landsat-9 imagery to evaluate local albedo changes.',
    now(),
    null,
    'PUBLISHED',
    'EVIDENCE_FOUND'
  ),
  (
    '0c328329-b90f-54cb-af47-8d7636de06ba',
    'Overwintering with the Emperors: What 9 months at Bharati Station taught us',
    'When the last ship sails in March, silence descends over Larsemann Hills. In temperatures reaching -38°C with 120 km/h blizzards, maintaining micro-climatic loggers requires teamwork and resilience. The dedication of Indian station engineers who keep life-support and satellite uplinks operational 24/7 is truly heroic.',
    now(),
    null,
    'PUBLISHED',
    'VERIFIED'
  ),
  (
    '1e541f74-9e0f-5564-af96-07f5dfc6d645',
    'Why do many school textbooks still assert that Antarctica has no plant life?',
    'Many students believe Antarctica is 100% barren ice. In reality, over 100 species of mosses, 300+ lichens, and two native vascular flowering plants (Antarctic hair grass and Antarctic pearlwort) thrive along the western peninsula!',
    now(),
    null,
    'PUBLISHED',
    'VERIFIED'
  )
on conflict (id) do update set
  title = excluded.title,
  content = excluded.content,
  created_at = excluded.created_at,
  author_id = excluded.author_id,
  moderation_status = excluded.moderation_status,
  scientific_status = excluded.scientific_status;
