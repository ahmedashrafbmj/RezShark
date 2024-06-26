"use client";

import Header from "@/components/header";
import Loading from "@/components/loading";
import useSocket from "@/components/useSocket";
import { withAuth } from "@/components/withAuth";
import { API_URL } from "@/utils/constants";
import { useUserStore } from "@/utils/store";
import axios from "axios";
import { NextPage } from "next";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
	const socket = useSocket();

	const [isLoading, setIsLoading] = useState(false);
	const [tableLoading, setTableLoading] = useState(false);
	const userData = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.save);

	const modalRef = useRef<HTMLDialogElement | null>(null);

	const [queryData, setQueryData] = useState<queryType[]>([]);
	const [upcomingData, setUpcomingData] = useState<queryType[]>([]);

	const [currentData, setCurrentData] = useState<queryType>();
	const router = useRouter();

	const setQueryStates = (data: any) => {
		let completeData = data.filter(
			(d: queryType) => d.type == "Booking Complete"
		);
		let otherData = data.filter(
			(d: queryType) => d.type != "Booking Complete"
		);

		setUpcomingData(completeData);
		setQueryData(otherData);
	};

	const getQueriesData = async () => {
		setTableLoading(true);
		try {
			let response = await axios.get(
				`${API_URL}/reservations?isAdmin=${
					userData?.isAdmin ?? false
				}&userId=${userData?.id ?? ""}`
			);

			if (response.data?.length > 0) {
				setQueryStates(response.data);
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

	const removeRequest = async (id: string) => {
		if (confirm("Are you sure you want to delete this service?")) {
			setIsLoading(true);

			try {
				let res = await axios.delete(`${API_URL}/reservation`, {
					params: {
						queryId: id,
					},
				});

				if (res.data) {
					toast.success("Service Delete Successfully");
				} else {
					toast.error("Service Delete Failed");
				}
				getQueriesData();
			} catch (error) {
				console.log("ERROR", error);
				toast.error("Service Delete Failed");
			}

			// Save it!
			console.log("Thing was saved to the database.");
		}
	};

	useEffect(() => {
		getQueriesData();
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on("message", (data: any) => {
				setQueryStates(data);
			});

			const interval = setInterval(() => {
				if (!isLoading) {
					socket.emit("message", userData);
				}
			}, 20000);

			return () => {
				clearInterval(interval);
				socket?.off("message");
			};
		}
	}, [socket]);

	return isLoading ? (
		<Loading />
	) : (
		<div className="flex-col ">
			<Header title={`Welcome, ${userData?.username ?? ""}`} />

			<div className="flex-col mx-16 space-y-6">
				{/* <div className="md:flex md:space-x-4 mb-8">
					<div className="flex-1 flex h-20 bg-blue-500 mt-8 justify-center items-center">
						<span className="text-xl text-white font-bold">
							Entertainment
						</span>
					</div>
					<div className="flex-1 flex h-20 bg-gray-600 mt-8 justify-center items-center">
						<span className="text-xl text-white font-bold">
							Travel
						</span>
					</div>
					<div className="flex-1 flex h-20 bg-blue-500 mt-8 justify-center items-center">
						<span className="text-xl text-white font-bold">
							Dining
						</span>
					</div>
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
								<tr className="bg-gray-600 text-white text-lg">
									<th>Request Number</th>
									<th>Reservation Name</th>
									<th>Date Opened</th>
									<th>Status</th>
									<th>Details</th>
									<th>Delete</th>
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
										<td>
											<button
												className="btn btn-primary bg-blue-700 hover:bg-blue-600 text-white"
												onClick={() => {
													setCurrentData(data);
													modalRef.current?.showModal();
												}}
											>
												All Details
											</button>
										</td>
										<td>
											<button
												className="btn btn-primary bg-red-500 hover:bg-red-400 text-white"
												onClick={() => {
													removeRequest(data.id);
												}}
											>
												Remove
											</button>
										</td>
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
								<tr className="bg-gray-600 text-white text-lg">
									<th>Request Number</th>
									<th>Reservation Name</th>
									<th>Date Opened</th>
									<th>Status</th>
									<th>Start / Stop</th>
									<th>Details</th>
									<th>Delete</th>
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
										<td>
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
										</td>
										<td>
											<button
												className="btn btn-primary bg-blue-700 hover:bg-blue-600 text-white"
												onClick={() => {
													setCurrentData(data);
													modalRef.current?.showModal();
												}}
											>
												All Details
											</button>
										</td>

										<td>
											<button
												className="btn btn-primary bg-red-500 hover:bg-red-400 text-white"
												onClick={() => {
													removeRequest(data.id);
												}}
											>
												Remove
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<dialog id="my_modal_1" className="modal" ref={modalRef}>
				<div className="modal-box  max-w-none md:w-[80%] w-full bg-white ">
					<h3 className="font-bold text-xl">
						{currentData?.resName}
					</h3>
					<div className="py-4">
						<table className="table mt-4">
							<tbody>
								<tr className="bg-gray-600 text-white text-lg">
									<td>Column Names</td>
									<td>Values</td>
								</tr>
								<tr>
									<td className="border-r-2 text-lg font-bold">
										Request Number
									</td>
									<td>
										<span className="text-base">
											{currentData?.id}
										</span>
									</td>
								</tr>
								<tr>
									<td className="border-r-2 text-lg font-bold">
										Reservation Name
									</td>
									<td>
										<span className="text-base">
											{currentData?.resName}
										</span>
									</td>
								</tr>
								<tr>
									<td className="border-r-2 text-lg font-bold">
										Date Opened
									</td>
									<td>
										<span className="text-base">
											{currentData?.dateOpened}
										</span>
									</td>
								</tr>
								<tr>
									<td className="border-r-2 text-lg font-bold">
										Status
									</td>
									<td>{currentData?.type}</td>
								</tr>
								<tr>
									<td className="border-r-2 text-lg font-bold">
										Game Date
									</td>
									<td>{currentData?.gameDate}</td>
								</tr>
								<tr>
									<td className="border-r-2 text-lg font-bold">
										Earliest Time
									</td>
									<td>{currentData?.earliestTime}</td>
								</tr>
								<tr>
									<td className="border-r-2 text-lg font-bold">
										Latest Time
									</td>
									<td>{currentData?.latestTime}</td>
								</tr>
								<tr>
									<td className="border-r-2 text-lg font-bold">
										Player Count
									</td>
									<td>{currentData?.playerCount}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn">Close</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	);
};

export default withAuth(ListPage);
