"use client";
import Header from "@/components/header";
import Loading from "@/components/loading";
import { withAuth } from "@/components/withAuth";
import { API_URL } from "@/utils/constants";
import { useUserStore } from "@/utils/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type UserData = {
	id: string;
	username: string;
	email: string;
	isAdmin: boolean;
};

function Users() {
	const [isLoading, setIsLoading] = useState(false);
	const [userData, setUserData] = useState<UserData[]>([]);
	const currentUser = useUserStore((state) => state.user);

	const getAllUsers = async () => {
		setIsLoading(true);
		try {
			let response = await axios.get(`${API_URL}/users`);

			setUserData(response.data);
		} catch (error) {
			console.log("ERROR", error);
			setUserData([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getAllUsers();
	}, []);

	const handleDeleteUser = async (userId: string) => {
		try {
			await axios.delete(`${API_URL}/users`, {
				params: {
					userId: userId,
				},
			});

			toast.success("User Deleted Succesfully");
			getAllUsers();
		} catch (error) {
			toast.error("Error Deleting User");
		}
	};

	return isLoading ? (
		<Loading />
	) : (
		<div className="flex-col ">
			<Header title="All Users List" showBack />

			<div className="flex-col md:mx-16 mx-4 space-y-6">
				{/* Table */}
				{/* </div> */}
				<div className="overflow-x-auto">
					<table className="table mt-4">
						{/* head */}
						<thead>
							<tr className="bg-gray-600 text-white text-lg">
								<th>Name</th>
								<th>Email</th>
								<th>User</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{userData?.map((data) => (
								<tr key={data.id}>
									<td>
										<span className="text-base">
											{data.username}
										</span>
									</td>
									<td>
										<span className="text-base">
											{data.email}
										</span>
									</td>
									<td>{data.isAdmin ? "Admin" : "User"}</td>
									<th>
										<button
											className="btn btn-primary hover:bg-slate-800 hover:text-white"
											onClick={() =>
												handleDeleteUser(data.id)
											}
										>
											Delete User
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
}

export default withAuth(Users);
