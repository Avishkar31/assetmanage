import Link from "next/link";
import { IoMail } from "react-icons/io5";
import { BiWorld } from "react-icons/bi";
import dbConnect from "../lib/dbConnect";
import { TbLogout } from "react-icons/tb";

const connectDb = async () => {
  try {
    await dbConnect();
    console.log("Connected to server!");
    return true;
  } catch (e) {
    console.log("Failed to connect to server!", e);
    return false;
  }
};

export default async function Home() {
  const isConnected = await connectDb();
  if (!isConnected) {
    return <p>Oops, we are sorry!!</p>;
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        className="absolute z-0 top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/bgvideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Header Section */}
      <header className="w-full h-20 z-10 p-4 md:p-8 flex justify-between items-center text-white bg-black bg-opacity-75 fixed top-0">
        <div className="flex items-center">
          <img
            src="https://www.siemens.com/img/svg/logo-dark-3958fff2.svg"
            alt="Siemens"
            className="w-24 md:w-30 h-6"
          />
        </div>
        <div className="flex items-center space-x-4 md:space-x-8">
          <div className="hidden md:flex items-center">
            <span className="text-3xl">
              <BiWorld />
            </span>
            <span className="ml-1">India</span>
          </div>
          <button className="flex items-center space-x-1">
            <span className="text-3xl">
              <IoMail />
            </span>
            <span>Contact</span>
          </button>
          <div className="flex items-center relative">
            <input
              type="text"
              className="hidden md:block h-10 px-4 rounded-lg bg-black text-white outline-none transition-width duration-300 border border-red-100"
              placeholder="Search..."
            />
            <button className="w-10 h-10 text-xl text-gray-800 bg-transparent border-none cursor-pointer transition-transform duration-300">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <button className="w-10 h-10 text-xl text-gray-800 bg-transparent border-none cursor-pointer transition-transform duration-300">
              <i className="fa-solid fa-x"></i>
            </button>
            <span className="text-3xl">
              <TbLogout />
            </span>
          </div>
        </div>
      </header>

      {/* Navigation Section */}
      <nav className="flex justify-evenly z-10 py-4 md:py-8 bg-black bg-opacity-75 shadow-md fixed inset-x-0 top-20 w-full">
        <ul className="flex space-x-4 md:space-x-8 text-white">
          <li className="cursor-pointer">
            <Link href="/">Home</Link>
          </li>
          <li className="cursor-pointer">
            <a
              href="https://siemensapc.sharepoint.com/:x:/r/teams/SD-FrameworkAD001/_layouts/15/doc2.aspx?sourcedoc=%7BA6A93113-893D-4304-8B9B-461D465F6159%7D&file=New%20Hardware%20Recd-%20Laptops%20&%20Desktops%20Preparation%20.xlsx=&action=default&mobileredirect=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              Preparation
            </a>
          </li>
          <li className="cursor-pointer">
            <a
              href="https://siemensapc.sharepoint.com/:x:/r/teams/SD-FrameworkAD001/_layouts/15/doc2.aspx?sourcedoc=%7BA6A93113-893D-4304-8B9B-461D465F6159%7D&file=New%20Hardware%20Recd-%20Laptops%20&%20Desktops%20Preparation%20.xlsx=&action=default&mobileredirect=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              VendorLog
            </a>
          </li>
          <li className="cursor-pointer">
            <Link href="/hardware">Hardware Allocation</Link>
          </li>
          <li className="cursor-pointer">
            <Link href="/stocks">Stocks</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content Section */}
      <div className="relative w-full min-h-screen flex justify-center items-center p-4 z-10">
        <div className="w-11/12 sm:w-4/5 md:w-3/5 p-4 bg-black bg-opacity-50 rounded-lg text-white">
          <div className="mb-4 md:mb-8">
            <h1 className="text-xl md:text-4xl">
              Thinking Automation Ahead Webinar Series
            </h1>
          </div>
          <div className="flex flex-col items-start">
            <p className="mb-4 md:mb-8 text-sm md:text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
              ab iste assumenda repellat, eius, maxime porro sapiente voluptas
              pariatur sunt sed doloremque tempore quos? Ullam voluptatum minima
              alias eaque architecto.
            </p>
            <div>
              <button className="w-40 md:w-52 h-10 md:h-12 bg-teal-600 border-none rounded cursor-pointer">
                <a
                  href="http://"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full flex items-center justify-center"
                >
                  Register Now
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="fixed right-4 bottom-4 z-10 text-white">
        <button className="w-40 md:w-52 h-10 md:h-12 bg-teal-600 border-none rounded cursor-pointer">
          <a
            href="http://"
            target="_blank"
            rel="noopener noreferrer"
            className=" w-full h-full flex items-center justify-center"
          >
            Contact us
          </a>
        </button>
      </footer>
    </main>
  );
}
