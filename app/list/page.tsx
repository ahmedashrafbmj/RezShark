"use client";

import { API_URL } from "@/utils/constants";
import { useUserStore } from "@/utils/store";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

interface Props { }

type queryType = {
	dateOpened: string;
	id: string;
	status: boolean;
	type: string;
	userId: string;
};

const ListPage: NextPage<Props> = ({ }) => {
	const [isLoading, setIsLoading] = useState(false);
	const isHydrated = useUserStore((state) => state.isHydrates);
	const userData = useUserStore((state) => state.user);
	console.log(userData, "userData")
	const [queryData, setQueryData] = useState<queryType[]>([]);
	const router = useRouter();
	const getQueriesData = async () => {
		try {
			let response = await axios.get(
				`${API_URL}/queries?isAdmin=${userData?.isAdmin ?? false
				}&userId=${userData?.id ?? ""}`
			);

			setQueryData(response.data);
		} catch (error) {
			console.log("ERROR", error);
			setQueryData([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateStatus = async (id: string) => {
		setIsLoading(true);

		try {
			await axios.put(`${API_URL}/toggleStatus`, {
				queryId: id,
			});
			getQueriesData();
		} catch (error) {
			console.log("ERROR", error);
		}
	};

	useEffect(() => {
		if (isHydrated) {
			getQueriesData();
		}
	}, [isHydrated]);

	if (!isHydrated) {
		return (
			<div className="h-screen flex justify-center items-center">
				<span className="loading loading-spinner text-primary w-20 h-20"></span>
			</div>
		);
	}

	return isLoading ? (
		<div className="h-screen flex justify-center items-center">
			<span className="loading loading-spinner text-primary w-20 h-20"></span>
		</div>
	) : (
		<div className="flex-col ">
			<div className="w-full h-24 bg-blue-700 flex justify-center items-center">
				<span className="text-2xl text-white font-bold">
					Welcome, {userData?.username ?? ""}
				</span>
			</div>
			<div className="flex-col mx-16 space-y-6">
				<div className="md:flex md:space-x-4">
					<div className="flex-1 flex h-20 bg-slate-700 mt-8 justify-center items-center">
						<span className="text-xl text-white font-bold">
							Golf
						</span>
					</div>
					<div className="flex-1 flex h-20 bg-slate-500 mt-8 justify-center items-center">
						<span className="text-xl text-white font-bold">
							Restaurants
						</span>
					</div>
				</div>
				{/* Table */}
				<div className="md:flex md:space-x-4">
				{userData?.isAdmin ? <button
					className="btn btn-primary hover:bg-slate-800 hover:text-white"
					onClick={() =>
						router.push("/signup")
					}
				>
					{"Add User"}
				</button> : ""}
				<button
					className="btn btn-primary hover:bg-slate-800 hover:text-white"
					onClick={() =>
						router.push("/dashboard")
					}
				>
					{"Make Reservation "}
				</button>
				<button
					className="btn btn-primary hover:bg-slate-800 hover:text-white"
					onClick={() =>
						router.push("/")
					}
				>
					{"Sign Out "}
				</button>
				<button
					className="btn btn-primary hover:bg-slate-800 hover:text-white"
					onClick={() =>
						router.push("/")
					}
				>
					{"View Users "}
				</button>

				</div>
				{/* </div> */}
				<div className="overflow-x-auto">
					<table className="table mt-4">
						{/* head */}
						<thead>
							<tr className="bg-slate-700 text-white text-lg">
								<th>Type</th>
								<th>Date Opened</th>
								<th>Status</th>
								<th>Click to Stop</th>
							</tr>
						</thead>
						<tbody>
							{queryData?.map((data) => (
								<tr key={data.id}>
									<td>
										<span className="text-base">
											{data.type}
										</span>
									</td>
									<td>
										<span className="text-base">
											{data.dateOpened}
										</span>
									</td>
									<td>
										{data.status ? "Active" : "In Active"}
									</td>
									<th>
										<button
											className="btn btn-primary hover:bg-slate-800 hover:text-white"
											onClick={() =>
												handleUpdateStatus(data.id)
											}
										>
											{data.status
												? "Stop Service"
												: "Start Service"}
										</button>
									</th>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ListPage;
