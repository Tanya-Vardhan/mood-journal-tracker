import { Link } from 'react-router-dom';

function HomePage() {
  // const mainBg removed
  const bottomBg = "https://res.cloudinary.com/dgj1gzq0l/image/upload/v1764738887/Frame_7_scnhdq.svg";

  return (
    // PARENT CONTAINER: Flex column layout, dark background
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e1a78] to-[#2d0b5e]">

      {/* --- DIV 1: TOP SECTION (Text & Purple Background) --- */}
      {/* h-[55vh] means this div takes up top 55% of the screen height */}
      <div
        className="h-[55vh] w-full flex items-center justify-center"

      >
        <div className="max-w-[70vw] text-center px-4 mt-10">
          <h1 className="text-4xl md:text-5xl text-white font-extrabold mb-6">
            Welcome to Mood Journal Tracker
          </h1>
          <p className="text-xl text-white mb-8">
            Track your moods, reflect on your day, and see your progress over time.
          </p>
          <Link
            to="/auth"
            className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform duration-300 font-bold text-lg px-10 py-4"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* --- DIV 2: BOTTOM SECTION (Faces Illustration) --- */}
      {/* h-[45vh] means this div takes up bottom 45% of the screen */}
      <div
        className="h-[45vh] w-full bg-bottom bg-no-repeat"
        style={{
          backgroundImage: `url(${bottomBg})`,
          backgroundSize: '100% auto' // Forces image to fit width, height adjusts automatically
        }}
      >
        {/* Empty div just for showing the image */}
      </div>

    </div>
  );
}

export default HomePage;
