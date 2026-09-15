insert into public.scientists (id, name, bio)
values
  (
    'b49abb39-7e00-5def-b67b-781d614f7555',
    'Dr. Thamban Meloth',
    'Leading pioneer in high-resolution ice-core glaciology and Southern Ocean paleoclimatology. Veteran of 8 Antarctic and Southern Ocean expeditions.'
  ),
  (
    '539c8fcd-5526-5c3b-a90c-c0321f2f7036',
    'Dr. Rajeshwari Nair',
    'Specialist in synthetic aperture radar (SAR) interferometry and polar altimetry tracking Antarctic ice-shelf grounding line retreat.'
  ),
  (
    '53799c67-f99e-5665-9ef6-5fe27d172b86',
    'Dr. K. P. Krishnan',
    'Veteran Arctic researcher investigating psychrophilic bacterial enzymes and carbon cycling in Svalbard fjords at Himadri station.'
  )
on conflict (id) do update set
  name = excluded.name,
  bio = excluded.bio;