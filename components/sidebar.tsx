"use client";

import React from "react";
import Link from "next/link";
import { sideBarStore, useUserStore } from "@/utils/store";
import { usePathname } from "next/navigation";

const Sidebar = () => {
	const currentPage = usePathname();

	const setIsOpen = sideBarStore((state) => state.setIsOpen);
	const sideBarOpen = sideBarStore((state) => state.isOpen);
	const userData = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.save);

	return (
		<div
			className={`fixed inset-0 bg-gray-900 text-white w-64 transform ${
				sideBarOpen ? "translate-x-0" : "-translate-x-full"
			} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:h-screen flex flex-col z-50`}
		>
			<div className="w-full h-28 flex items-center justify-center relative">
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
					<Link
						href="/dashboard"
						onClick={() => {
							if (sideBarOpen) {
								setIsOpen();
							}
						}}
					>
						<li
							className={`p-6 hover:bg-blue-700 font-bold ${
								currentPage == "/dashboard" ? "bg-blue-700" : ""
							}`}
						>
							Make Reservation
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
