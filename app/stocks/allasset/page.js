// "use client";
// import { useState, useMemo } from "react";
// import Sidebar from "@/components/Sidebar";

// const teamMembers = [
//   {
//     id: 1,
//     name: "Tyler Hero",
//     tasks: 26,
//     location: "Estonia",
//     status: "Active",
//     flag: "🇪🇪",
//     serialNumber: "123456",
//     model: "Model A",
//     category: "Category A",
//     checkedOutTo: "John Doe",
//     purchaseValue: "$1000",
//     currentValue: "$800",
//     purchaseRequisition: "PR-001",
//     costCenter: "CC-001",
//     receivedDate: "2023-01-01",
//     misStoreLocation: "Location A",
//     checkinCheckout: "Checkin"
//   },
//   {
//     id: 2,
//     name: "Esther Howard",
//     tasks: 639,
//     location: "Malaysia",
//     status: "Pending",
//     flag: "🇲🇾",
//     serialNumber: "654321",
//     model: "Model B",
//     category: "Category B",
//     checkedOutTo: "Jane Doe",
//     purchaseValue: "$2000",
//     currentValue: "$1500",
//     purchaseRequisition: "PR-002",
//     costCenter: "CC-002",
//     receivedDate: "2023-02-01",
//     misStoreLocation: "Location B",
//     checkinCheckout: "Checkout"
//   },
//   {
//     id: 3,
//     name: "Tyler Hero",
//     tasks: 26,
//     location: "Estonia",
//     status: "Deleted",
//     flag: "🇪🇪",
//     serialNumber: "123456",
//     model: "Model A",
//     category: "Category A",
//     checkedOutTo: "John Doe",
//     purchaseValue: "$1000",
//     currentValue: "$800",
//     purchaseRequisition: "PR-001",
//     costCenter: "CC-001",
//     receivedDate: "2023-01-01",
//     misStoreLocation: "Location A",
//     checkinCheckout: "Checkin"
//   },
//   {
//     id: 4,
//     name: "Tyler Hero",
//     tasks: 26,
//     location: "Estonia",
//     status: "Inactive",
//     flag: "🇪🇪",
//     serialNumber: "123456",
//     model: "Model A",
//     category: "Category A",
//     checkedOutTo: "John Doe",
//     purchaseValue: "$1000",
//     currentValue: "$800",
//     purchaseRequisition: "PR-001",
//     costCenter: "CC-001",
//     receivedDate: "2023-01-01",
//     misStoreLocation: "Location A",
//     checkinCheckout: "Checkin"
//   },
//   {
//     id: 5,
//     name: "Tyler Hero",
//     tasks: 26,
//     location: "Estonia",
//     status: "Active",
//     flag: "🇪🇪",
//     serialNumber: "123456",
//     model: "Model A",
//     category: "Category A",
//     checkedOutTo: "John Doe",
//     purchaseValue: "$1000",
//     currentValue: "$800",
//     purchaseRequisition: "PR-001",
//     costCenter: "CC-001",
//     receivedDate: "2023-01-01",
//     misStoreLocation: "Location A",
//     checkinCheckout: "Checkin"
//   },
//   {
//     id: 6,
//     name: "Tyler Hero",
//     tasks: 26,
//     location: "Estonia",
//     status: "Active",
//     flag: "🇪🇪",
//     serialNumber: "123456",
//     model: "Model A",
//     category: "Category A",
//     checkedOutTo: "John Doe",
//     purchaseValue: "$1000",
//     currentValue: "$800",
//     purchaseRequisition: "PR-001",
//     costCenter: "CC-001",
//     receivedDate: "2023-01-01",
//     misStoreLocation: "Location A",
//     checkinCheckout: "Checkin"
//   },
//   {
//     id: 7,
//     name: "Tyler Hero",
//     tasks: 26,
//     location: "Estonia",
//     status: "Active",
//     flag: "🇪🇪",
//     serialNumber: "123456",
//     model: "Model A",
//     category: "Category A",
//     checkedOutTo: "John Doe",
//     purchaseValue: "$1000",
//     currentValue: "$800",
//     purchaseRequisition: "PR-001",
//     costCenter: "CC-001",
//     receivedDate: "2023-01-01",
//     misStoreLocation: "Location A",
//     checkinCheckout: "Checkin"
//   }
//   // Add other team members here...
// ];

