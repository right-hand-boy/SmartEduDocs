import React from "react";

function FavouriteBooks() {
  const books = [
    {
      id: 1,
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      image: "/covers/algorithms.avif",
      description:
        "A comprehensive guide to algorithms, covering a broad range of topics and commonly referred to as CLRS.",
    },
    {
      id: 2,
      title: "Clean Code",
      author: "Robert C. Martin",
      image: "/covers/clean_code.jpg",
      description:
        "A must-read for software engineers, focusing on writing clean, maintainable, and efficient code.",
    },
    {
      id: 3,
      title: "The Art of Electronics",
      author: "Paul Horowitz, Winfield Hill",
      image: "/covers/art_of_electronics.jpg",
      description:
        "A fundamental resource for electrical engineers, providing a deep dive into circuit design and practical electronics.",
    },
    {
      id: 4,
      title: "Shigley's Mechanical Engineering Design",
      author: "Richard G. Budynas",
      image: "/covers/shigley.jpg",
      description:
        "An essential resource for mechanical engineers, focusing on the principles of machine design and mechanical systems.",
    },
    {
      id: 5,
      title: "Chemical Engineering: Principles and Calculations",
      author: "David M. Himmelblau",
      image: "/covers/chemical_engineering.jpg",
      description:
        "A foundational book for chemical engineers, providing an in-depth look at process design and calculations.",
    },
    {
      id: 6,
      title: "Modern Food Microbiology",
      author: "James M. Jay",
      image: "/covers/food_microbiology.jpg",
      description:
        "A core reference for food engineers and technologists, addressing the role of microbiology in food safety and production.",
    },
  ];

  return (
    <div className="py-10 px-6 bg-green-100">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
        Books: The Gateway to Infinite Possibilities
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <div
            key={book.id}
            className="relative rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-64 object-cover brightness-75"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-transparent">
              <h2 className="text-lg font-bold text-white">{book.title}</h2>
              <p className="text-sm text-gray-300 italic">{book.author}</p>
              <p className="text-sm text-gray-200 mt-2">{book.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavouriteBooks;
