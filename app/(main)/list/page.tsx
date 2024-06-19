"use client";

import Header from "@/components/header";
import Loading from "@/components/loading";
import { withAuth } from "@/components/withAuth";
import { API_URL } from "@/utils/constants";
import { useUserStore } from "@/utils/store";
import axios from "axios";
import { NextPage } from "next";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {}

type queryType = {
	dateOpened: string;
	id: string;
	resName: string;
	type: string;
	status: boolean;
	userId: string;
	earliestTime: string;
	gameDate: string;
	latestTime: string;
	playerCount: number;
};

const ListPage: NextPage<Props> = ({}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [tableLoading, setTableLoading] = useState(false);
	const userData = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.save);

	const [queryData, setQueryData] = useState<queryType[]>([]);
	const [upcomingData, setUpcomingData] = useState<queryType[]>([]);
	const router = useRouter();
	const getQueriesData = async () => {
		setTableLoading(true);
		try {
			let response = await axios.get(
				`${API_URL}/reservations?isAdmin=${
					userData?.isAdmin ?? false
				}&userId=${userData?.id ?? ""}`
			);

			if (response.data?.length > 0) {
				let completeData = response.data.filter(
					(d: queryType) => d.type == "Booking Complete"
				);
				let otherData = response.data.filter(
					(d: queryType) => d.type != "Booking Complete"
				);

				setUpcomingData(completeData);
				setQueryData(otherData);
			}
		} catch (error) {
			console.log("ERROR", error);
			setQueryData([]);
		} finally {
			setIsLoading(false);
			setTableLoading(false);
		}
	};

	const handleUpdateStatus = async (id: string, status: boolean) => {
		setIsLoading(true);

		try {
			await axios.put(`${API_URL}/toggleStatus`, {
				queryId: id,
			});

			if (status === true) {
				toast.success("Service Stop Successfully");
			} else {
				toast.success("Service Start Successfully");
			}
			getQueriesData();
		} catch (error) {
			console.log("ERROR", error);
		}
	};

	useEffect(() => {
		getQueriesData();
	}, []);

	return isLoading ? (
		<Loading />
	) : (
		<div className="flex-col ">
			<Header title={`Welcome, ${userData?.username ?? ""}`} />

			<div className="flex-col mx-16 space-y-6">
				<div className="md:flex md:space-x-4 mb-8">
					<div className="flex-1 flex h-20 bg-[#0000A0] mt-8 justify-center items-center">
						<span className="text-xl text-white font-bold">
							Entertainment
						</span>
					</div>
					<div className="flex-1 flex h-20 bg-[#5042FF] mt-8 justify-center items-center">
						<span className="text-xl text-white font-bold">
							Travel
						</span>
					</div>
					<div className="flex-1 flex h-20 bg-[#0000A0] mt-8 justify-center items-center">
						<span className="text-xl text-white font-bold">
							Dining
						</span>
					</div>
				</div>

				{/* Table */}
				{/* <div className="md:flex md:justify-between md:space-x-4">
					{userData?.isAdmin ? (
						<button
							className="flex-1 btn btn-primary hover:bg-slate-800 hover:text-white"
							onClick={() => router.push("/signup")}
						>
							{"Add User"}
						</button>
					) : (
						""
					)}
					<button
						className="flex-1 btn btn-primary hover:bg-slate-800 hover:text-white"
						onClick={() => router.push("/dashboard")}
					>
						{"Make Reservation "}
					</button>
					{userData?.isAdmin ? (
						<button
							className="flex-1 btn btn-primary hover:bg-slate-800 hover:text-white"
							onClick={() => router.push("/users")}
						>
							{"View Users "}
						</button>
					) : null}
					<button
						className="flex-1 btn btn-primary hover:bg-slate-800 hover:text-white"
						onClick={() => {
							setUser(null);
							router.push("/");
						}}
					>
						{"Sign Out "}
					</button>
				</div> */}

				{tableLoading ? (
					<div className="flex justify-center items-center">
						<span className="loading loading-spinner text-primary w-6 h-6"></span>
					</div>
				) : (
					<div className="overflow-x-auto">
						<span className="text-4xl font-bold">
							Upcoming Reservations
						</span>
						<table className="table mt-4">
							{/* head */}
							<thead>
								<tr className="bg-slate-700 text-white text-lg">
									<th>Request Number</th>
									<th>Reservation Name</th>
									<th>Date Opened</th>
									<th>Status</th>
									<th>Game Date</th>
									<th>Earliest Time</th>
									<th>Latest Time</th>
									<th>Player Count</th>
								</tr>
							</thead>
							<tbody>
								{upcomingData?.map((data) => (
									<tr key={data.id}>
										<td>
											<span className="text-base">
												{data.id}
											</span>
										</td>
										<td>
											<span className="text-base">
												{data.resName}
											</span>
										</td>
										<td>
											<span className="text-base">
												{data.dateOpened}
											</span>
										</td>
										<td>{data.type}</td>
										<td>{data.gameDate}</td>
										<td>{data.earliestTime}</td>
										<td>{data.latestTime}</td>
										<td>{data.playerCount}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<div className="md:h-2 h-0" />

				{/* </div> */}
				{tableLoading ? (
					<div className="flex justify-center items-center">
						<span className="loading loading-spinner text-primary w-6 h-6"></span>
					</div>
				) : (
					<div className="overflow-x-auto">
						<span className="text-4xl font-bold">
							Pending Reservations
						</span>
						<table className="table mt-4">
							{/* head */}
							<thead>
								<tr className="bg-slate-700 text-white text-lg">
									<th>Request Number</th>
									<th>Reservation Name</th>
									<th>Date Opened</th>
									<th>Status</th>
									<th>Game Date</th>
									<th>Earliest Time</th>
									<th>Latest Time</th>
									<th>Player Count</th>
									<th>Click to Stop</th>
								</tr>
							</thead>
							<tbody>
								{queryData?.map((data) => (
									<tr key={data.id}>
										<td>
											<span className="text-base">
												{data.id}
											</span>
										</td>
										<td>
											<span className="text-base">
												{data.resName}
											</span>
										</td>
										<td>
											<span className="text-base">
												{data.dateOpened}
											</span>
										</td>
										<td>{data.type}</td>
										<td>{data.gameDate}</td>
										<td>{data.earliestTime}</td>
										<td>{data.latestTime}</td>
										<td>{data.playerCount}</td>
										<th>
											<button
												className="btn btn-primary hover:bg-slate-800 hover:text-white"
												onClick={() =>
													handleUpdateStatus(
														data.id,
														data.status
													)
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
				)}
			</div>
		</div>
	);
};

export default withAuth(ListPage);
