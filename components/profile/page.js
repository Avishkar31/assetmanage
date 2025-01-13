// components/Profile.js
"use client";
import React, { useState } from "react";

const Profile = () => {
  const [imageSrc, setImageSrc] = useState(
    "https://cdn.pixabay.com/photo/2017/08/06/21/01/louvre-2596278_960_720.jpg"
  );

  const loadFile = (event) => {
    const image = URL.createObjectURL(event.target.files[0]);
    setImageSrc(image);
  };

  return (
    <div className="flex justify-between p-5 bg-gray-900 text-white">
      <div className="bg-gray-800 p-5 mr-5 rounded-lg shadow-lg w-1/3 h-96 text-center">
        <div className="relative">
          <label
            className="absolute inset-0 flex items-center justify-center  cursor-pointer hover:bg-opacity-75 transition duration-300"
            htmlFor="file"
          >
            <span className="text-white">Change Image</span>
          </label>
          <input id="file" type="file" onChange={loadFile} className="hidden" />
          <img
            src={imageSrc}
            alt="Profile"
            className="w-40 h-40 object-cover rounded-full mx-auto shadow-md"
          />
        </div>
        <h3 className="mt-4">Avishkar Gadkar</h3>
        <div className="flex justify-center mt-2 space-x-2">
          <span className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-700">
            Administrator
          </span>
          <span className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-700">
            Normal-User
          </span>
        </div>
      </div>
      <div className="bg-gray-800 p-5 rounded-lg shadow-lg w-2/3">
        <h3 className="mb-5">Account Details</h3>
        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-gray-400">
              Username (How your name will appear)
            </label>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue="username"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="first-name" className="block mb-2 text-gray-400">
              First name
            </label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              placeholder="Enter your first name"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last-name" className="block mb-2 text-gray-400">
              Last name
            </label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              placeholder="Enter your last name"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block mb-2 text-gray-400">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue="Pune, Maharashtra"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-gray-400">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue="name@siemens.com"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block mb-2 text-gray-400">
              Phone number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              defaultValue="+91 "
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="birthday" className="block mb-2 text-gray-400">
              Birthday
            </label>
            <input
              type="text"
              id="birthday"
              name="birthday"
              defaultValue="06/10/1988"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
            />
          </div>
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-2 rounded-lg"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
