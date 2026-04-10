import json
import os

movies_path = os.path.join('website', 'assets', 'data', 'movies.json')
with open(movies_path, 'r', encoding='utf-8') as f:
    movies = json.load(f)

GENRE_MAP = {
    28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie', 80: 'Policier',
    99: 'Documentaire', 18: 'Drame', 10751: 'Famille', 14: 'Fantastique',
    36: 'Histoire', 27: 'Horreur', 10402: 'Musique', 9648: 'Mystère',
    10749: 'Romance', 878: 'Science-Fiction', 10770: 'Téléfilm', 53: 'Thriller',
    10752: 'Guerre',
}

tmdb_results = [
    {"id": 1523145, "title": "Your Heart Will Be Broken", "overview": "Polina is saved from bullying...", "poster_path": "/iGpMm603GUKH2SiXB2S5m4sZ17t.jpg", "release_date": "2026-03-26", "genre_ids": [10749, 18], "vote_average": 6.75},
    {"id": 83533, "title": "Avatar: Fire and Ash", "overview": "Jake Sully and Neytiri face a new threat...", "poster_path": "/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg", "release_date": "2025-12-17", "genre_ids": [878, 12, 14], "vote_average": 7.4},
    {"id": 1327819, "title": "Hoppers", "overview": "Scientists hop consciousness into robotic animals...", "poster_path": "/xjtWQ2CL1mpmMNwuU5HeS4Iuwuu.jpg", "release_date": "2026-03-04", "genre_ids": [16, 10751, 878, 35, 12], "vote_average": 7.587},
    {"id": 502356, "title": "The Super Mario Bros. Movie", "overview": "Mario and Luigi are transported down a pipe...", "poster_path": "/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg", "release_date": "2023-04-05", "genre_ids": [10751, 35, 12, 14, 16], "vote_average": 7.588},
    {"id": 1290821, "title": "Shelter", "overview": "A man rescues a young girl from a storm...", "poster_path": "/buPFnHZ3xQy6vZEHxbHgL1Pc6CR.jpg", "release_date": "2026-01-28", "genre_ids": [28, 80, 53], "vote_average": 6.79},
    {"id": 1171145, "title": "Crime 101", "overview": "Relentless detective closes in...", "poster_path": "/tVvpFIoteRHNnoZMhdnwIVwJpCA.jpg", "release_date": "2026-02-11", "genre_ids": [80, 53], "vote_average": 7.042},
    {"id": 840464, "title": "Greenland 2: Migration", "overview": "Garrity family journey across wasteland of Europe...", "poster_path": "/z2tqCJLsw6uEJ8nJV8BsQXGa3dr.jpg", "release_date": "2026-01-07", "genre_ids": [12, 53, 878], "vote_average": 6.49},
    {"id": 1226863, "title": "The Super Mario Galaxy Movie", "overview": "Brothers travel across the stars...", "poster_path": "/eJGWx219ZcEMVQJhAgMiqo8tYY.jpg", "release_date": "2026-04-01", "genre_ids": [10751, 35, 12, 14, 16], "vote_average": 6.9},
    {"id": 1115544, "title": "Mike and Nick and Nick and Alice", "overview": "Gangsters survive a night with a time machine...", "poster_path": "/7F0jc75HrSkLVcvOXR2FXAIwuEv.jpg", "release_date": "2026-03-14", "genre_ids": [35, 878, 80], "vote_average": 6.83},
    {"id": 1297842, "title": "GOAT", "overview": "Small goat with big dreams gets a once-in-a-lifetime shot...", "poster_path": "/wfuqMlaExcoYiUEvKfVpUTt1v4u.jpg", "release_date": "2026-02-11", "genre_ids": [16, 35, 10751], "vote_average": 7.9},
    {"id": 687163, "title": "Project Hail Mary", "overview": "Teacher wakes up on spaceship to save Earth...", "poster_path": "/yihdXomYb5kTeSivtFndMy5iDmf.jpg", "release_date": "2026-03-15", "genre_ids": [878, 12], "vote_average": 8.194},
    {"id": 1268127, "title": "Humint", "overview": "Agent hunts drug ring in Russia...", "poster_path": "/82bX2GK4PhaJQtfkTnfmd2P7erG.jpg", "release_date": "2026-02-11", "genre_ids": [53, 28, 18], "vote_average": 7.25},
    {"id": 1265609, "title": "War Machine", "overview": "Army Ranger unit fights otherworldly killing machine...", "poster_path": "/tlPgDzwIE7VYYIIAGCTUOnN4wI1.jpg", "release_date": "2026-02-12", "genre_ids": [28, 878, 53], "vote_average": 7.239},
    {"id": 1084187, "title": "Pretty Lethal", "overview": "Ballerinas fighting for survival at remote inn...", "poster_path": "/znTPnXCK3lEQJgqXCvP7e5FUz6f.jpg", "release_date": "2026-03-13", "genre_ids": [10402, 53, 28, 27], "vote_average": 6.868},
    {"id": 1159831, "title": "The Bride!", "overview": "Frankenstein travels to revive murdered woman...", "poster_path": "/lV8YHwGkYZsm6EfIqnhaSz2avKt.jpg", "release_date": "2026-03-04", "genre_ids": [878, 27, 14], "vote_average": 6.3},
    {"id": 1641319, "title": "Sniper: No Nation", "overview": "Rescue mission in Venezuela...", "poster_path": "/wlimwHMelt9PRdgFhS5bWJWPrjr.jpg", "release_date": "2026-04-07", "genre_ids": [28, 53], "vote_average": 5.769},
    {"id": 1159559, "title": "Scream 7", "overview": "Sidney Prescott faces horrors of her past...", "poster_path": "/jjyuk0edLiW8vOSnlfwWCCLpbh5.jpg", "release_date": "2026-02-25", "genre_ids": [27, 9648, 80], "vote_average": 6.043},
    {"id": 615, "title": "The Passion of the Christ", "overview": "Graphic portrayal of Jesus of Nazareth...", "poster_path": "/rBM5o2HpmCfDejuIPybI09tkY3V.jpg", "release_date": "2004-02-25", "genre_ids": [18], "vote_average": 7.5},
    {"id": 662707, "title": "Starbright", "overview": "Guardian of a fallen star...", "poster_path": "/m1Zl07DNYeSyNcz9hf8hDsS2oB5.jpg", "release_date": "2026-02-27", "genre_ids": [12, 28], "vote_average": 7.318},
    {"id": 1470130, "title": "The Mortuary Assistant", "overview": "Rebecca Owens takes night shift at River Fields...", "poster_path": "/72AoFPC5TY4DfJwXXS9rPwPeReD.jpg", "release_date": "2026-02-13", "genre_ids": [27, 9648], "vote_average": 5.4}
]

existing_ids = {str(m.get('tmdbId')) for m in movies if m.get('tmdbId')}
count = 0
for data in tmdb_results:
    if str(data['id']) not in existing_ids:
        new_m = {
            'title': data['title'], 
            'year': int(data['release_date'].split('-')[0]), 
            'director': 'TMDB',
            'genre': GENRE_MAP.get(data['genre_ids'][0], 'Drame'), 
            'image': 'https://image.tmdb.org/t/p/w500' + data['poster_path'],
            'description': data['overview'], 
            'synopsis': data['overview'], 
            'tmdbId': str(data['id']),
            'rating': str(round(data['vote_average'], 1)) + '/10',
            'tags': [GENRE_MAP.get(gid, 'Action') for gid in data['genre_ids']], 
            'reviews': [], 
            'cast': []
        }
        movies.append(new_m)
        count += 1

with open(movies_path, 'w', encoding='utf-8') as f:
    json.dump(movies, f, indent=2, ensure_ascii=False)
print(f'Added {count} new movies.')
