import React, { useState } from "react";

function BookGallery() {
  const books = [
    {
      id: 1,
      title: "The Pragmatic Programmer",
      author: "Andy Hunt & Dave Thomas",
      image: "/covers/pragmatic_programmer.jpg",
      description:
        "A guide to becoming a pragmatic, efficient, and adaptable software developer.",
    },

    {
      id: 2,
      title: "You Don’t Know JS: Scope & Closures",
      author: "Kyle Simpson",
      image: "/covers/you_dont_know_js.jpg",
      description:
        "An in-depth exploration of JavaScript concepts like scope, closures, and the nuances of the language.",
    },
    {
      id: 3,
      title: "Deep Learning",
      author: "Ian Goodfellow",
      image: "/covers/deep_learning.jpg",
      description:
        "A foundational book on deep learning techniques, covering neural networks, optimization, and more.",
    },
    {
      id: 4,
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      image: "/covers/sapiens.jpg",
      description:
        "A thought-provoking journey through the history of humankind, exploring biology, culture, and evolution.",
    },
    {
      id: 5,
      title: "Cracking the Coding Interview",
      author: "Gayle Laakmann McDowell",
      image: "/covers/cracking_coding_interview.jpg",
      description:
        "A must-have for tech job seekers, with coding problems, solutions, and interview strategies.",
    },
    {
      id: 6,
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      image: "/covers/thinking_fast_and_slow.jpg",
      description:
        "A fascinating exploration of how our minds make decisions, blending psychology and economics.",
    },
    {
      id: 7,
      title: "Educated",
      author: "Tara Westover",
      image: "/covers/educated.webp",
      description:
        "A memoir of resilience and the transformative power of education in the face of adversity.",
    },
    {
      id: 8,
      title: "Atomic Habits",
      author: "James Clear",
      image: "/covers/atomic_habits.jpg",
      description:
        "Practical advice on building good habits and breaking bad ones through small, consistent changes.",
    },
  ];

  const [currentBook, setCurrentBook] = useState(0);

  const handleNext = () => {
    setCurrentBook((prev) => (prev + 1) % books.length);
  };

  const handlePrevious = () => {
    setCurrentBook((prev) => (prev - 1 + books.length) % books.length);
  };

  const book = books[currentBook];

  return (
    <div className="md:h-[80vh] h-[95vh] w-full relative">
      {/* Background Image */}
      {/* <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
        Explore, Learn, and Grow with These Masterpiecess
      </h1> */}
      <div
        className="h-full w-full flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${book.image})` }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Book Details */}
        <div className="relative z-10 flex flex-row flex-wrap gap-6 items-center justify-around text-center p-6">
          <img
            src={book.image}
            alt={book.title}
            className="h-96 object-cover rounded-md shadow-lg mb-6"
          />
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">{book.title}</h2>
            <p className="text-xl text-gray-300 italic mb-4">{book.author}</p>
            <p className="text-lg text-gray-300 max-w-xl">{book.description}</p>
          </div>
        </div>
      </div>
      {/* Navigation Buttons */}
      <div className="absolute bottom-8 w-full flex justify-center gap-6 z-20">
        <button
          onClick={handlePrevious}
          className="px-6 py-2 bg-green-600 focus:outline-none text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-green-600 focus:outline-none text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BookGallery;
