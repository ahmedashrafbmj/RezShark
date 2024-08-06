"use client";

import React, { useState } from "react";
import Link from "next/link";
import { sideBarStore, useUserStore } from "@/utils/store";
import { usePathname } from "next/navigation";

const Sidebar = () => {
	const currentPage = usePathname();

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [entertainmentOpen, setEntertainmentOpen] = useState(false);
	const [diningOpen, setDiningOpen] = useState(false);

	const setIsOpen = sideBarStore((state) => state.setIsOpen);
	const sideBarOpen = sideBarStore((state) => state.isOpen);
	const userData = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.save);

	const handleDropdownToggle = () => {
		setDropdownOpen(!dropdownOpen);
		setEntertainmentOpen(false);
		setDiningOpen(false);
	};

	const handleEntertainmentToggle = (e: any) => {
		e.stopPropagation();
		setEntertainmentOpen(!entertainmentOpen);
		setDiningOpen(false);
	};

	const handleDiningToggle = (e: any) => {
		e.stopPropagation();
		setDiningOpen(!diningOpen);
		setEntertainmentOpen(false);
	};

	const renderIcon = (state: boolean) => {
		return (
			<span className="transform transition-transform duration-200">
				{state ? (
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				) : (
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 15l7-7 7 7"
						/>
					</svg>
				)}
			</span>
		);
	};

	return (
		<div
			className={`fixed inset-0 bg-gray-900 text-white w-64 transform ${
				sideBarOpen ? "translate-x-0" : "-translate-x-full"
			} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:h-screen flex flex-col z-50 custom-scrollbar`}
		>
			<div className="w-full h-28 min-h-28 flex items-center justify-center relative">
				<h1 className="text-3xl font-bold">Rez Shark</h1>
				<div className="absolute top-4 right-4">
					<button
						className="lg:hidden text-white focus:outline-none"
						onClick={() => setIsOpen()}
					>
						✖
					</button>
				</div>
			</div>
			<nav className="flex-1">
				<ul>
					<Link
						href="/list"
						onClick={() => {
							if (sideBarOpen) {
								setIsOpen();
							}
						}}
					>
						<li
							className={`p-6 hover:bg-blue-700 font-bold ${
								currentPage == "/list" ? "bg-blue-700" : ""
							}`}
						>
							Dashboard
						</li>
					</Link>
					<li
						className={`relative p-6  font-bold cursor-pointer ${
							dropdownOpen ? "pb-0" : "hover:bg-blue-700"
						}`}
						onClick={handleDropdownToggle}
					>
						<div className="flex justify-between items-center">
							<span>Make Reservation</span>
							{renderIcon(dropdownOpen)}
						</div>
						{dropdownOpen && (
							<ul>
								<div
									className={`p-6 mt-4  font-bold  ${
										!entertainmentOpen
											? "hover:bg-blue-700 "
											: "pb-0"
									} `}
									onClick={handleEntertainmentToggle}
								>
									<div className="flex justify-between items-center">
										<span>Entertainment</span>
										{renderIcon(entertainmentOpen)}
									</div>

									{entertainmentOpen && (
										<Link href={"/dashboard"}>
											<li
												className={`px-6 py-6 mt-4 hover:bg-blue-700  font-bold ${
													currentPage == "/dashboard"
														? "bg-blue-700"
														: ""
												}`}
											>
												Golf
											</li>
										</Link>
									)}
								</div>
								<Link href={"#"}>
									<li
										className={`p-6  hover:bg-blue-700 font-bold ${
											currentPage == "/travel"
												? "bg-blue-700"
												: ""
										}`}
									>
										Travel
									</li>
								</Link>
								<li
									className={`p-6   font-bold ${
										!diningOpen
											? "hover:bg-blue-700"
											: "pb-0"
									}`}
									onClick={handleDiningToggle}
								>
									<div className="flex justify-between items-center">
										<span>Dining</span>
										{renderIcon(diningOpen)}
									</div>
									{diningOpen && (
										<ul>
											<li
												className={`px-6 py-6 mt-4 hover:bg-blue-700  font-bold ${
													currentPage == "/resy"
														? "bg-blue-700"
														: ""
												}`}
											>
												Resy
											</li>
											<li
												className={`px-6 py-6  hover:bg-blue-700  font-bold ${
													currentPage == "/resy"
														? "bg-blue-700"
														: ""
												}`}
											>
												Opentable
											</li>
										</ul>
									)}
								</li>
							</ul>
						)}
					</li>

					<Link
						href="/user_details"
						onClick={() => {
							if (sideBarOpen) {
								setIsOpen();
							}
						}}
					>
						<li
							className={`p-6 hover:bg-blue-700 font-bold ${
								currentPage == "/user_details"
									? "bg-blue-700"
									: ""
							}`}
						>
							Your Profile
						</li>
					</Link>

					{userData?.isAdmin ? (
						<Link
							href="/signup"
							onClick={() => {
								if (sideBarOpen) {
									setIsOpen();
								}
							}}
						>
							<li
								className={`p-6 hover:bg-blue-700 font-bold ${
									currentPage == "/signup"
										? "bg-blue-700"
										: ""
								}`}
							>
								Add User
							</li>
						</Link>
					) : null}
					{userData?.isAdmin ? (
						<Link
							href="/users"
							onClick={() => {
								if (sideBarOpen) {
									setIsOpen();
								}
							}}
						>
							<li
								className={`p-6 hover:bg-blue-700 font-bold ${
									currentPage == "/users" ? "bg-blue-700" : ""
								}`}
							>
								View Users
							</li>
						</Link>
					) : null}
					<Link
						onClick={() => {
							if (sideBarOpen) {
								setIsOpen();
							}
							setUser(null);
						}}
						href={"/"}
					>
						<li className={`p-6 hover:bg-blue-700 font-bold`}>
							Sign Out
						</li>
					</Link>
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;
