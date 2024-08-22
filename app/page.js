import Link from "next/link";
import { IoMail } from "react-icons/io5";
import { BiWorld } from "react-icons/bi";
import dbConnect from "../lib/dbConnect";

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
    return <p> Oops we are sorry !!</p>;
  }
  return (
    <main className="relative">
      {/* Header Section */}
      <header className="w-full h-20 z-10 p-4 md:p-8 flex justify-between items-center bg-black text-white">
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
            <button className="w-10 h-10 text-2xl text-gray-800 bg-transparent border-none cursor-pointer transition-transform duration-300">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <button className="w-10 h-10 text-2xl text-gray-800 bg-transparent border-none cursor-pointer transition-transform duration-300">
              <i className="fa-solid fa-x"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Section */}
      <nav className="flex justify-evenly z-10 py-4 md:py-8 bg-black shadow-md">
        <ul className="flex space-x-4 md:space-x-8">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <a href="https://siemensapc.sharepoint.com/:x:/r/teams/SD-FrameworkAD001/_layouts/15/doc2.aspx?sourcedoc=%7BA6A93113-893D-4304-8B9B-461D465F6159%7D&file=New%20Hardware%20Recd-%20Laptops%20&%20Desktops%20Preparation%20.xlsx=&action=default&mobileredirect=true">
              Preparation
            </a>
          </li>
          <li>
            <a href="https://siemensapc.sharepoint.com/:x:/r/teams/SD-FrameworkAD001/_layouts/15/doc2.aspx?sourcedoc=%7BA6A93113-893D-4304-8B9B-461D465F6159%7D&file=New%20Hardware%20Recd-%20Laptops%20&%20Desktops%20Preparation%20.xlsx=&action=default&mobileredirect=true">
              VendorLog
            </a>
          </li>
          <li>
            <Link href="/hardware">Hardware Allocation</Link>
          </li>
          <li>
            <Link href="/stocks">Stocks</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content Section */}
      <div className="relative w-full flex justify-center items-center mt-20 md:mt-40">
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
              <button className="w-40 md:w-52 h-10 md:h-12 bg-teal-400 border-none rounded cursor-pointer">
                <a
                  href="http://"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full flex items-center justify-center"
                >
                  Register Now
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="fixed right-4 bottom-4 bg-black">
        <button className="w-40 md:w-52 h-10 md:h-12 bg-teal-500 border-none rounded cursor-pointer">
          <a
            href="http://"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full flex items-center justify-center"
          >
            Contact us
          </a>
        </button>
      </footer>
    </main>
  );
}
