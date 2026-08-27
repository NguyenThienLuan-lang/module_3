# DailySip — Recommendation Rules & Scoring Matrix

This reference document details the heuristic scoring model, safety exclusions, and symptom-to-ingredient mappings used by the DailySip recommendation engine.

---

## 1. Safety Exclusion Matrix (Hard Filters)

Hard filters execute **first** and strictly remove incompatible drinks from the candidate pool:

| Filter / Allergen | Condition Trigger | Hard Exclusion Rule |
| :--- | :--- | :--- |
| **Lactose Intolerance** | `allergies.includes('lactose')` | Exclude drinks where `containsLactose === true` |
| **Caffeine Sensitivity** | `allergies.includes('caffeine')` or `bodyConditions.includes('caffeine_sensitive')` | Exclude drinks where `containsCaffeine === true` |
| **Peanut / Nut Allergy** | `allergies.includes('peanuts')` | Exclude drinks where `containsNuts === true` |
| **Vegan Diet** | `allergies.includes('vegan')` | Exclude drinks where `isVegan === false` |
| **Temperature Constraint** | `preferences.includes('hot')` | Exclude drinks where `isHotAvailable === false` |

---

## 2. Context Matching & Heuristic Scoring Matrix

Each candidate drink starts with a baseline score of **50 points**. Points are accumulated based on user inputs:

### A. Mood Matching (+25 pts / match)
- **`sleepy`**: Drinks with cold brew, matcha, robusta, citrus energy boosters.
- **`stressed` / `anxious`**: Drinks with chamomile, lotus seed, lavender, warm herbal infusions.
- **`tired`**: Electrolyte-rich, fresh coconut water, vitamin C rich juice.
- **`happy` / `excited`**: Fruity teas, signature cheese foam, artisan kombucha.
- **`relax` / `bored`**: Floral teas, jasmine tea, slow-drip craft coffee.

### B. Body Status Relief (+35 to +50 pts / match)
- **`sore_throat` (+50 pts)**: Hot ginger lemongrass honey, warm kumquat cinnamon (`ginger-lemongrass-citrus-warm`).
- **`internal_heat` (+50 pts)**: Green detox celery green apple, pennywort mung bean coconut (`celery-greenapple-cucumber-detox`, `pennywort-mungbean-coconut`).
- **`bloated` (+50 pts)**: Pineapple mint kombucha with live enzymes & bromelain (`pineapple-mint-kombucha`).
- **`post_workout` (+50 pts)**: Avocado banana plant protein smoothie, fresh coconut water with calamansi and pink salt.
- **`dehydrated` (+50 pts)**: Pure coconut water, chia seed infusions.
- **`cold_flu` (+40 pts)**: Warm herbal citrus teas rich in gingerol and vitamin C.

### C. Dietary Preference Matching
- **`low_sugar`**: +20 pts if `sugarGrams <= 9g`.
- **`no_sugar`**: +25 pts if `sugarGrams <= 5g`.
- **`sour`**: +15 pts for citrus / hibiscus / tamarind / passion fruit.
- **`creamy`**: +15 pts for avocado smoothies, oat milk lattes, coconut milk.
- **`herbal`**: +20 pts for non-caffeinated herb and flower infusions.

### D. Health Goal Matching (+30 pts)
- Goals: `focus`, `stress_relief`, `detox`, `muscle_recovery`, `digestion`, `hydration`, `immunity`.

---

## 3. Store Distance & Ranking Formula (Haversine)

Distances between user coordinates $(lat_1, lon_1)$ and store coordinates $(lat_2, lon_2)$ are computed using the Haversine formula:

$$d = 2R \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta \text{lon}}{2}\right)} \right)$$

Where $R = 6371 \text{ km}$.

Stores are sorted in ascending order of $d$. Only stores with available menu items matching the recommended drinks are presented.
