insert into public.media (id, title, expedition_id)
values
  ('70469e6b-21d7-5903-add9-dfb237ac3902', 'Bharati Antarctic Research Station in Winter Twilight', null),
  ('644734df-2393-57e2-8553-b2434dbf8570', 'Icebreaking Convoy in Heavy Pack Ice', null),
  ('995a8fca-bf1d-5673-95fa-18539750674b', 'Adélie Penguin Rookery at Schirmacher Oasis', null),
  ('05dd171b-5bed-5153-a5e0-10cabf932a6a', 'Himadri Research Station in Ny-Ålesund, Arctic', null),
  ('50a558e4-7ccc-5431-ad7f-38beb51cf185', 'Deep Ice Core Extraction Process', null),
  ('331e0c2b-1889-5bb1-a613-583404c604bd', 'Southern Ocean CTD Rosette Deployment', null),
  ('f6f43391-ac49-58e6-9fde-c1c6f6875d04', 'Emperor Penguin Colony at Atka Bay', null),
  ('28b892ff-c2b3-5bf3-9509-ca5d487a8bee', 'Weddell Seal Resting on Ice Floe', null),
  ('3ea4bcbe-0bf5-51cb-b04b-0cb015036585', 'Gigantic Tabular Iceberg in Southern Ocean', null),
  ('c8424efc-d939-547b-91cf-e912ef949ac0', 'Snow Petrels Soaring Over Nunatak', null),
  ('f1bd6634-6ffc-501f-949e-f5c92b73fca9', 'Maitri Research Station in Winter', null),
  ('c5d62027-d174-5cea-9dc8-6a309d6b2af7', 'Humpback Whale Pod in Gerlache Strait', null)
on conflict (id) do update set
  title = excluded.title,
  expedition_id = excluded.expedition_id;