// const statuses = ["Active", "Pending", "Deleted", "Inactive"];

// const TeamMembersTable = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [members, setMembers] = useState(teamMembers);
//   const [sortConfig, setSortConfig] = useState({
//     key: "name",
//     direction: "asc"
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const filteredMembers = useMemo(() => {
//     return teamMembers
//       .filter((member) =>
//         // member.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//       .sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key])
//           return sortConfig.direction === "asc" ? -1 : 1;
//         if (a[sortConfig.key] > b[sortConfig.key])
//           return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//   }, [searchTerm, sortConfig]);

//   const paginatedMembers = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredMembers, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

//   const handleSearch = (e) => setSearchTerm(e.target.value);

//   const sortMembers = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }

//     setSortConfig({ key, direction });
//     setMembers((prevMembers) =>
//       [...prevMembers].sort((a, b) => {
//         if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
//         if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
//         return 0;
//       })
//     );
//   };

//   const handlePageChange = (newPage) => setCurrentPage(newPage);

//   const handleItemsPerPageChange = (e) =>
//     setItemsPerPage(parseInt(e.target.value, 10));

//   return (
//     <div className="flex bg-gray-900">
//       <Sidebar />
//       <div className="flex-grow p-5 rounded-lg">
//         <header className="flex justify-between items-center mb-5">
//           <h1 className="text-3xl font-semibold font-serif">Stocks</h1>
//           <div className="flex items-center">
//             <div className="flex items-center relative">
//               <button className="bg-none border-none cursor-pointer">
//                 <lord-icon
//                   src="https://cdn.lordicon.com/fkdzyfle.json"
//                   trigger="hover"
//                   colors="primary:#e4e4e4"
//                   style={{ width: 30, height: 50 }}
//                 ></lord-icon>
//               </button>
//               <input
//                 type="text"
//                 id="search-input"
//                 className="p-1 ml-2 bg-gray-700 text-white rounded"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//               {searchTerm && (
//                 <button
//                   className="ml-2 cursor-pointer text-gray-500"
//                   onClick={() => setSearchTerm("")}
//                 >
//                   ✖
//                 </button>
//               )}
//             </div>
//             <div className="ml-4 cursor-pointer" title="logout">
//               <i className="fa-solid fa-arrow-right-from-bracket"></i>
//             </div>
//           </div>
//         </header>
//         <div className="bg-gray-800 rounded-lg w-full mx-auto">
//           <div className="bg-gray-800 pl-1 pt-4">
//             <div className="container ml-5">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-medium text-white">All Assets</h2>
//                 <input
//                   type="text"
//                   className="p-2 rounded border border-gray-300 bg-gray-800 text-white"
//                   placeholder="Search Members"
//                   value={searchTerm}
//                   onChange={handleSearch}
//                 />
//               </div>
//               <div className="box-border">
//                 <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
//                   <table className="min-w-full bg-gray-800 rounded-lg">
//                     <thead>
//                       <tr className="bg-slate-900 text-gray-400 text-left font-thin">
//                         <th className="p-4 w-[250px]">
//                           <input type="checkbox" />
//                         </th>
//                         <th
//                           className="p-4 cursor-pointer font-medium w-[250px]"
//                           onClick={() => sortMembers("name")}
//                         >
//                           Name{" "}
//                           {sortConfig.key === "name" &&
//                             (sortConfig.direction === "asc" ? "↑" : "↓")}
//                         </th>
//                         <th className="p-4 w-[250px]">Tasks</th>
//                         <th
//                           className="p-4 cursor-pointer font-medium w-[250px]"
//                           onClick={() => sortMembers("location")}
//                         >
//                           Location{" "}
//                           {sortConfig.key === "location" &&
//                             (sortConfig.direction === "asc" ? "↑" : "↓")}
//                         </th>
//                         <th className="p-4 w-[250px]">Serial Number</th>
//                         <th className="p-4 w-[250px]">Model</th>
//                         <th className="p-4 w-[250px]">Category</th>
//                         <th
//                           className="p-4 cursor-pointer font-medium w-[250px]"
//                           onClick={() => sortMembers("status")}
//                         >
//                           Status{" "}
//                           {sortConfig.key === "status" &&
//                             (sortConfig.direction === "asc" ? "↑" : "↓")}
//                         </th>
//                         <th className="p-4 w-[250px]">Checked Out To</th>
//                         <th className="p-4 w-[250px]">Purchase Value</th>
//                         <th className="p-4 w-[250px]">Current Value</th>
//                         <th className="p-4 w-[250px]">Purchase Requisition</th>
//                         <th className="p-4 w-[250px]">Cost Center</th>
//                         <th className="p-4 w-[250px]">Received Date</th>
//                         <th className="p-4 w-[250px]">MIS Store Location</th>
//                         <th className="p-4 w-[250px]">Checkin/Checkout</th>
//                         <th className="p-4 w-[250px]">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {paginatedMembers.map((member) => (
//                         <tr
//                           key={member.id}
//                           className="text-gray-200 border-b border-gray-600"
//                         >
//                           <td className="p-4 w-[250px]">
//                             <input type="checkbox" />
//                           </td>
//                           <td className="p-3 flex items-center space-x-4 w-[250px]">
//                             <img
//                               src={`https://via.placeholder.com/32`}
//                               alt={member.name}
//                               className="rounded-full"
//                             />
//                             <div>
//                               <div className="text-white">{member.name}</div>
//                               <div className="text-gray-400">
//                                 {member.tasks} tasks
//                               </div>
//                             </div>
//                           </td>
//                           <td className="p-4 w-[250px]">{member.tasks}</td>
//                           <td className="p-4 w-[250px]">
//                             <span className="flex items-center">
//                               <span className="mr-2">{member.flag}</span>
//                               {member.location}
//                             </span>
//                           </td>
//                           <td className="p-4 w-[250px]">
//                             {member.serialNumber}
//                           </td>
//                           <td className="p-4 w-[250px]">{member.model}</td>
//                           <td className="p-4 w-[250px]">{member.category}</td>
//                           <td className="p-4 w-[250px]">
//                             <span
//                               className={`px-5 py-2 text-xs font-medium rounded-md ${
//                                 member.status === "Active"
//                                   ? "border border-green-500 text-green-500"
//                                   : member.status === "Pending"
//                                   ? "border border-yellow-500 text-yellow-500"
//                                   : member.status === "Deleted"
//                                   ? "border border-red-500 text-red-500"
//                                   : "border border-gray-500 text-gray-500"
//                               }`}
//                             >
//                               {member.status}
//                             </span>
//                           </td>
//                           <td className="p-4 w-[250px]">
//                             {member.checkedOutTo}
//                           </td>
//                           <td className="p-4 w-[250px]">
//                             {member.purchaseValue}
//                           </td>
//                           <td className="p-4 w-[250px]">
//                             {member.currentValue}
//                           </td>
//                           <td className="p-4 w-[250px]">
//                             {member.purchaseRequisition}
//                           </td>
//                           <td className="p-4 w-[250px]">{member.costCenter}</td>
//                           <td className="p-4 w-[250px]">
//                             {member.receivedDate}
//                           </td>
//                           <td className="p-4 w-[250px]">
//                             {member.misStoreLocation}
//                           </td>
//                           <td className="p-4 w-[250px]">
//                             {member.checkinCheckout}
//                           </td>
//                           <td className="p-4 w-[250px]">
//                             <button className="bg-gray-800 text-white px-5 py-2 rounded-md hover:bg-gray-700 outline outline-1 outline-gray-500">
//                               Edit
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="flex justify-between items-center mt-4">
//                   <div>
//                     <label htmlFor="itemsPerPage" className="text-white">
//                       Items per page:
//                     </label>
//                     <select
//                       id="itemsPerPage"
//                       className="ml-2 p-2 rounded bg-gray-700 text-white"
//                       value={itemsPerPage}
//                       onChange={handleItemsPerPageChange}
//                     >
//                       <option value={5}>5</option>
//                       <option value={10}>10</option>
//                       <option value={20}>20</option>
//                       <option value={50}>50</option>
//                     </select>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                     >
//                       Previous
//                     </button>
//                     <span className="text-white">
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <button
//                       className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamMembersTable;
