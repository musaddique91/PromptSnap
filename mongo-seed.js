db = db.getSiblingDB('promptsnap');

if (db.categories.countDocuments() === 0) {
  print("No categories found → inserting defaults");
  db.categories.insertMany([
    { id: UUID().toString(), name: "All Images", slug: "all", count: 0 },
    { id: UUID().toString(), name: "Digital Art", slug: "digital-art", count: 0 },
    { id: UUID().toString(), name: "Photography", slug: "photography", count: 0 },
    { id: UUID().toString(), name: "Portraits", slug: "portraits", count: 0 },
    { id: UUID().toString(), name: "Landscapes", slug: "landscapes", count: 0 },
    { id: UUID().toString(), name: "Abstract", slug: "abstract", count: 0 },
  ]);
}
