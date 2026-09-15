insert into public.claims (id, title, statement, status)
values
  (
    '6d5f3b4d-4153-56a8-a332-69479b118c25',
    'Antarctica is getting warmer everywhere.',
    'While the Antarctic Peninsula and West Antarctica show some of the most rapid warming trends on Earth with significant ice mass loss, the East Antarctic Ice Sheet exhibits complex regional variability, with some interior plateau sectors experiencing steady temperatures and localized snowfall increases.',
    'PARTIALLY_SUPPORTED'
  ),
  (
    'ed19c2e9-bb49-5070-b4f1-ee5c267d0877',
    'Antarctica holds about 70% of the world’s freshwater.',
    'The Antarctic ice sheet covers roughly 14 million square kilometers and contains approximately 27 million cubic kilometers of ice. This represents approximately 61% to 70% of the total freshwater on Earth and about 90% of Earth’s surface ice.',
    'VERIFIED'
  ),
  (
    'a8f99273-c3d0-5444-a201-f3b771ff2c8d',
    'Polar bears and penguins live together in the same polar habitats.',
    'Polar bears are native exclusively to the Arctic Circle in the Northern Hemisphere. Wild penguins are native almost entirely to the Southern Hemisphere. They never encounter each other in nature.',
    'CONTRADICTED'
  ),
  (
    '7ae93ee6-556d-511f-90f7-20c35f338f6c',
    'Indian polar stations Maitri and Bharati operate purely in summer months.',
    'Both Maitri and Bharati are permanent, year-round research stations. Dedicated winter-over teams maintain uninterrupted scientific monitoring through the Antarctic winter.',
    'CONTRADICTED'
  )
on conflict (id) do update set
  title = excluded.title,
  statement = excluded.statement,
  status = excluded.status;
