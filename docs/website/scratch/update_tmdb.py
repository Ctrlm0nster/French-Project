import json
import os

movies_path = r'website\assets\data\movies.json'

with open(movies_path, 'r', encoding='utf-8') as f:
    movies = json.load(f)

GENRE_MAP = {
    28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie', 80: 'Policier',
    99: 'Documentaire', 18: 'Drame', 10751: 'Famille', 14: 'Fantastique',
    36: 'Histoire', 27: 'Horreur', 10402: 'Musique', 9648: 'Mystère',
    10749: 'Romance', 878: 'Science-Fiction', 10770: 'Téléfilm', 53: 'Thriller',
    10752: 'Guerre', 10759: 'Action & Aventure', 10765: 'Sci-Fi & Fantasy',
    10762: 'Enfant', 10763: 'News', 10764: 'Réalité', 10766: 'Soap',
    10767: 'Talk', 10768: 'Guerre & Politique',
}

tmdb_results = [
    {
      "id": 120,
      "overview": "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.",
      "poster_path": "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
      "title": "The Lord of the Rings: The Fellowship of the Ring",
      "vote_average": 8.396,
      "genre_ids": [12, 14, 28]
    },
    {
      "id": 106,
      "overview": "A team of elite commandos on a secret mission in a Central American jungle come to find themselves hunted by an extraterrestrial warrior.",
      "poster_path": "/k3mW4qfJo6SKqe6laRyNGnbB9n5.jpg",
      "title": "Predator",
      "vote_average": 7.491,
      "genre_ids": [878, 28, 12, 53]
    },
    {
      "id": 155,
      "overview": "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
      "poster_path": "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      "title": "The Dark Knight",
      "vote_average": 8.509,
      "genre_ids": [18, 28, 80, 53]
    },
    {
      "id": 12,
      "overview": "Nemo, an adventurous young clownfish, is unexpectedly taken from his Great Barrier Reef home to a dentist's office aquarium. It's up to his worrisome father Marlin and a friendly but forgetful fish Dory to bring Nemo home -- meeting vegetarian sharks, surfer dude turtles, hypnotic jellyfish, hungry seagulls, and more along the way.",
      "poster_path": "/5lc6nQc0VhWFYFbNv016xze8Jvy.jpg",
      "title": "Finding Nemo",
      "vote_average": 7.822,
      "genre_ids": [16, 10751]
    },
    {
      "id": 107,
      "overview": "Unscrupulous boxing promoters, violent bookmakers, a Russian gangster, incompetent amateur robbers and supposedly Jewish jewelers fight to track down a priceless stolen diamond.",
      "poster_path": "/56mOJth6DJ6JhgoE2jtpilVqJO.jpg",
      "title": "Snatch",
      "vote_average": 7.803,
      "genre_ids": [80, 35]
    },
    {
      "id": 38,
      "overview": "Joel Barish, heartbroken that his girlfriend underwent a procedure to erase him from her memory, decides to do the same. However, as he watches his memories of her fade away, he realises that he still loves her, and may be too late to correct his mistake.",
      "poster_path": "/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
      "title": "Eternal Sunshine of the Spotless Mind",
      "vote_average": 8.1,
      "genre_ids": [878, 18, 10749]
    },
    {
      "id": 13,
      "overview": "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.",
      "poster_path": "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      "title": "Forrest Gump",
      "vote_average": 8.5,
      "genre_ids": [35, 18, 10749]
    },
    {
      "id": 280,
      "overview": "Nearly 10 years have passed since Sarah Connor was targeted for termination by a cyborg from the future. Now her son, John, the future leader of the resistance, is the target for a newer, more deadly terminator. Once again, the resistance has managed to send a protector back to attempt to save John and his mother Sarah.",
      "poster_path": "/5M0j0B18abtBI5gi2RhfjjurTqb.jpg",
      "title": "Terminator 2: Judgment Day",
      "vote_average": 8.096,
      "genre_ids": [28, 53, 878]
    },
    {
      "id": 310,
      "overview": "Bruce Nolan toils as a 'human interest' television reporter in Buffalo, N.Y., but despite his high ratings and the love of his beautiful girlfriend, Bruce remains unfulfilled. At the end of the worst day in his life, he angrily ridicules God—and the Almighty responds, endowing Bruce with all of His divine powers.",
      "poster_path": "/f0QqG14SZYYZcV4VWykVc5w13dz.jpg",
      "title": "Bruce Almighty",
      "vote_average": 6.7,
      "genre_ids": [14, 35]
    },
    {
      "id": 187,
      "overview": "Welcome to Sin City. This town beckons to the tough, the corrupt, the brokenhearted. Some call it dark… Hard-boiled. Then there are those who call it home — Crooked cops, sexy dames, desperate vigilantes. Some are seeking revenge, others lust after redemption, and then there are those hoping for a little of both. A universe of unlikely and reluctant heroes still trying to do the right thing in a city that refuses to care.",
      "poster_path": "/i66G50wATMmPrvpP95f0XP6ZdVS.jpg",
      "title": "Sin City",
      "vote_average": 7.437,
      "genre_ids": [53, 28, 80]
    },
    {
      "id": 238,
      "overview": "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
      "poster_path": "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "title": "The Godfather",
      "vote_average": 8.712,
      "genre_ids": [18, 80]
    },
    {
      "id": 289,
      "overview": "In Casablanca, Morocco in December 1941, a cynical American expatriate meets a former lover, with unforeseen complications.",
      "poster_path": "/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
      "title": "Casablanca",
      "vote_average": 8.173,
      "genre_ids": [18, 10749]
    },
    {
      "id": 275,
      "overview": "Jerry, a small-town Minnesota car salesman is bursting at the seams with debt... but he's got a plan. He's going to hire two thugs to kidnap his wife in a scheme to collect a hefty ransom from his wealthy father-in-law. It's going to be a snap and nobody's going to get hurt... until people start dying. Enter Police Chief Marge, a coffee-drinking, parka-wearing - and extremely pregnant - investigator who'll stop at nothing to get her man. And if you think her small-time investigative skills will give the crooks a run for their ransom... you betcha!",
      "poster_path": "/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg",
      "title": "Fargo",
      "vote_average": 7.87,
      "genre_ids": [80, 18, 53]
    },
    {
      "id": 675,
      "overview": "Returning for his fifth year of study at Hogwarts, Harry is stunned to find that his warnings about the return of Lord Voldemort have been ignored. Left with no choice, Harry takes matters into his own hands, training a small group of students to defend themselves against the dark arts.",
      "poster_path": "/5aOyriWkPec0zUDxmHFP9qMmBaj.jpg",
      "title": "Harry Potter and the Order of the Phoenix",
      "vote_average": 7.687,
      "genre_ids": [12, 14, 9648]
    },
    {
      "id": 503,
      "overview": "A packed cruise ship traveling the Atlantic is hit and overturned by a massive wave, compelling the passengers to begin a dramatic fight for their lives.",
      "poster_path": "/cCx2Ead8KoZhHofsAAr7tyrjfDo.jpg",
      "title": "Poseidon",
      "vote_average": 5.848,
      "genre_ids": [12, 28, 18, 53]
    },
    {
      "id": 1271,
      "overview": "Based on Frank Miller's graphic novel, \"300\" is very loosely based the 480 B.C. Battle of Thermopylae, where the King of Sparta led his army against the advancing Persians; the battle is said to have inspired all of Greece to band together against the Persians, and helped usher in the world's first democracy.",
      "poster_path": "/9W49fy5G7v9Ed3CXtvMi41YqZtt.jpg",
      "title": "300",
      "vote_average": 7.17,
      "genre_ids": [28, 12, 10752]
    }
]

tmdb_dict = {str(item['id']): item for item in tmdb_results}

updated_movies = []
for movie in movies:
    tid = str(movie.get('tmdbId', ''))
    if tid in tmdb_dict:
        data = tmdb_dict[tid]
        movie['synopsis'] = data['overview']
        movie['description'] = data['overview']
        movie['image'] = 'https://image.tmdb.org/t/p/w500' + data['poster_path']
        movie['rating'] = str(round(data['vote_average'], 1)) + '/10'
        if 'genre_ids' in data:
            gs = [GENRE_MAP.get(gid, 'Drame') for gid in data['genre_ids']]
            movie['genre'] = gs[0] if gs else movie.get('genre', 'Drame')
            movie['tags'] = gs + [str(movie.get('year', ''))]
    updated_movies.append(movie)

with open(movies_path, 'w', encoding='utf-8') as f:
    json.dump(updated_movies, f, indent=2, ensure_ascii=False)

print("Done")
